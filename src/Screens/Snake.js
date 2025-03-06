import React from 'react';
import "../style/Snake.css";
import { useState, useEffect, useCallback } from "react";
import phone from "../images/nokia-phone.png";
import { MdSettingsApplications } from "react-icons/md";
import { BsPlayBtnFill, BsPauseBtnFill } from "react-icons/bs";

const Snake = () => {
  const gridHeight = 12;
  const gridWidth = 20;
  const rows = [...Array(gridHeight).keys()];
  const columns = [...Array(gridWidth).keys()];
  let grid = [];

  const SNAKE_LOCAL_STORAGE = "snake_preferred_speed";
  let storedSnake = localStorage.getItem(SNAKE_LOCAL_STORAGE);

  let preferredSpeed = storedSnake !== null ? parseInt(storedSnake) : null;

  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState("up");
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
  ]);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [snakeSpeed, setSnakeSpeed] = useState(
    preferredSpeed !== null ? preferredSpeed : 75
  );

  useEffect(() => {
    localStorage.setItem(SNAKE_LOCAL_STORAGE, snakeSpeed.toString());
  }, [snakeSpeed]);

  const [gameOverTransition, setGameOverTransition] = useState(true);
  const setTransition = () => {
    setGameOverTransition(false);
  };

  const [apple, setApple] = useState({ x: 15, y: 10 });

  const restart = () => {
    window.location.reload(false);
  };

  const freeSpots = (snake) => {
    let emptySpots = [];
    rows.forEach((y) => {
      columns.forEach((x) => {
        if (snake.find((item) => item.x === x && item.y === y) === undefined) {
          emptySpots.push({ x: x, y: y });
        }
      });
    });
    return emptySpots;
  };

  const moveSnake = (state) => {
    if (gameOver) {
      return [...state];
    }
    const head = state[0];
    let prev = [...state];
    let newSnake = [];
    let appleHit = false;
    let newHead = {};
    if (direction === "right") {
      if (head.x === gridWidth - 1) {
        newHead = { x: 0, y: head.y };
      } else {
        newHead = { x: head.x + 1, y: head.y };
      }
    }
    if (direction === "left") {
      if (head.x === 0) {
        newHead = { x: gridWidth - 1, y: head.y };
      } else {
        newHead = { x: head.x - 1, y: head.y };
      }
    }
    if (direction === "up") {
      if (head.y === 0) {
        newHead = { x: head.x, y: gridHeight - 1 };
      } else {
        newHead = { x: head.x, y: head.y - 1 };
      }
    }
    if (direction === "down") {
      if (head.y === gridHeight - 1) {
        newHead = { x: head.x, y: 0 };
      } else {
        newHead = { x: head.x, y: head.y + 1 };
      }
    }
    newSnake.push(newHead);
    if (newHead.x === apple.x && newHead.y === apple.y) {
      appleHit = true;
    }

    if (
      prev.find((item) => item.x === newHead.x && item.y === newHead.y) !==
      undefined
    ) {
      setGameOver(true);
    }

    for (let i = 1; i < prev.length + (appleHit ? 1 : 0); i++) {
      newSnake.push(prev[i - 1]);
    }

    if (appleHit) {
      setScore((state) => state + 1);
      setApple((state) => {
        let temp = freeSpots(newSnake);
        return temp[Math.floor(Math.random() * temp.length)];
      });
    }
    return newSnake;
  };

  useEffect(() => {
    if (!gameOver && !paused) {
      setSnake((state) => {
        return moveSnake(state);
      });
      const interval = setInterval(() => {
        setSnake((state) => {
          return moveSnake(state);
        });
      }, snakeSpeed);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line
  }, [direction, gameOver, apple, paused]);

  useEffect(() => {
    if (gameOver) {
      var killId = setTimeout(function () {
        for (var i = killId; i > 0; i--) clearInterval(i);
      }, 1);
    }

    if (gameOver) {
      const timeout = setTimeout(setTransition, 2000);
      return () => clearTimeout(timeout);
    }
    // eslint-disable-next-line
  }, [gameOver]);

  const emptyGrid = () => {
    let tempGrid = [];

    rows.forEach((x) => {
      let row = [];
      columns.forEach((y) => {
        row.push("empty");
      });
      tempGrid.push(row);
    });

    return tempGrid;
  };

  const addSnake = (grid, snakeList) => {
    let tempGrid = [...grid];
    snakeList.forEach((snake) => {
      tempGrid[snake.y][snake.x] = "snake";
    });
    return tempGrid;
  };

  const addApple = (grid) => {
    let tempGrid = [...grid];
    tempGrid[apple.y][apple.x] = "apple";
    return tempGrid;
  };

  grid = emptyGrid();
  grid = addSnake(grid, snake);
  grid = addApple(grid);

  const toRight = () => {
    if (gameOver || paused) {
      return;
    }
    setDirection((state) => {
      if (state === "left") {
        return state;
      } else {
        return "right";
      }
    });
  };

  const toLeft = () => {
    if (gameOver || paused) {
      return;
    }
    setDirection((state) => {
      if (state === "right") {
        return state;
      } else {
        return "left";
      }
    });
  };

  const toUp = () => {
    if (gameOver || paused) {
      return;
    }
    setDirection((state) => {
      if (state === "down") {
        return state;
      } else {
        return "up";
      }
    });
  };

  const toDown = () => {
    if (gameOver || paused) {
      return;
    }
    setDirection((state) => {
      if (state === "up") {
        return state;
      } else {
        return "down";
      }
    });
  };

  // eslint-disable-next-line
  const handleKeyDown = useCallback((event) => {
    // eslint-disable-next-line
    switch (event.key) {
      case "ArrowUp":
        toUp();
        break;
      case "ArrowDown":
        toDown();
        break;
      case "ArrowRight":
        toRight();
        break;
      case "ArrowLeft":
        event.preventDefault();
        toLeft();
        break;
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [handleKeyDown]);

  const Pixel = (props) => {
    return (
      <div>
        {props.type === "empty" && (
          <div key={props.keyI} className="pixel"></div>
        )}
        {props.type === "snake" && (
          <div
            key={props.keyI}
            className={
              gameOver && gameOverTransition
                ? "pixel snake gameover"
                : "pixel snake"
            }
          ></div>
        )}
        {props.type === "apple" && (
          <div
            key={props.keyI}
            className={gameOver && gameOverTransition ? "pixel" : "pixel apple"}
          ></div>
        )}
      </div>
    );
  };

  return (
    <div className="snake-outer">
      <div className="snake-inner">
        <div className="phone-outer">
          <img className="phone-image" alt="phone" src={phone}></img>
          <div className="screen">
            <div className="score-bar">
              {score.toString().padStart(4, "0")}
              <div
                className="snake_pause_play_button"
                onClick={() => {
                  setPaused((state) => !state);
                }}
              >
                {!gameOver && (paused ? <BsPlayBtnFill /> : <BsPauseBtnFill />)}
              </div>
              <div
                className="snake_settings_button"
                onClick={() => {
                  setPaused(true);
                  setSettingsVisible(true);
                }}
              >
                <MdSettingsApplications />
              </div>
            </div>

            <div className="grid">
              {rows.map((row) => {
                return (
                  <div key={Math.random().toString()} className="grid-row">
                    {columns.map((column) => {
                      return (
                        <div key={Math.random().toString()}>
                          <Pixel
                            keyI={row.toString() + "," + column.toString()}
                            type={grid[row][column]}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          {settingsVisible && (
            <div className="settings_screen">
              Snake speed
              <div
                className={
                  snakeSpeed === 100
                    ? "snake_speed_option active"
                    : "snake_speed_option"
                }
                onClick={() => {
                  setSnakeSpeed(100);
                }}
              >
                Slow
              </div>
              <div
                className={
                  snakeSpeed === 75
                    ? "snake_speed_option active"
                    : "snake_speed_option"
                }
                onClick={() => {
                  setSnakeSpeed(75);
                }}
              >
                Normal
              </div>
              <div
                className={
                  snakeSpeed === 50
                    ? "snake_speed_option active"
                    : "snake_speed_option"
                }
                onClick={() => {
                  setSnakeSpeed(50);
                }}
              >
                Fast
              </div>
              <div
                className={
                  snakeSpeed === 35
                    ? "snake_speed_option active"
                    : "snake_speed_option"
                }
                onClick={() => {
                  setSnakeSpeed(35);
                }}
              >
                Super fast
              </div>
              <div
                onClick={() => {
                  setSettingsVisible(false);
                  setTimeout(() => {
                    setPaused(false);
                  }, 1000);
                }}
              >
                {"<- Back ->"}
              </div>
            </div>
          )}

          {gameOver && !gameOverTransition && (
            <div
              className="game_over_screen"
              onClick={() => {
                restart();
              }}
            >
              Game over
              <p>Click to restart</p>
            </div>
          )}
          <div
            className="snake_button left"
            onClick={() => {
              toLeft();
            }}
          ></div>
          <div
            className="snake_button right"
            onClick={() => {
              toRight();
            }}
          ></div>
          <div
            className="snake_button top"
            onClick={() => {
              toUp();
            }}
          ></div>
          <div
            className="snake_button bottom"
            onClick={() => {
              toDown();
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Snake;
