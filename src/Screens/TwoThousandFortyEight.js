import { useEffect, useState, useRef } from "react";
import { MdOutlineRestartAlt } from "react-icons/md";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaUndo } from "react-icons/fa";
import "../style/TwoThousandFortyEight.css";
import { GiAmberMosquito } from "react-icons/gi";

const TwoThousandFortyEight = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const TTFE_STORAGE = "ttfe_games";
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState(null);
  const idRef = useRef(0);
  const touchRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [ttfeReached, setTtfeReached] = useState(false);
  const [ttfeTriggered, setTtfeTriggered] = useState(false);
  const TTFE_HIGHSCORE_STORAGE_STRING = "ttfe_highscore";
  const TTFE_GAMES_WON_STORAGE_STRING = "ttfe_games_won";
  const [undosLeft, setUndosLeft] = useState(5);
  const [gamesWon, setGamesWon] = useState(0);
  const [score, setScore] = useState(0);
  const [memory, setMemory] = useState([]);
  const [prevGrid, setPrevGrid] = useState(null);

  const [highscore, setHighscore] = useState(0);

  const storedGames = JSON.parse(localStorage.getItem(TTFE_STORAGE));

  useEffect(() => {
    if (!localStorage.getItem(TTFE_STORAGE)) {
      localStorage.setItem(
        TTFE_STORAGE,
        JSON.stringify({
          unlimited: {
            grid: [],
            active: false,
            memory: [],
            ttfeReached: false,
            score: 0,
            highscore: 0,
            gamesWon: 0,
          },
          regular: {
            grid: [],
            active: false,
            memory: [],
            undosLeft: 5,
            ttfeReached: false,
            highscore: 0,
            score: 0,
            gamesWon: 0,
          },
          hardcore: {
            grid: [],
            ttfeReached: false,
            highscore: 0,
            score: 0,
            gamesWon: 0,
          },
        })
      );
    }
  }, []);

  useEffect(() => {
    const modes = ["unlimited", "regular", "hardcore"];
    if (modes.includes(searchParams.get("mode"))) {
      setGameMode(searchParams.get("mode"));
    }
  }, []);

  useEffect(() => {
    if (gameMode !== null) {
      const storage = JSON.parse(localStorage.getItem(TTFE_STORAGE));
      let activeGame = false;
      if (storage[gameMode].active) {
        buildGridFromMemory(storage[gameMode].grid);
        setScore(storage[gameMode].score);
        setHighscore(storage[gameMode].score);
        activeGame = true;
      }

      if (!activeGame) {
        setGrid((state) => {
          let tempState = [...state];
          tempState = newTiles(tempState, 2);
          return tempState;
        });
      }
    }
  }, [gameMode]);
  const onUndo = () => {
    if (memory.length > 0 && undosLeft > 0) {
      setMemory((state) => {
        let tempMemory = [...state];
        buildGridFromMemory(tempMemory[0]);
        setPrevGrid(tempMemory[0]);
        return tempMemory.slice(1);
      });
      setGameOver(false);
      setTtfeReached(false);
      if (gameMode === "regular") setUndosLeft((state) => state - 1);
    }
  };

  const emptyGrid = [
    [
      { value: 0, id: null },
      { value: 0, id: null },
      { value: 0, id: null },
      { value: 0, id: null },
    ],

    [
      { value: 0, id: null },
      { value: 0, id: null },
      { value: 0, id: null },
      { value: 0, id: null },
    ],
    [
      { value: 0, id: null },
      { value: 0, id: null },
      { value: 0, id: null },
      { value: 0, id: null },
    ],
    [
      { value: 0, id: null },
      { value: 0, id: null },
      { value: 0, id: null },
      { value: 0, id: null },
    ],
  ];
  const [currentScoreIsHighscore, setCurrentScoreIsHighscore] = useState(false);
  const [grid, setGrid] = useState(emptyGrid);

  const [tilesToAdd, setTilesToAdd] = useState([]);
  const [tilesToMove, setTilesToMove] = useState([]);
  const [tilesToMerge, setTilesToMerge] = useState([]);
  const gameOverCheck = (g) => {
    const oneDirCheck = (rows) => {
      let movePossible = false;
      for (let i = 0; i < rows.length; i++) {
        let tempRow = rows[i].filter((x) => x.value > 0);
        if (tempRow.length < 4) {
          movePossible = true;
          break;
        }
        for (let j = 0; j < tempRow.length - 1; j++) {
          if (tempRow[j].value === tempRow[j + 1].value) {
            movePossible = true;
            break;
          }
        }
        if (movePossible) {
          break;
        }
      }

      return movePossible;
    };

    if (!oneDirCheck(g) && !oneDirCheck(verticalArrays(g))) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (gameMode !== null) {
      let temp = JSON.parse(localStorage.getItem(TTFE_STORAGE));
      temp[gameMode].score = score;
      localStorage.setItem(TTFE_STORAGE, JSON.stringify(temp));
    }
    setCurrentScoreIsHighscore(score >= highscore);
    if (score >= highscore) {
      setHighscore((state) => score);
    }
    // eslint-disable-next-line
  }, [score]);

  useEffect(() => {
    if (gameMode !== null) {
      let temp = JSON.parse(localStorage.getItem(TTFE_STORAGE));
      temp[gameMode].gamesWon = gamesWon;
      localStorage.setItem(TTFE_STORAGE, JSON.stringify(temp));
    }
  }, [gamesWon]);

  useEffect(() => {
    if (gameMode !== null) {
      let tempStore = JSON.parse(localStorage.getItem(TTFE_STORAGE));
      tempStore[gameMode].highscore = highscore;
      localStorage.setItem(TTFE_STORAGE, JSON.stringify(tempStore));
    }
  }, [highscore, gameMode]);

  const makeMove = (dir) => {
    if (dir === "Left") {
      setGrid((state) => {
        let rows = [...state];
        let moved = [];
        let tempMoved = [];
        let merged = [];
        let tempMerged = [];
        for (let i = 0; i < rows.length; i++) {
          let tempRow = [...rows[i]];
          [tempRow, tempMoved, tempMerged] = arrayFolder(tempRow, "left", i);
          moved = moved.concat(tempMoved);
          merged = merged.concat(tempMerged);
          rows[i] = tempRow;
        }
        setTilesToMove((state) => moved);
        setTilesToMerge((state) => merged);

        return rows;
      });
    } else if (dir === "Right") {
      setGrid((state) => {
        let rows = [...state];
        let moved = [];
        let tempMoved = [];
        let merged = [];
        let tempMerged = [];

        for (let i = 0; i < rows.length; i++) {
          let tempRow = [...rows[i]];
          tempRow.reverse();
          [tempRow, tempMoved, tempMerged] = arrayFolder(tempRow, "right", i);
          moved = moved.concat(tempMoved);
          merged = merged.concat(tempMerged);

          tempRow.reverse();
          rows[i] = tempRow;
        }
        setTilesToMove((state) => moved);
        setTilesToMerge((state) => merged);

        return rows;
      });
    } else if (dir === "Up") {
      setGrid((state) => {
        let tempGrid = verticalArrays([...state]);
        let moved = [];
        let tempMoved = [];
        let merged = [];
        let tempMerged = [];

        for (let i = 0; i < tempGrid.length; i++) {
          let tempRow = [...tempGrid[i]];
          [tempRow, tempMoved, tempMerged] = arrayFolder(tempRow, "up", i);
          moved = moved.concat(tempMoved);
          merged = merged.concat(tempMerged);

          tempGrid[i] = tempRow;
        }
        setTilesToMove((state) => moved);
        setTilesToMerge((state) => merged);

        return verticalArrays(tempGrid);
      });
    } else if (dir === "Down") {
      setGrid((state) => {
        let tempGrid = verticalArrays([...state]);
        let moved = [];
        let tempMoved = [];
        let merged = [];
        let tempMerged = [];

        for (let i = 0; i < tempGrid.length; i++) {
          let tempRow = [...tempGrid[i]];
          tempRow.reverse();
          [tempRow, tempMoved, tempMerged] = arrayFolder(tempRow, "down", i);
          moved = moved.concat(tempMoved);
          merged = merged.concat(tempMerged);

          tempRow.reverse();
          tempGrid[i] = tempRow;
        }

        setTilesToMove((state) => moved);
        setTilesToMerge((state) => merged);

        return verticalArrays(tempGrid);
      });
    }
  };

  const buildGridFromMemory = (grid) => {
    idRef.current = 1;
    let container = document.getElementsByClassName("tiles-container")[0];
    container.innerHTML = "";
    let tempGrid = [...emptyGrid];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] !== 0) {
          let val = grid[i][j];
          let tempTile = { value: val, id: idRef.current };
          let tempRow = [...tempGrid[i]];
          tempRow[j] = tempTile;
          tempGrid[i] = tempRow;
          idRef.current += 1;
          let tile = document.createElement("div");
          tile.className = `ttfe_tile tile${val} no_animation`;
          tile.id = `tile_${tempTile.id}`;
          tile.value = val.toString();
          tile.textContent = val;
          tile.style.setProperty("--x", (j + 1).toString());
          tile.style.setProperty("--y", (i + 1).toString());
          container.appendChild(tile);
        }
      }
    }
    setGrid(tempGrid);
  };

  const newTiles = (tempGrid, num) => {
    let tempG = [...tempGrid];
    let temp = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (tempGrid[i][j].value === 0) {
          temp.push([i, j]);
        }
      }
    }
    if (temp.length < num) return tempG;
    let toAdd = [];
    for (let i = 0; i < num; i++) {
      let tempI = Math.floor(Math.random() * temp.length);
      let tempVal = Math.random() < 0.9 ? 2 : 4;
      let tempPos = temp[tempI];
      let tempRow = [...tempG[tempPos[0]]];
      tempRow[tempPos[1]] = { value: tempVal, id: idRef.current + 1 };
      tempG[tempPos[0]] = tempRow;
      temp = temp.filter((x, i) => i !== tempI);
      toAdd.push({
        id: idRef.current + 1,
        pos: tempPos.map((x) => x + 1),
        value: tempVal,
      });
      idRef.current += 1;
    }
    setTilesToAdd(toAdd);
    return tempG;
  };

  const verticalArrays = (mat) => {
    let tempMatrix = [];
    for (let i = 0; i < 4; i++) {
      let temp = [];
      for (let j = 0; j < 4; j++) {
        temp.push(mat[j][i]);
      }
      tempMatrix.push(temp);
    }
    return tempMatrix;
  };

  useEffect(() => {
    if (gameOverCheck(grid)) {
      setGameOver(true);
    }
    // eslint-disable-next-line
  }, [grid]);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      if (event.repeat) {
        return;
      }

      if (event.key === "ArrowLeft") {
        makeMove("Left");
      }
      if (event.key === "ArrowRight") {
        makeMove("Right");
      }

      if (event.key === "ArrowUp") {
        makeMove("Up");
      }
      if (event.key === "ArrowDown") {
        makeMove("Down");
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (tilesToMove.length > 0) {
      setTilesToMove((state) => {
        let tempToMove = [...state];
        for (let i = 0; i < tempToMove.length; i++) {
          let tile = document.getElementById(`tile_${tempToMove[i].id}`);

          if (tile !== null) {
            tile.style.setProperty("--y", tempToMove[i].pos[1] + 1);
            tile.style.setProperty("--x", tempToMove[i].pos[0] + 1);
          }
        }
        setTimeout(() => {
          setGrid((state) => {
            let tempState = [...state];
            tempState = newTiles(tempState, 1);
            return tempState;
          });
        }, 50);

        return [];
      });
    }
  }, [tilesToMove]);

  useEffect(() => {
    if (tilesToMerge.length > 0) {
      setTilesToMerge((state) => {
        let tempToMerge = [...state];
        let add = tempToMerge.reduce(
          (prev, cur) => prev + cur.newTile.value,
          0
        );
        if (
          !ttfeTriggered &&
          tempToMerge.findIndex((x) => x.newTile.value === 2048) > -1
        ) {
          setTtfeReached((state) => true);
        }
        setScore((state) => state + add);
        if (currentScoreIsHighscore) {
          let scoreDisplay = document.getElementById("highscore-pop");
          scoreDisplay.innerHTML = "";
          let newScorePopup = document.createElement("div");
          newScorePopup.className = "ttfe_score_popup";
          newScorePopup.textContent = `+${add}`;
          scoreDisplay.appendChild(newScorePopup);
        }
        let scoreDisplay = document.getElementById("score-pop");
        scoreDisplay.innerHTML = "";
        let newScorePopup = document.createElement("div");
        newScorePopup.className = "ttfe_score_popup";
        newScorePopup.textContent = `+${add}`;
        scoreDisplay.appendChild(newScorePopup);
        setGrid((s) => {
          let tempState = [...s];
          for (let i = 0; i < tempToMerge.length; i++) {
            let newTile = { ...tempToMerge[i].newTile };
            let tempRow = [...tempState[newTile.pos[1]]];
            tempRow[newTile.pos[0]] = { value: newTile.value, id: newTile.id };
            tempState[newTile.pos[1]] = tempRow;
          }

          return tempState;
        });

        for (let i = 0; i < tempToMerge.length; i++) {
          let container = document.getElementsByClassName("tiles-container")[0];
          let tile = document.createElement("div");
          tile.className = `ttfe_tile ${
            tempToMerge[i].newTile.value <= 2048
              ? `tile${tempToMerge[i].newTile.value}`
              : "tileSuper"
          }`;
          tile.id = `tile_${tempToMerge[i].newTile.id}`;
          tile.value = tempToMerge[i].newTile.value.toString();
          tile.textContent = tempToMerge[i].newTile.value;
          tile.style.setProperty(
            "--x",
            (tempToMerge[i].newTile.pos[0] + 1).toString()
          );
          tile.style.setProperty(
            "--y",
            (tempToMerge[i].newTile.pos[1] + 1).toString()
          );
          container.appendChild(tile);
          setTimeout(() => {
            for (let j = 0; j < tempToMerge[i].toDelete.length; j++) {
              let tile = document.getElementById(
                `tile_${tempToMerge[i].toDelete[j]}`
              );
              if (tile !== null) {
                tile.remove();
              }
            }
          }, 100);
        }
        return [];
      });
    }
    // eslint-disable-next-line
  }, [tilesToMerge]);

  useEffect(() => {
    if (!ttfeTriggered && ttfeReached) {
      setTtfeTriggered(true);
      setGamesWon((state) => parseInt(state) + 1);
    }
    // eslint-disable-next-line
  }, [ttfeReached]);

  const arrayFolder = (arr, dir, row) => {
    let tempArr = [...arr];
    tempArr = tempArr.filter((i) => i.value !== 0);
    let moved = [];
    let merged = [];
    if (tempArr.length < 1) {
      return [arr, moved, merged];
    }
    let i = 0;
    while (i < tempArr.length) {
      if (i < tempArr.length - 1 && tempArr[i].value === tempArr[i + 1].value) {
        if (arr[i].id !== tempArr[i].id) {
          moved.push({
            id: tempArr[i].id,
            pos: [
              dir === "left" ? i : dir === "right" ? 3 - i : row,
              dir === "up" ? i : dir === "down" ? 3 - i : row,
            ],
          });
        }
        moved.push({
          id: tempArr[i + 1].id,
          pos: [
            dir === "left" ? i : dir === "right" ? 3 - i : row,
            dir === "up" ? i : dir === "down" ? 3 - i : row,
          ],
        });
        merged.push({
          toDelete: [tempArr[i].id, tempArr[i + 1].id],
          newTile: {
            id: idRef.current + 1,
            pos: [
              dir === "left" ? i : dir === "right" ? 3 - i : row,
              dir === "up" ? i : dir === "down" ? 3 - i : row,
            ],
            value: 2 * tempArr[i].value,
          },
        });
        idRef.current += 1;
        let tempO = { ...tempArr[i] };
        tempO.value = 2 * tempArr[i].value;
        tempArr = [...tempArr.slice(0, i), tempO, ...tempArr.slice(i + 2)];
      } else {
        if (tempArr[i].id !== arr[i].id) {
          moved.push({
            id: tempArr[i].id,
            pos: [
              dir === "left" ? i : dir === "right" ? 3 - i : row,
              dir === "up" ? i : dir === "down" ? 3 - i : row,
            ],
          });
        }
        let tempO = { ...tempArr[i] };
        tempArr[i] = tempO;
      }
      i += 1;
    }

    return [
      tempArr.concat([
        ...Array(4 - tempArr.length).fill({
          value: 0,
          id: null,
        }),
      ]),
      moved,
      merged,
    ];
  };

  const gridToSimpleGrid = (grid) => {
    let temp = [...grid];
    let g = [];
    for (let i = 0; i < 4; i++) {
      let tempRow = [...temp[i]];
      g.push(tempRow.map((x) => x.value));
    }
    return g;
  };

  useEffect(() => {
    if (gameMode !== null && tilesToAdd.length > 0) {
      let container = document.getElementsByClassName("tiles-container")[0];
      for (let i = 0; i < tilesToAdd.length; i++) {
        let tile = document.createElement("div");
        tile.className = `ttfe_tile ${
          tilesToAdd[i].value === 2 ? "tile2" : "tile4"
        }`;
        tile.id = `tile_${tilesToAdd[i].id}`;
        tile.value = tilesToAdd[i].value.toString();
        tile.textContent = tilesToAdd[i].value;
        tile.style.setProperty("--x", tilesToAdd[i].pos[1].toString());
        tile.style.setProperty("--y", tilesToAdd[i].pos[0].toString());
        container.appendChild(tile);
      }
      if (prevGrid !== null) {
        setMemory((state) => {
          let temp = [...state];
          return [prevGrid, ...temp.slice(0, 4)];
        });
      }

      setPrevGrid((state) => {
        return gridToSimpleGrid(grid);
      });
    }
  }, [tilesToAdd, gameMode]);

  useEffect(() => {
    if (prevGrid !== null) {
      let tempStore = JSON.parse(localStorage.getItem(TTFE_STORAGE));
      if (gameMode === "regular") {
        tempStore.regular.active = true;
        tempStore.regular.grid = prevGrid;
      } else if (gameMode === "unlimited") {
        tempStore.unlimited.active = true;
        tempStore.unlimited.grid = prevGrid;
      } else if (gameMode === "hardcore") {
        tempStore.hardcore.active = true;
        tempStore.hardcore.grid = prevGrid;
      }

      localStorage.setItem(TTFE_STORAGE, JSON.stringify(tempStore));
    }
  }, [prevGrid]);
  const ChoiceScreen = (props) => {
    return (
      <div className="ttfe_choice_screen">
        <div className="ttfe_choice_title">
          Which gamemode do you want to play?
        </div>
        <div
          className="ttfe_game_choice_option"
          onClick={() => {
            setSearchParams({ mode: "hardcore" });
            setGameMode("hardcore");
          }}
        >
          Hardcore
        </div>
        <div className="ttfe_choice_explanation">
          In hardcore mode you won't have the option to undo your moves. <br />{" "}
          {storedGames !== null && storedGames.hardcore.active
            ? "You have an active hardcore game."
            : "You don't have an active hardcore game yet."}
        </div>
        <div
          className="ttfe_game_choice_option regular"
          onClick={() => {
            setSearchParams({ mode: "regular" });
            setGameMode("regular");
          }}
        >
          Regular
        </div>
        <div className="ttfe_choice_explanation">
          In regular mode you have the option to undo 5 times. <br />
          {storedGames !== null && storedGames.regular.active
            ? "You have an active regular game."
            : "You don't have an active regular game yet."}
        </div>
        <div
          className="ttfe_game_choice_option unlimited"
          onClick={() => {
            setSearchParams({ mode: "unlimited" });
            setGameMode("unlimited");
          }}
        >
          Unlimited
        </div>
        <div className="ttfe_choice_explanation">
          In unlimited mode you will have the option to undo as many times as
          you want. <br />{" "}
          {storedGames !== null && storedGames.unlimited.active
            ? "You have an active unlimited game."
            : "You don't have an active unlimited game yet."}
        </div>
      </div>
    );
  };

  return (
    <div className="ttfe_outer">
      {gameMode === null && <ChoiceScreen />}
      {gameMode !== null && (
        <div>
          <div className="ttfe_score_bar">
            <div
              className="ttfe_score_display"
              onClick={() => {
                buildGridFromMemory([
                  [2, 0, 2, 0],
                  [2, 0, 0, 0],
                  [2, 0, 0, 2],
                  [2, 0, 0, 0],
                ]);
              }}
            >
              <div id="score-pop" className="score_popup"></div>
              <div className="ttfe_score_title">SCORE</div>
              <div className="ttfe_score_value">{score}</div>
            </div>
            <div
              className="ttfe_score_display"
              onClick={() => {
                onUndo();
              }}
            >
              <div id="highscore-pop" className="score_popup"></div>
              <div className="ttfe_score_title">HIGHSCORE</div>
              <div className="ttfe_score_value">{highscore}</div>
            </div>
            <div className="ttfe_score_display">
              <div className="ttfe_score_title">GAMES WON</div>
              <div className="ttfe_score_value">{gamesWon}</div>
            </div>
          </div>
          <div className="undo_bar">
            {gameMode !== "hardcore" && (
              <div
                className={`undo_button${
                  memory.length > 0 && undosLeft > 0 ? "" : " inactive"
                }`}
                onClick={() => {
                  onUndo();
                }}
              >
                <FaUndo className="undo_icon" /> Undo
                <div
                  className={`undos_left_indicator${
                    undosLeft > 2 ? "" : undosLeft > 0 ? " medium" : " empty"
                  }`}
                >
                  {gameMode === "regular" ? undosLeft : "∞"}
                </div>
              </div>
            )}
          </div>
          <div
            className="ttfe_grid"
            onTouchStart={(e) => {
              e.preventDefault();

              touchRef.current = e;
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              let startX =
                touchRef.current.nativeEvent.targetTouches[0].clientX;
              let startY =
                touchRef.current.nativeEvent.targetTouches[0].clientY;
              let endX = e.nativeEvent.changedTouches[0].clientX;
              let endY = e.nativeEvent.changedTouches[0].clientY;

              let Xdif = startX - endX;
              let Ydif = startY - endY;

              let dir = Math.abs(Xdif) > Math.abs(Ydif) ? "x" : "y";
              let move =
                dir === "x"
                  ? Math.abs(Xdif) > 30
                    ? Xdif > 0
                      ? "Left"
                      : "Right"
                    : "None"
                  : Math.abs(Ydif) > 30
                  ? Ydif > 0
                    ? "Up"
                    : "Down"
                  : "None";
              makeMove(move);
              touchRef.current = null;
            }}
          >
            {gameOver && (
              <div className="ttfe_gameover_screen">
                Game Over
                <div
                  className="ttfe_try_again"
                  onClick={() => {
                    window.location.reload(false);
                  }}
                >
                  <MdOutlineRestartAlt /> Try Again
                </div>
              </div>
            )}
            {ttfeReached && (
              <div className="ttfe_reached_screen">
                Congratulations!
                <div className="ttfe_reached_subtext">
                  You've reached the 2048 tile. You can
                </div>
                <div
                  className="ttfe_reached_button"
                  onClick={() => {
                    setTtfeReached((state) => false);
                  }}
                >
                  Continue playing
                </div>
                <div className="ttfe_reached_subtext">
                  to improve your highscore, or you can
                </div>
                <div
                  className="ttfe_reached_button"
                  onClick={() => {
                    window.location.reload(false);
                  }}
                >
                  Try Again
                </div>
              </div>
            )}
            <div className="tiles-container"></div>

            {grid.map((row) => {
              return row.map((col) => {
                return <div className="ttfe_tile_temp"></div>;
              });
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TwoThousandFortyEight;
