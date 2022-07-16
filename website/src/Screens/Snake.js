import "../style/Snake.css";
import { useState, useEffect, useCallback } from "react";

import { FiPhone } from "react-icons/fi";
import { MdSpaceBar } from "react-icons/md";
import { RiHome2Line } from "react-icons/ri";
import { createPath } from "react-router-dom";

const Snake = () => {
  const gridHeight = 20;
  const gridWidth = 25;
  const rows = [...Array(gridHeight).keys()];
  const columns = [...Array(gridWidth).keys()];
  let grid = [];


  const [gameOver, setGameOver] = useState(false);

  const [direction, setDirection] = useState("up");
  const [length, setLength] = useState(2);
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
  ]);

  const [apple, setApple] = useState({ x: 15, y: 10 });

  const freeSpots = (snake) => {
    let emptySpots = [];
    console.log(snake);
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
      setApple((state) => {
        let temp = freeSpots(newSnake);
        return temp[Math.floor(Math.random() * temp.length)];
      });
    }
    return newSnake;
  };

  useEffect(() => {
    if (!gameOver) {
      setSnake((state) => {
        return moveSnake(state);
      });
      const interval = setInterval(() => {
        setSnake((state) => {
          return moveSnake(state);
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [direction, gameOver, apple]);

  useEffect(() => {
    if (gameOver) {
      var killId = setTimeout(function () {
        for (var i = killId; i > 0; i--) clearInterval(i);
      }, 1);
    }
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

  const handleKeyDown = useCallback((event) => {
    switch(event.key){
        case "ArrowUp":
            setDirection(state => {
                if (state === "down") {
                    return state;
                } else {
                    return "up"
                }
            });
            break;
        case "ArrowDown":
            setDirection(state => {
                if (state === "up") {
                    return state;
                } else {
                    return "down"
                }
            });
            break;
        case "ArrowRight":
            setDirection(state => {
                if (state === "left") {
                    return state;
                } else {
                    return "right"
                }
            });
            break;
        case "ArrowLeft":
            event.preventDefault();
            setDirection(state => {
                if (state === "right") {
                    return state;
                } else {
                    return "left"
                }
            });
            break;
    }
  });

  const handleScroll = useCallback(event => {
    console.log("Yes");
    event.preventDefault();
  })

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
    }
  }, [handleKeyDown]);

  // useEffect(() => {
  //   window.addEventListener("touchstart",handleScroll, {passive: false} )

  //   return () => {
  //       window.removeEventListener("touchstart",handleScroll, {passive: false} );
  //   }
  // },[handleScroll])

  const Pixel = (props) => {
    return (
        <div>
      
        {props.type === "empty" && (
            <div className="pixel">
          {/* <div className="pixel-row">
            <div className="pixel-empty"></div>
            <div className="pixel-empty"></div>
            <div className="pixel-empty"></div>
          </div>
          <div className="pixel-row">
            <div className="pixel-empty"></div>
            <div className="pixel-empty"></div>
            <div className="pixel-empty"></div>
          </div>
          <div className="pixel-row">
            <div className="pixel-empty"></div>
            <div className="pixel-empty"></div>
            <div className="pixel-empty"></div>
          </div> */}
          </div>

        )}
        {props.type === "snake" && (
            <div className="pixel snake">
          
          </div>

        )}
        {props.type === "apple" && (
            <div className="pixel apple">

          </div>

        )}
        </div>
    );
  };

  return (
    <div className="snake-outer">
      <div className="snake-inner">
        <div className="phone">
          <div className="screen">
            <div className="score-bar"></div>
            <div className="grid">
              {rows.map((row) => {
                return (
                  <div className="grid-row">
                    {columns.map((column) => {
                      return (
                        <div>
                            <Pixel type={grid[row][column]} />
                          {/* {grid[row][column] === "empty" && (
                            <div className="empty-tile"></div>
                          )}
                          {grid[row][column] === "snake" && (
                            <div className="snake-tile"></div>
                          )}
                          {grid[row][column] === "apple" && (
                            <div className="apple-tile"></div>
                          )} */}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="phone-buttons">
            <div className="row">
              <div className="button">
                <div className="inner">
                  <div className="number">1</div>
                  <div className="rest">
                    <FiPhone />
                  </div>
                </div>
              </div>
              <div
                className="button"
                onClick={() => {
                  setDirection((state) => {
                    if (state === "down") {
                      return state;
                    }
                    return "up";
                  });
                }}
              >
                <div className="inner">
                  <div className="number">2</div>
                  <div className="rest">abc</div>
                </div>
              </div>
              <div className="button">
                <div className="inner">
                  <div className="number">3</div>
                  <div className="rest">def</div>
                </div>
              </div>
            </div>
            <div
              className="row"
              onClick={() => {
                setDirection((state) => {
                  if (state === "right") {
                    return state;
                  }
                  return "left";
                });
              }}
            >
              <div className="button">
                <div className="inner">
                  <div className="number">4</div>
                  <div className="rest">ghi</div>
                </div>
              </div>
              <div className="button">
                <div className="inner">
                  <div className="number">5</div>
                  <div className="rest">jkl</div>
                </div>
              </div>
              <div
                className="button"
                onClick={() => {
                  setDirection((state) => {
                    if (state === "left") {
                      return state;
                    }
                    return "right";
                  });
                }}
              >
                <div className="inner">
                  <div className="number">6</div>
                  <div className="rest">mno</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="button">
                <div className="inner">
                  <div className="number">7</div>
                  <div className="rest">pqrs</div>
                </div>
              </div>
              <div
                className="button"
                onClick={() => {
                  setDirection((state) => {
                    if (state === "up") {
                      return state;
                    }
                    return "down";
                  });
                }}
              >
                <div className="inner">
                  <div className="number">8</div>
                  <div className="rest">tuv</div>
                </div>
              </div>
              <div className="button">
                <div className="inner">
                  <div className="number">9</div>
                  <div className="rest">wxyz</div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="button">
                <div className="inner">
                  <div className="number" style={{ fontSize: 35 }}>
                    *
                  </div>
                  <div className="rest" style={{ alignSelf: "center" }}>
                    +
                  </div>
                </div>
              </div>
              <div className="button">
                <div className="inner">
                  <div className="number">0</div>
                  <div className="rest">
                    <MdSpaceBar />
                  </div>
                </div>
              </div>
              <div className="button">
                <div className="inner">
                  <div className="number">#</div>
                  <div className="rest">
                    <RiHome2Line />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Snake;
