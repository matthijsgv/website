import React from 'react';
import "../style/MineSweeper.css";
import { FaBomb } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdFlag } from "react-icons/md";
import { RiBarChart2Fill } from "react-icons/ri";

import { BsQuestion } from "react-icons/bs";
import Modal from "../UI/Modal";

const vibrate = () => {
  if (!window) {
    return;
  }
  if (!window.navigator) {
    return;
  }
  if (!window.navigator.vibrate) {
    return;
  }
  window.navigator.vibrate(100);
};
const pickRandomNumber = (range) => {
  return Math.floor(Math.random() * range);
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const MineSweeper = () => {
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [gridWidth, setGridWith] = useState(null);
  const [gridHeight, setGridHeight] = useState(null);

  const [grid, setGrid] = useState(null);
  const [flagsRemaining, setFlagsRemaining] = useState(null);
  const [unrevealedTiles, setUnrevealedTiles] = useState(null);
  const [numberOfBombs, setNumberOfBombs] = useState(null);

  const setStartGrid = () => {
    let phone = false;
    const { width, height } = getWindowDimensions();
    if (Math.min(width, height) < 600) {
      phone = true;
    }
    const gridHeight = phone ? 20 : 16;
    const gridWidth = phone ? 12 : 16;

    setGridWith(gridWidth);
    setGridHeight(gridHeight);
    setNumberOfBombs(phone ? 36 : 40);
    setUnrevealedTiles(gridHeight * gridWidth);
    setFlagsRemaining(phone ? 36 : 40);
  };
  useEffect(() => {
    if (localStorage.getItem("matthijssweeper_stats") === null) {
      localStorage.setItem(
        "matthijssweeper_stats",
        JSON.stringify({
          gamesPlayed: 0,
          gamesWon: 0,
          fastestTime: 99999,
        })
      );
    }
    setStartGrid();
  }, []);

  useEffect(() => {
    if (gridWidth !== null && gridHeight !== null && numberOfBombs !== null) {
      setGrid(placeBombs(emptyGrid()));
    }
    // eslint-disable-next-line
  }, [gridWidth, gridHeight, numberOfBombs]);

  window.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();
    },
    false
  );

  const longPressTriggered = useRef();
  const [gameOver, setGameOver] = useState(false);

  const [timer, setTimer] = useState(0);

  const [winLose, setWinLose] = useState(null);
  const timerRef = useRef();

  const EmojiButton = (props) => {
    return (
      <div
        className="emoji-button"
        onClick={() => {
          onReset();
        }}
      >
        <div className="emoji-button-inner">
          {winLose !== null ? (
            winLose ? (
              <div className="emoji-face">&#128526;</div>
            ) : (
              <div className="emoji-face">&#128543;</div>
            )
          ) : (
            <div className="emoji-face">&#128578;</div>
          )}
        </div>
      </div>
    );
  };

  const RestartModal = () => {
    return (
      <Modal
        closeModal={() => {
          setShowRestartModal(false);
        }}
      >
        <div className="restart-modal">
          Are you sure you want to restart the game?
          <div className="restart-modal-buttons">
            <div
              className="restart-modal-button"
              onClick={() => {
                setShowRestartModal(false);
              }}
            >
              No
            </div>
            <div
              className="restart-modal-button yes"
              onClick={() => {
                onReset();
                setShowRestartModal(false);
              }}
            >
              Yes
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const HowToPlayModal = () => {
    return (
      <Modal
        closeModal={() => {
          setShowHowToPlayModal(false);
        }}
      >
        <div className="how-to-play-modal">
          <div className="how-to-play-title">HOW TO PLAY</div>
          The goal of the game is to reveal all the tiles in the grid, without
          hitting a bomb. <br /> <br />
          <div>
            <div className="how-to-play-bomb">
              <FaBomb />
            </div>
            You can reveal tiles by clicking on them. If there is a bomb beneath
            the tile you lose the game. <br />
            <br />
          </div>
          <div>
            <div className="how-to-play-number">2</div>
            If there is no bomb beneath a tile, upon revealing the number of
            adjecent bombs is displayed. If, for example, a tile shows the
            number 2, it means that 2 of the 8 adjecent tiles have a bomb
            beneath them. <br /> <br />
          </div>
          <div>
            <div className="how-to-play-flag">
              <MdFlag />
            </div>
            You can mark fields where you think a bomb is hiding with a flag.
            You place a flag by pressing long on an unrevealed tile, or by
            right-clicking on the tile if you are playing on a computer. You can
            only place as many flags as there are bombs hidden. The number of
            remaining flags is shown in the top left.
          </div>
        </div>
      </Modal>
    );
  };

  const ScoreModal = () => {
    let stats = JSON.parse(localStorage.getItem("matthijssweeper_stats"));
    let fastestTime = stats.fastestTime;
    let minutes = Math.floor(fastestTime / 60);
    let seconds = fastestTime % 60;

    return (
      <Modal
        closeModal={() => {
          setShowScoreModal(false);
        }}
      >
        <div className="minesweeper-score-modal">
          <div className="minesweeper-score-title">YOUR SCORES</div>
          <div className="minesweeper-score-row">
            <div className="minesweeper-score-field">
              <div className="minesweeper-score-field-value">
                {stats.gamesPlayed}
              </div>
              <div className="minesweeper-score-field-label"># Played</div>
            </div>
            <div className="minesweeper-score-field">
              <div className="minesweeper-score-field-value">
                {stats.gamesPlayed > 0
                  ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
                  : 0}
              </div>
              <div className="minesweeper-score-field-label">% Won</div>
            </div>
          </div>
          <div className="minesweeper-fastest-time">
            <div className="minesweeper-fastest-time-title">
              YOUR FASTEST TIME:
            </div>
            <div className="minesweeper-fastest-time-timer">
              {minutes === 0
                ? "00"
                : minutes < 10
                ? "0" + minutes.toString()
                : minutes.toString()}
              :
              {seconds === 0
                ? "00"
                : seconds < 10
                ? "0" + seconds.toString()
                : seconds.toString()}
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  useEffect(() => {
    longPressTriggered.current = false;
  }, []);

  useEffect(() => {
    if (timer === 0) {
      timerRef.current = setInterval(() => {
        setTimer((state) => state + 1);
      }, 1000);
    }
  }, [timer]);

  const emptyGrid = () => {
    let tempGrid = [];
    [...Array(gridWidth).keys()].forEach((column) => {
      let tempCol = [];
      [...Array(gridHeight).keys()].forEach((row) => {
        tempCol.push({
          x: column,
          y: row,
          isBomb: false,
          adjectBombs: 0,
          isRevealed: false,
          isFlagged: false,
          losingTile: false,
        });
      });
      tempGrid.push(tempCol);
    });
    return tempGrid;
  };

  const placeBombs = (grid) => {
    let randX,
      randY,
      bombsPlanted = 0;
    while (bombsPlanted < numberOfBombs) {
      randX = pickRandomNumber(grid.length);
      randY = pickRandomNumber(grid[0].length);
      if (!grid[randX][randY].isBomb) {
        grid[randX][randY].isBomb = true;
        grid = setNeighbours(grid, randX, randY);
        bombsPlanted += 1;
      }
    }
    return grid;
  };

  const setNeighbours = (grid, x, y) => {
    if (x > 0) {
      if (y > 0) {
        grid[x - 1][y - 1].adjectBombs += 1;
      }
      grid[x - 1][y].adjectBombs += 1;
      if (y < gridHeight - 1) {
        grid[x - 1][y + 1].adjectBombs += 1;
      }
    }
    if (x < gridWidth - 1) {
      if (y > 0) {
        grid[x + 1][y - 1].adjectBombs += 1;
      }
      grid[x + 1][y].adjectBombs += 1;
      if (y < gridHeight - 1) {
        grid[x + 1][y + 1].adjectBombs += 1;
      }
    }
    if (y > 0) {
      grid[x][y - 1].adjectBombs += 1;
    }
    if (y < gridHeight - 1) {
      grid[x][y + 1].adjectBombs += 1;
    }

    return grid;
  };

  const revealTile = (grid, x, y) => {
    let tempGrid = [...grid];
    if (tempGrid[x][y].isFlagged || tempGrid[x][y].isRevealed) return tempGrid;

    tempGrid[x][y].isRevealed = true;
    setUnrevealedTiles((state) => state - 1);

    if (tempGrid[x][y].isBomb) {
      onEndGame(tempGrid[x][y], false);
    }

    return tempGrid;
  };

  const onEndGame = (tile, gameWon) => {
    clearInterval(timerRef.current);

    let stats = JSON.parse(localStorage.getItem("matthijssweeper_stats"));
    stats.gamesPlayed += 1;
    if (gameWon) {
      stats.gamesWon += 1;
      if (stats.fastestTime > timer) {
        stats.fastestTime = timer;
      }
    }
    localStorage.setItem("matthijssweeper_stats", JSON.stringify(stats));

    if (winLose === null) {
      setWinLose(gameWon);
    }
    setGameOver(true);
    setGrid((state) => {
      let tempGrid = [...state];
      if (!gameWon) {
        tempGrid[tile.x][tile.y].losingTile = true;
      }
      [...Array(gridWidth).keys()].forEach((col) => {
        [...Array(gridHeight).keys()].forEach((row) => {
          tempGrid[col][row].isRevealed = true;
        });
      });
      return tempGrid;
    });
  };

  useEffect(() => {
    if (unrevealedTiles !== null && numberOfBombs !== null) {
      if (unrevealedTiles === numberOfBombs) {
        onEndGame({}, true);
      }
    }
    // eslint-disable-next-line
  }, [unrevealedTiles]);

  const onPressEmpty = (tile) => {
    setGrid((state) => {
      let tempGrid = [...state];
      let visited = [];
      let toVisit = [tile];

      while (toVisit.length > 0) {
        let current = toVisit[0];
        let x = current.x;
        let y = current.y;
        tempGrid = revealTile(tempGrid, x, y);
        if (x > 0) {
          if (y > 0) {
            tempGrid = revealTile(tempGrid, x - 1, y - 1);
            if (
              !visited.includes(`(${x - 1},${y - 1})`) &&
              tempGrid[x - 1][y - 1].adjectBombs === 0
            ) {
              toVisit.push(tempGrid[x - 1][y - 1]);
            }
          }
          tempGrid = revealTile(tempGrid, x - 1, y);
          if (
            !visited.includes(`(${x - 1},${y})`) &&
            tempGrid[x - 1][y].adjectBombs === 0
          ) {
            toVisit.push(tempGrid[x - 1][y]);
          }
          if (y < gridHeight - 1) {
            tempGrid = revealTile(tempGrid, x - 1, y + 1);
            if (
              !visited.includes(`(${x - 1},${y + 1})`) &&
              tempGrid[x - 1][y + 1].adjectBombs === 0
            ) {
              toVisit.push(tempGrid[x - 1][y + 1]);
            }
          }
        }
        if (x < gridWidth - 1) {
          if (y > 0) {
            tempGrid = revealTile(tempGrid, x + 1, y - 1);
            if (
              !visited.includes(`(${x + 1},${y - 1})`) &&
              tempGrid[x + 1][y - 1].adjectBombs === 0
            ) {
              toVisit.push(tempGrid[x + 1][y - 1]);
            }
          }
          tempGrid = revealTile(tempGrid, x + 1, y);

          if (
            !visited.includes(`(${x + 1},${y})`) &&
            tempGrid[x + 1][y].adjectBombs === 0
          ) {
            toVisit.push(tempGrid[x + 1][y]);
          }
          if (y < gridHeight - 1) {
            tempGrid = revealTile(tempGrid, x + 1, y + 1);

            if (
              !visited.includes(`(${x + 1},${y + 1})`) &&
              tempGrid[x + 1][y + 1].adjectBombs === 0
            ) {
              toVisit.push(tempGrid[x + 1][y + 1]);
            }
          }
        }
        if (y > 0) {
          tempGrid = revealTile(tempGrid, x, y - 1);
          if (
            !visited.includes(`(${x},${y - 1})`) &&
            tempGrid[x][y - 1].adjectBombs === 0
          ) {
            toVisit.push(tempGrid[x][y - 1]);
          }
        }
        if (y < gridHeight - 1) {
          tempGrid = revealTile(tempGrid, x, y + 1);
          if (
            !visited.includes(`(${x},${y + 1})`) &&
            tempGrid[x][y + 1].adjectBombs === 0
          ) {
            toVisit.push(tempGrid[x][y + 1]);
          }
        }

        let tempVisited = toVisit.shift();
        visited.push(`(${tempVisited.x},${tempVisited.y})`);
      }
      return tempGrid;
    });
  };

  const onReset = () => {
    clearInterval(timerRef.current);
    setGrid(placeBombs(emptyGrid()));
    setGameOver(false);
    setWinLose(null);
    setFlagsRemaining(numberOfBombs);
    setUnrevealedTiles(gridHeight * gridWidth);
    setTimer(0);
  };

  const UnrevealedTile = (props) => {
    const delay = 300;
    const timeout = useRef();

    // eslint-disable-next-line
    const startClick = useCallback((e) => {
      if (e.button === 2) {
        return;
      }
      timeout.current = setTimeout(() => {
        longPressTriggered.current = true;
        onLongPress();
      }, delay);
    });

    // eslint-disable-next-line
    const endClick = useCallback((e, toClick = true) => {
      clearTimeout(timeout.current);
      if (e.button === 2) {
        onLongPress();
        return;
      }
      if (longPressTriggered.current) {
        longPressTriggered.current = false;
        return;
      }
      toClick && onClick();
    });

    const onLongPress = () => {
      if (props.tile.isFlagged) {
        vibrate();
        setGrid((state) => {
          let tempGrid = [...state];
          tempGrid[props.tile.x][props.tile.y].isFlagged = false;
          return tempGrid;
        });
        setFlagsRemaining((state) => state + 1);
      } else {
        if (flagsRemaining === 0) return;
        if (props.tile.isRevealed) return;
        vibrate();
        setGrid((state) => {
          let tempGrid = [...state];
          tempGrid[props.tile.x][props.tile.y].isFlagged = true;
          return tempGrid;
        });
        setFlagsRemaining((state) => state - 1);
        return;
      }
    };

    const onClick = () => {
      if (grid[props.tile.x][props.tile.y].isFlagged) return;
      if (grid[props.tile.x][props.tile.y].adjectBombs === 0) {
        onPressEmpty(props.tile);
      } else {
        setGrid((state) => {
          let tempGrid = [...state];
          tempGrid = revealTile(tempGrid, props.tile.x, props.tile.y);
          return tempGrid;
        });
      }
    };

    return (
      <div
        onMouseDown={startClick}
        onMouseUp={endClick}
        onTouchStart={startClick}
        onTouchEnd={endClick}
        onTouchCancel={(e) => endClick(e, false)}
        onMouseLeave={(e) => endClick(e, false)}
        id="tile"
        className="minesweeper-tile not-revealed"
      >
        {props.tile.isFlagged && <MdFlag />}
      </div>
    );
  };
  const RevealedTile = (props) => {
    let bomb = props.tile.isBomb;
    let value =
      props.tile.adjectBombs === 0 ? "" : props.tile.adjectBombs.toString();
    return (
      <div>
        {gameOver && bomb && (
          <div
            className={
              "minesweeper-tile revealed" +
              (props.tile.losingTile ? " losing" : "")
            }
          >
            <FaBomb />
          </div>
        )}
        {!bomb && (
          <div className="minesweeper-tile revealed" value={value}>
            {value}
          </div>
        )}
      </div>
    );
  };

  const Grid = (props) => {
    return (
      <div>
        {grid !== null && (
          <div className="minesweeper-grid">
            {[...Array(gridWidth).keys()].map((col) => {
              return (
                <div
                  className="minesweeper-grid-column"
                  key={Math.random().toString()}
                >
                  {[...Array(gridHeight).keys()].map((row) => {
                    return (
                      <div key={Math.random().toString()}>
                        {!grid[col][row].isRevealed && (
                          <UnrevealedTile tile={grid[col][row]} />
                        )}
                        {grid[col][row].isRevealed && (
                          <RevealedTile tile={grid[col][row]} />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="minesweeper-outer">
      {showRestartModal && <RestartModal />}
      {showHowToPlayModal && <HowToPlayModal />}
      {showScoreModal && <ScoreModal />}
      <div className="minesweeper-inner">
        {grid !== null && flagsRemaining !== null && (
          <div className="minesweeper-widget">
            <div className="minesweeper-topbar">
              <div className="placed-flags-count">
                {flagsRemaining < 10
                  ? "00" + flagsRemaining.toString()
                  : "0" + flagsRemaining.toString()}
              </div>
              <div className="minesweeper-options">
                <div
                  className="minesweeper-option-small-button"
                  onClick={() => {
                    setShowHowToPlayModal(true);
                  }}
                >
                  <BsQuestion />
                </div>
                <EmojiButton />
                <div
                  className="minesweeper-option-small-button"
                  onClick={() => {
                    setShowScoreModal(true);
                  }}
                >
                  <RiBarChart2Fill />
                </div>
              </div>
              <div className="time-counter">
                {timer < 10
                  ? "00" + timer.toString()
                  : timer < 100
                  ? "0" + timer.toString()
                  : timer > 999
                  ? "999"
                  : timer.toString()}
              </div>
            </div>
            <div className="minesweeper-grid-outer">
              <Grid />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MineSweeper;
