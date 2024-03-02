import "../style/Tetris.css";
import { useEffect, useState } from "react";
import {
  MdOutlineRotateRight,
  MdPauseCircleFilled,
  MdPlayCircleFilled,
} from "react-icons/md";
import { ImArrowDown, ImArrowLeft, ImArrowRight } from "react-icons/im";
import { useInterval } from "../util/useInterval";
import GameOverScreen from "./TetrisScreens/GameOverScreen";

const Tetris = () => {
  const [currentBlock, setCurrentBlock] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  let speedMemory = 800;
  const [speed, setSpeed] = useState(speedMemory);
  const [removingRows, setRemovingRows] = useState([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [nextBlocks, setNextBlocks] = useState([]);
  const [start, setStart] = useState(true);
  const [gameOverScreenVisible, setGameOverScreenVisible] = useState(false);
  const [usingTouchscreen, setUsingTouchscreen] = useState(false);
  const [paused, setPaused] = useState(false);


  const intialActivity = {
    left: null,
    right: null,
    down: null,
  };

  // eslint-disable-next-line
  const [activeActions, setActiveActions] = useState(intialActivity);

  const TETRIS_STORAGE_STRING = "tetris_highscores";

  const highscores =
    localStorage.getItem(TETRIS_STORAGE_STRING) === null
      ? [0, 0, 0, 0, 0]
      : JSON.parse(localStorage.getItem(TETRIS_STORAGE_STRING));

  useEffect(() => {
    if (localStorage.getItem(TETRIS_STORAGE_STRING) === null) {
      localStorage.setItem(
        TETRIS_STORAGE_STRING,
        JSON.stringify([0, 0, 0, 0, 0])
      );
    }
  }, []);
  useEffect(() => {
    setLevel(Math.floor(lines / 10));
  }, [lines]);

  const blocks = [
    {
      id: "1",
      init: [
        [1, 0],
        [1, 1],
        [1, 2],
        [1, 3],
      ],
      rotations: [
        [
          [2, 0],
          [2, 1],
          [2, 2],
          [2, 3],
        ],
        [
          [0, 2],
          [1, 2],
          [2, 2],
          [3, 2],
        ],
        [
          [2, 0],
          [2, 1],
          [2, 2],
          [2, 3],
        ],
        [
          [0, 1],
          [1, 1],
          [2, 1],
          [3, 1],
        ],
      ],
    },
    {
      id: "2",
      init: [
        [0, 0],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      rotations: [
        [
          [1, 0],
          [2, 0],
          [2, 1],
          [2, 2],
        ],
        [
          [0, 2],
          [0, 1],
          [1, 1],
          [2, 1],
        ],
        [
          [2, 2],
          [1, 2],
          [1, 1],
          [1, 0],
        ],
        [
          [2, 0],
          [2, 1],
          [1, 1],
          [0, 1],
        ],
      ],
    },
    {
      id: "3",
      init: [
        [1, 0],
        [1, 1],
        [1, 2],
        [0, 2],
      ],
      rotations: [
        [
          [2, 0],
          [2, 1],
          [2, 2],
          [1, 2],
        ],
        [
          [0, 1],
          [1, 1],
          [2, 1],
          [2, 2],
        ],
        [
          [1, 2],
          [1, 1],
          [1, 0],
          [2, 0],
        ],
        [
          [2, 1],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    },
    {
      id: "4",
      init: [
        [0, 1],
        [0, 2],
        [1, 1],
        [1, 2],
      ],
      rotations: [],
    },
    {
      id: "5",
      init: [
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 2],
      ],
      rotations: [
        [
          [2, 0],
          [2, 1],
          [1, 1],
          [1, 2],
        ],
        [
          [0, 1],
          [1, 1],
          [1, 2],
          [2, 2],
        ],
        [
          [2, 0],
          [2, 1],
          [1, 1],
          [1, 2],
        ],
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [2, 1],
        ],
      ],
    },
    {
      id: "6",
      init: [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      rotations: [
        [
          [1, 1],
          [2, 0],
          [2, 1],
          [2, 2],
        ],
        [
          [1, 2],
          [0, 1],
          [1, 1],
          [2, 1],
        ],
        [
          [2, 1],
          [1, 0],
          [1, 1],
          [1, 2],
        ],
        [
          [1, 0],
          [0, 1],
          [1, 1],
          [2, 1],
        ],
      ],
    },

    {
      id: "7",
      init: [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 2],
      ],
      rotations: [
        [
          [1, 0],
          [1, 1],
          [2, 1],
          [2, 2],
        ],
        [
          [0, 2],
          [1, 2],
          [1, 1],
          [2, 1],
        ],
        [
          [1, 0],
          [1, 1],
          [2, 1],
          [2, 2],
        ],
        [
          [0, 1],
          [1, 1],
          [1, 0],
          [2, 0],
        ],
      ],
    },
  ];

  let cols = [...Array(10).fill({ filled: false, id: null })];
  let initGrid = [...Array(20).fill(cols)];
  const [grid, setGrid] = useState(initGrid);

  const newBlock = (state) => {
    let tempNextBlocks = [...nextBlocks];
    while (tempNextBlocks.length < 4) {
      let tempPossibleBlocks = blocks.filter(
        (x) => !tempNextBlocks.map((item) => item.id).includes(x.id)
      );
      let tempNewBlock =
        tempPossibleBlocks[
        Math.floor(Math.random() * tempPossibleBlocks.length)
        ];
      tempNextBlocks.push(tempNewBlock);
    }
    let block = tempNextBlocks.shift();
    setNextBlocks((state) => tempNextBlocks);
    let start_x = 0;
    let start_y = 3;
    let currentPos = [];
    for (let i = 0; i < block.init.length; i++) {
      let [x, y] = block.init[i];
      let new_x = start_x + x;
      let new_y = start_y + y;
      if (grid[new_x][new_y].filled) {
        if (!gameOver) {
          setGameOver(true);
        }
        return null;
      }
      currentPos.push([new_x, new_y]);
    }

    return {
      pos: currentPos,
      id: block.id,
      orientation: 0,
      rotations: block.rotations,
    };
  };

  const moveDownOne = (current) => {
    if (removingRows.length > 0) {
      return current;
    }

    if (current === null || grid === null) return current;
    let tempCur = { ...current };
    let current_pos = tempCur.pos;
    let newPos = [];
    let movable = true;
    let current_id = tempCur.id;
    for (let i = 0; i < current_pos.length; i++) {
      const [cur_x, cur_y] = current_pos[i];
      if (
        cur_x === 19 ||
        (!grid[cur_x + 1][cur_y].current && grid[cur_x + 1][cur_y].filled)
      ) {
        movable = false;
        break;
      }
      newPos.push([cur_x + 1, cur_y]);
    }

    if (!movable) {
      clearDirectionalInterval("down");
      setGrid((state) => {
        let tempGrid = [...state];
        for (let i = 0; i < current_pos.length; i++) {
          let [x, y] = current_pos[i];
          let tempRow = [...tempGrid[x]];
          tempRow[y] = { filled: true, id: current_id };
          tempGrid[x] = tempRow;
        }
        return tempGrid;
      });
      return null;
    }

    tempCur.pos = newPos;
    return tempCur;
  };

  const checkRows = () => {
    let rows = [];
    for (let row = 0; row < grid.length; row++) {
      let complete = true;
      for (let col = 0; col < grid[row].length; col++) {
        if (!grid[row][col].filled) {
          complete = false;
          break;
        }
      }
      if (complete) {
        rows.push(row);
      }
    }
    return rows;
  };

  const makeMove = (direction, action, intervalSize) => {
    if (paused || gameOver || removingRows.length > 0) return;
    const oposites = {
      right: "left",
      left: "right",
      down: "down"
    }
    setActiveActions((state) => {
      let temp = { ...state };
      if (temp[direction] === null && temp[oposites[direction]] === null) {
        action();
        temp[direction] = setInterval(() => {
          action();
        }, intervalSize);
      }
      return temp;
    })
  }



  const clearDirectionalInterval = (dir) => {
    setActiveActions((state) => {
      let temp = { ...state };
      if (temp[dir] === null) return temp;
      clearInterval(temp[dir]);
      temp[dir] = null;
      return temp;
    });
  }

  const clearIntervals = (direction) => {
    if (!direction) return;
    switch (direction) {
      case "ArrowRight":
        clearDirectionalInterval("right");
        break;
      case "ArrowLeft":
        clearDirectionalInterval("left");
        break;
      case "ArrowDown":
        clearDirectionalInterval("down");
        break;
      default:
        return;
    }
  }

  const downPressed = () => {
    makeMove("down",
      () => {
        setScore((state) => state + 1);
        setCurrentBlock((state) => moveDownOne(state));
      },
      50
    );
  };

  const leftPressed = () => {
    makeMove("left",
      () => {
        setCurrentBlock((state) => moveToLeft(state));
      },
      100
    );
  };

  const rightPressed = () => {
    makeMove("right",
      () => {
        setCurrentBlock((state) => moveToRight(state));
      },
      100
    );
  };

  const keyboardEvent = (event) => {
    if (event.repeat) return;
    event.preventDefault();

    if (event.key === "ArrowLeft") {
      leftPressed();
    }
    if (event.key === "ArrowRight") {
      rightPressed();
    }
    if (event.key === "ArrowDown") {
      downPressed();
    }
    if (event.key === "Control") {
      setCurrentBlock((state) => rotateRight(state));
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyboardEvent);
    return () => document.removeEventListener("keydown", keyboardEvent);
    // eslint-disable-next-line
  }, [grid, removingRows]);

  useEffect(() => {
    document.addEventListener("keyup", (event) => {
      clearIntervals(event.key);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let rowsComplete = checkRows();
    if (rowsComplete.length === 0) {
      setCurrentBlock((state) => newBlock(state));
    }
    setRemovingRows(rowsComplete);
    // eslint-disable-next-line
  }, [grid]);

  useEffect(() => {
    if (removingRows.length > 0) {
      setActiveActions(state => intialActivity);
      let rows = removingRows.length;
      setTimeout(() => {
        setGrid((state) => {
          let tempGrid = [...state];
          let gridAfterRemoval = tempGrid.filter(
            (x, i) => !removingRows.includes(i)
          );
          let newRows = [
            ...Array(removingRows.length).fill([
              ...Array(10).fill({ filled: false, id: null }),
            ]),
          ];
          return newRows.concat(gridAfterRemoval);
        });
        setLines((state) => state + rows);
        setScore((state) => {
          let lineMultiplier =
            rows === 1 ? 40 : rows === 2 ? 100 : rows === 3 ? 300 : 1200;
          return state + lineMultiplier * (level + 1);
        });
      }, 1500);
    }
    // eslint-disable-next-line
  }, [removingRows]);

  useInterval(
    () => {
      if (currentBlock !== null && !start) {
        setCurrentBlock((state) => {
          return moveDownOne(state);
        });
      }
    },
    speed,
    gameOver,
    paused
  );

  const rotateRight = (current) => {
    if (removingRows.length > 0) {
      return current;
    }
    if (current === null || current.id === "4") return current;
    let currentTemp = { ...current };
    let nextOrientation =
      current.orientation === current.rotations.length - 1
        ? 0
        : currentTemp.orientation + 1;
    let newPos = [];
    for (let i = 0; i < current.pos.length; i++) {
      let x =
        current.pos[i][0] +
        (current.rotations[nextOrientation][i][0] -
          current.rotations[current.orientation][i][0]);
      let y =
        current.pos[i][1] +
        (current.rotations[nextOrientation][i][1] -
          current.rotations[current.orientation][i][1]);
      if (x < 0 || x > 19 || y < 0 || y > 9 || grid[x][y].filled) {
        return current;
      }
      newPos.push([x, y]);
    }

    currentTemp.orientation = nextOrientation;
    currentTemp.pos = newPos;
    return currentTemp;
  };

  const moveToRight = (current) => {
    if (removingRows.length > 0) {
      return current;
    }
    if (current === null) {
      return current;
    }
    let new_pos = [];
    let tempCur = { ...current };
    let current_pos = [...tempCur.pos];

    for (let i = 0; i < current_pos.length; i++) {
      let [x, y] = current_pos[i];

      if (y === 9 || grid[x][y + 1].filled) {
        return tempCur;
      }

      new_pos.push([x, y + 1]);
    }

    tempCur.pos = new_pos;
    return tempCur;
  };

  const moveToLeft = (current) => {
    if (removingRows.length > 0) {
      return current;
    }
    if (current === null) return current;
    let new_pos = [];
    let tempCur = { ...current };
    let current_pos = tempCur.pos;

    for (let i = 0; i < current_pos.length; i++) {
      let [x, y] = current_pos[i];
      if (y === 0 || (!grid[x][y - 1].current && grid[x][y - 1].filled)) {
        return tempCur;
      }

      new_pos.push([x, y - 1]);
    }

    tempCur.pos = new_pos;
    return tempCur;
  };

  useEffect(() => {
    setSpeed(500 * (0.9 ** level));
  }, [level]);

  const NextBlock = (props) => {
    let grid =
      props.block.id === "1"
        ? [[...Array(4).fill("1")]]
        : props.block.id === "4"
          ? [...Array(2).fill([...Array(2).fill("4")])]
          : [...Array(2).fill([...Array(3).fill("")])];

    if (props.block.id !== "1" && props.block.id !== "4") {
      for (let i = 0; i < props.block.init.length; i++) {
        let [x, y] = props.block.init[i];
        let tempRow = [...grid[x]];
        tempRow[y] = props.block.id;
        grid[x] = tempRow;
      }
    }

    return (
      <div
        className={
          props.block.id === "1"
            ? "new_block long"
            : props.block.id === "4"
              ? "new_block square"
              : "new_block other"
        }
      >
        {grid.map((row, r) => {
          return row.map((col, c) => {
            return (
              <div
                className={grid[r][c] !== "" ? "pixel filled" : "pixel"}
                value={grid[r][c]}
              ></div>
            );
          });
        })}
      </div>
    );
  };

  useEffect(() => {
    if (gameOver && !gameOverScreenVisible) {
      setGameOverScreenVisible(true);
    }
    // eslint-disable-next-line
  }, [gameOver]);


  return (
    <div className="tetris_outer">
      <div className="tetris_inner">
        <div className="tetris_screen">
          {start && (
            <div className="tetris_start_screen">
              Your highscores
              <div className="highscores">
                {highscores.map((item) => {
                  return <div>{item}</div>;
                })}
              </div>
              <div
                className="play_button"
                onClick={() => {
                  setStart(false);
                }}
                onTouchStart={() => {
                  setUsingTouchscreen(true);
                }}
              >
                Play
              </div>
            </div>
          )}
          {gameOverScreenVisible && (
            <GameOverScreen
              score={score}
              tetris_storage={TETRIS_STORAGE_STRING}
            />
          )}
          <div className="tetris_scores">
            <div>
              <div className="scores_title">Score</div>
              <div className="scores_value">{score}</div>
            </div>
            <div>
              <div className="scores_title">Level</div>
              <div className="scores_value">{level}</div>
            </div>
            <div>
              <div className="scores_title">Lines</div>
              <div className="scores_value">{lines}</div>
            </div>
            {!gameOver && !start && (
              <div
                className="pause_button"
                onClick={() => {
                  setPaused((state) => !state);
                }}
              >
                {!paused ? <MdPauseCircleFilled /> : <MdPlayCircleFilled />}
              </div>
            )}
          </div>
          <div className="next_blocks">
            {nextBlocks.map((item) => {
              return <NextBlock block={item} />;
            })}
          </div>

          {grid.map((row, r_idx) => {
            return (
              <div
                className={
                  removingRows.includes(r_idx)
                    ? "tetris-row filled"
                    : "tetris-row"
                }
              >
                {row.map((col, c_idx) => {
                  let cur =
                    currentBlock !== null &&
                    currentBlock.pos.findIndex(
                      (x) => x[0] === r_idx && x[1] === c_idx
                    ) > -1;
                  let val = cur
                    ? currentBlock.id
                    : grid[r_idx][c_idx].id === null
                      ? ""
                      : grid[r_idx][c_idx].id.toString();

                  return (
                    <div
                      className={
                        (currentBlock !== null &&
                          currentBlock.pos.findIndex(
                            (x) => x[0] === r_idx && x[1] === c_idx
                          ) > -1) ||
                          grid[r_idx][c_idx].filled
                          ? "tetris_pixel filled"
                          : "tetris_pixel"
                      }
                      value={val}
                    >
                      {/* {val === "" ? `(${r_idx},${c_idx})` : val} */}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {!start && !gameOver && (
          <div className="tetris_buttons">
            <div
              className="tetris_button up"
              onClick={() => {
                setCurrentBlock((state) => rotateRight(state));
              }}
            >
              <MdOutlineRotateRight />
            </div>
            <div
              className="tetris_button left"
              onMouseDown={() => {
                if (usingTouchscreen) return;
                leftPressed();
              }}
              onTouchStart={() => {
                leftPressed();
              }}
              onMouseUp={() => {
                if (usingTouchscreen) return;
                clearIntervals("ArrowLeft");
              }}
              onMouseLeave={() => {
                if (usingTouchscreen) return;

                clearIntervals("ArrowLeft");
              }}
              onTouchEnd={() => {
                clearIntervals("ArrowLeft");
              }}
              onTouchCancel={() => {
                clearIntervals("ArrowLeft");
              }}
              onMouseMove={() => {
                if (usingTouchscreen) return;

                clearIntervals("ArrowLeft");
              }}
            >
              <ImArrowLeft />
            </div>
            <div
              className="tetris_button right"
              onMouseDown={() => {
                if (usingTouchscreen) return;
                rightPressed();
              }}
              onTouchStart={() => {
                rightPressed();
              }}
              onMouseUp={() => {
                if (usingTouchscreen) return;
                clearIntervals("ArrowRight");
              }}
              onTouchEnd={() => {
                clearIntervals("ArrowRight");
              }}
              onMouseLeave={() => {
                if (usingTouchscreen) return;

                clearIntervals("ArrowRight");
              }}
              onTouchCancel={() => {
                clearIntervals("ArrowRight");
              }}
            >
              <ImArrowRight />
            </div>
            <div
              className="tetris_button down"
              onMouseDown={() => {
                if (usingTouchscreen) return;
                downPressed();
              }}
              onTouchStart={() => {
                downPressed();
              }}
              onMouseUp={() => {
                if (usingTouchscreen) return;

                clearIntervals("ArrowDown");
              }}
              onMouseLeave={() => {
                if (usingTouchscreen) return;

                clearIntervals("ArrowDown");
              }}
              onTouchCancel={() => {
                clearIntervals("ArrowDown");
              }}
              onTouchEnd={() => {
                clearIntervals("ArrowDown");
              }}
            >
              <ImArrowDown />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tetris;
