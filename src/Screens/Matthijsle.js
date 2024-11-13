import "../style/Matthijsle.css";
import { FiDelete } from "react-icons/fi";
import { useEffect, useState } from "react";
import { wordlist } from "../wordlist";

import { RiBarChart2Fill } from "react-icons/ri";
import Modal from "../UI/Modal";
import { useCountdown } from "../util/useCountdown";
import { useNavigate, useSearchParams } from "react-router-dom";

import { MdArrowBack } from "react-icons/md";
import TopBar from "../UI/TopBar";
import { RoutePath } from "../Constants/RoutePath";

const formatDate = (date) => {
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1; // Months start at 0!
  let dd = date.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return yyyy + "-" + mm + "-" + dd;
};

const Matthijsle = (props) => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const dateZero = new Date("2022-07-08");
  const dayOffset = Math.floor((new Date() - dateZero) / (1000 * 60 * 60 * 24));
  // eslint-disable-next-line
  const [mode, setMode] = useState(
    searchParams.get("mode") !== null &&
      searchParams.get("mode") === "unlimited"
      ? "unlimited"
      : "daily"
  );

  const today = new Date();

  const [keyboardActive, setKeyboardActive] = useState(true);
  const [word, setWord] = useState(
    mode === "daily"
      ? wordlist[dayOffset % wordlist.length]
      : wordlist[Math.floor(Math.random() * wordlist.length)]
  );

  const [scoreVisible, setScoreVisible] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const [incorrectLetters, setIncorrectLetters] = useState([]);
  const [presentLetters, setPresentLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);

  const [board, setBoard] = useState([
    { word: "", eval: null },
    { word: "", eval: null },
    { word: "", eval: null },
    { word: "", eval: null },
    { word: "", eval: null },
    { word: "", eval: null },
  ]);

  const [wordRevealAnimated, setWordRevealAnimated] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [wordIncorrect, setWordIncorrect] = useState(false);

  const rows = [0, 1, 2, 3, 4, 5];
  const letters = [0, 1, 2, 3, 4];

  const NewGameButton = () => {
    return (
      <div>
        <div
          className="new-game-button"
          onClick={() => {
            window.location.reload(false);
          }}
        >
          NEW GAME
        </div>
      </div>
    );
  };

  const keyBoardEvent = (e) => {
    e.preventDefault();
    if (e.repeat) return;
    const keys = [
      "ENTER",
      "BACKSPACE",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    let upper = e.key.toUpperCase();
    if (keys.includes(upper)) {
      onClickKeyboard(upper);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keyBoardEvent);
    return () => {
      document.removeEventListener("keydown", keyBoardEvent);
    };
    // eslint-disable-next-line
  }, [currentIndex]);

  const loadFromStorage = () => {
    let state_string = "";
    if (mode === "daily") {
      state_string = "matthijsle_state_daily";
    } else {
      state_string = "matthijsle_state_unlimited";
    }
    let state = JSON.parse(localStorage.getItem(state_string));
    const emptyState =
      mode === "daily"
        ? {
            boardState: board,
            currentIndex: currentIndex,
            letters: {
              correctLetters: correctLetters,
              presentLetters: presentLetters,
              incorrectLetters: incorrectLetters,
            },
            status: "IN_PROGRESS",
            solution: word,
            date: formatDate(new Date()),
          }
        : {
            boardState: board,
            currentIndex: currentIndex,
            letters: {
              correctLetters: correctLetters,
              presentLetters: presentLetters,
              incorrectLetters: incorrectLetters,
            },
            status: "IN_PROGRESS",
            solution: word,
          };
    if (state === null) {
      localStorage.setItem(state_string, JSON.stringify(emptyState));
    } else {
      if (mode === "daily" && state.date !== formatDate(today)) {
        localStorage.setItem(state_string, JSON.stringify(emptyState));
      } else if (mode === "daily" && state.currentIndex > 1) {
        setWord(state.solution);
        setCurrentIndex(state.currentIndex - 1);
        setBoard(state.boardState);
        setCorrectLetters(state.letters.correctLetters);
        setPresentLetters(state.letters.presentLetters);
        setIncorrectLetters(state.letters.incorrectLetters);
        let tempAnimated = [false, false, false, false, false, false];
        for (let i = 0; i < state.currentIndex - 1; i++) {
          tempAnimated[i] = true;
        }
        setWordRevealAnimated(tempAnimated);
        if (state.status === "WON" || state.status === "LOST") {
          if (state.status === "WON") {
            setGameWon(true);
          }
          setGameCompleted(true);
          setKeyboardActive(false);
          setTimeout(() => {
            setScoreVisible(true);
          }, 2000);
        }
      } else if (mode === "unlimited" && state.currentIndex > 1) {
        if (state.status === "WON" || state.status === "LOST") {
          localStorage.setItem(state_string, JSON.stringify(emptyState));
        } else {
          setWord(state.solution);
          setCurrentIndex(state.currentIndex - 1);
          setBoard(state.boardState);
          setCorrectLetters(state.letters.correctLetters);
          setPresentLetters(state.letters.presentLetters);
          setIncorrectLetters(state.letters.incorrectLetters);
          let tempAnimated = [false, false, false, false, false, false];
          for (let i = 0; i < state.currentIndex - 1; i++) {
            tempAnimated[i] = true;
          }
          setWordRevealAnimated(tempAnimated);
        }
      }
    }
  };

  const evaluteWord = (result, answer) => {
    let results = ["absent", "absent", "absent", "absent", "absent"];
    for (let i = 0; i < 5; i++) {
      let currChar = result.charAt(i);
      if (answer.charAt(i) === currChar) {
        results[i] = "correct";
      } else {
        for (let j = 0; j < 5; j++) {
          if (j === i) {
            continue;
          } else {
            if (results[j] !== "absent") {
              continue;
            }
            if (answer.charAt(j) === currChar) {
              results[j] = "present";
              break;
            }
          }
        }
      }
    }
    return results;
  };

  const onWinGame = (guessNumber) => {
    setKeyboardActive(false);
    let stats_string =
      mode === "daily"
        ? "matthijsle_daily_stats"
        : "matthijsle_unlimited_stats";

    let stats = JSON.parse(localStorage.getItem(stats_string));
    stats["gamesStats"].played += 1;
    stats["gamesStats"].gamesWon += 1;
    stats["gamesStats"].currentStreak += 1;
    if (stats["gamesStats"].currentStreak > stats["gamesStats"].maxStreak) {
      stats["gamesStats"].maxStreak = stats["gamesStats"].currentStreak;
    }

    stats.guesses[guessNumber.toString()] += 1;
    localStorage.setItem(stats_string, JSON.stringify(stats));
    setGameWon(true);
    setGameCompleted(true);
    setTimeout(() => {
      setScoreVisible(true);
    }, 2000);
  };

  const onLoseGame = () => {
    let stats_string =
      mode === "daily"
        ? "matthijsle_daily_stats"
        : "matthijsle_unlimited_stats";

    let stats = JSON.parse(localStorage.getItem(stats_string));
    stats["gamesStats"].played += 1;
    stats["gamesStats"].currentStreak = 0;
    localStorage.setItem(stats_string, JSON.stringify(stats));
    setGameCompleted(true);

    setTimeout(() => {
      setScoreVisible(true);
    }, 2000);

    setKeyboardActive(false);
  };

  useEffect(() => {
    let stats_string =
      mode === "daily"
        ? "matthijsle_daily_stats"
        : "matthijsle_unlimited_stats";
    if (localStorage.getItem(stats_string) === null) {
      const gamesStats = {
        played: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
      };
      const guesses = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
      };

      const stats = {
        gamesStats: gamesStats,
        guesses: guesses,
      };
      localStorage.setItem(stats_string, JSON.stringify(stats));
    }
    loadFromStorage();
    // eslint-disable-next-line
  }, []);

  const Word = (props) => {
    return (
      <div className="word-row">
        {board[props.row].eval === null &&
          letters.map((letter) => {
            return (
              <div key={Math.random().toString()} className="word-tile">
                {board[props.row].word.length > letter
                  ? board[props.row].word.charAt(letter)
                  : ""}
              </div>
            );
          })}
        {board[props.row].eval !== null &&
          letters.map((letter) => {
            return (
              <div
                key={Math.random().toString()}
                className={
                  "word-tile " +
                  board[props.row].eval[letter] +
                  (!wordRevealAnimated[props.row] ? " animation" : "")
                }
              >
                {board[props.row].word.charAt(letter)}
              </div>
            );
          })}
      </div>
    );
  };

  const updateStoredState = (rowNumber, status) => {
    let state_string =
      mode === "daily"
        ? "matthijsle_state_daily"
        : "matthijsle_state_unlimited";
    let state = JSON.parse(localStorage.getItem(state_string));
    state.boardState = board;
    state.currentIndex = rowNumber;
    state.status = status;
    state.letters = {
      presentLetters: presentLetters,
      correctLetters: correctLetters,
      incorrectLetters: incorrectLetters,
    };
    localStorage.setItem(state_string, JSON.stringify(state));
  };

  useEffect(() => {
    if (currentIndex === 0) {
      return;
    } else {
      if (board[currentIndex - 1].word.toLowerCase() === word) {
        updateStoredState(currentIndex + 1, "WON");
      } else {
        if (currentIndex >= 6) {
          updateStoredState(currentIndex + 1, "LOST");
        } else {
          updateStoredState(currentIndex + 1, "IN_PROGRESS");
        }
      }
    }
    // eslint-disable-next-line
  }, [currentIndex]);

  useEffect(() => {
    let state_string =
      mode === "daily"
        ? "matthijsle_state_daily"
        : "matthijsle_state_unlimited";
    let state = JSON.parse(localStorage.getItem(state_string));
    state.letters = {
      presentLetters: presentLetters,
      correctLetters: correctLetters,
      incorrectLetters: incorrectLetters,
    };
    localStorage.setItem(state_string, JSON.stringify(state));
    // eslint-disable-next-line
  }, [correctLetters, incorrectLetters, presentLetters]);

  const onClickKeyboard = (key) => {
    if (!keyboardActive) {
      return;
    }
    if (key === "ENTER") {
      if (board[currentIndex].word.length !== 5) return;
      else {
        if (!wordlist.includes(board[currentIndex].word.toLowerCase())) {
          setWordIncorrect(true);
          setTimeout(() => {
            setWordIncorrect(false);
          }, 2000);
          return;
        }
        const evaluation = evaluteWord(
          word,
          board[currentIndex].word.toLowerCase()
        );

        if (board[currentIndex].word.toLowerCase() === word) {
          onWinGame(currentIndex + 1);
        } else if (currentIndex === 5) {
          onLoseGame();
        }

        setBoard((state) => {
          let temp = [...state];
          temp[currentIndex].eval = evaluation;
          return temp;
        });
        setTimeout(() => {
          evaluation.forEach((result, idx) => {
            const curLetter = board[currentIndex].word.charAt(idx);
            if (result === "absent") {
              setIncorrectLetters((state) => [
                ...state.filter((x) => x !== curLetter),
                curLetter,
              ]);
            } else if (result === "present") {
              if (!correctLetters.includes(curLetter)) {
                setPresentLetters((state) => [
                  ...state.filter((x) => x !== curLetter),
                  curLetter,
                ]);
              }
            } else {
              setPresentLetters((state) =>
                state.filter((x) => x !== curLetter)
              );
              setCorrectLetters((state) => [
                ...state.filter((x) => x !== curLetter),
                curLetter,
              ]);
            }
          });
        }, 1500);
        setTimeout(() => {
          setWordRevealAnimated((state) => {
            let temp = [...state];
            temp[currentIndex] = true;
            return temp;
          });
        }, 1500);
        setCurrentIndex((state) => (state += 1));
      }
    } else if (key === "BACKSPACE") {
      setBoard((state) => {
        let temp = [...state];
        temp[currentIndex].word = temp[currentIndex].word.slice(0, -1);
        return temp;
      });
    } else if (board[currentIndex].word.length === 5) {
      return;
    } else {
      setBoard((state) => {
        let temp = [...state];
        temp[currentIndex].word = temp[currentIndex].word += key;

        return temp;
      });
    }
  };

  const KeyboardKey = (props) => {
    return (
      <div
        className={
          "keyboard-key" +
          (correctLetters.includes(props.value)
            ? " correct"
            : presentLetters.includes(props.value)
            ? " present"
            : incorrectLetters.includes(props.value)
            ? " incorrect"
            : "")
        }
        onClick={() => {
          onClickKeyboard(props.value);
        }}
      >
        {props.value}
      </div>
    );
  };

  const ScoreModal = (props) => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [days, hours, minutes, seconds] = useCountdown(
      new Date(formatDate(tomorrow) + " 00:00:00")
    );

    let stats_string =
      mode === "daily"
        ? "matthijsle_daily_stats"
        : "matthijsle_unlimited_stats";

    const stats = JSON.parse(localStorage.getItem(stats_string)).guesses;

    let max = 0;
    Object.keys(stats).forEach((key) => {
      if (stats[key] > max) {
        max = stats[key];
      }
    });

    let percentages = [];
    if (max !== 0) {
      Object.keys(stats).forEach((key) => {
        if (stats[key] === 0) {
          percentages.push(10);
        } else {
          percentages.push(10 + Math.round((stats[key] / max) * 90));
        }
      });
    }

    const gamesStats = JSON.parse(
      localStorage.getItem(stats_string)
    ).gamesStats;
    const percentageWon =
      gamesStats.played > 0
        ? Math.round((gamesStats.gamesWon / gamesStats.played) * 100)
        : 0;

    return (
      <Modal
        closeModal={() => {
          setScoreVisible(false);
        }}
      >
        <div className="score-modal">
          {!gameCompleted && (
            <div>
              <div className="score-title">YOUR SCORES</div>
              <div className="score-subtitle">
                Matthijsle - {mode === "daily" ? "Daily" : "Unlimited"}
              </div>{" "}
            </div>
          )}
          {gameCompleted && (
            <div>
              <div className="completed-message">
                {gameWon ? "Congratulations!" : "Better luck next time..."}
              </div>
              <div className="completed-message">The word was:</div>
              <div className="completed-word">{word}</div>
            </div>
          )}

          <div className="score-items">
            <div className="score-item">
              <div className="value">{gamesStats.played}</div>
              <div className="label">Played</div>
            </div>
            <div className="score-item">
              <div className="value">{percentageWon}</div>
              <div className="label">% Won</div>
            </div>
            <div className="score-item">
              <div className="value">{gamesStats.currentStreak}</div>
              <div className="label">Current Streak</div>
            </div>
            <div className="score-item">
              <div className="value">{gamesStats.maxStreak}</div>
              <div className="label">Max Streak</div>
            </div>
          </div>
          {max !== 0 && (
            <div className="guess-distribution">
              <div className="guess-distribution-title">GUESS DISTRIBUTION</div>
              <div className="guess-distribution-chart">
                <div className="guess-distribution-chart-row">
                  <div className="label">1</div>
                  <div className="bar-outer">
                    <div
                      className="bar"
                      style={{ width: percentages[0].toString() + "%" }}
                    >
                      {stats["1"]}
                    </div>
                  </div>
                </div>
                <div className="guess-distribution-chart-row">
                  <div className="label">2</div>
                  <div className="bar-outer">
                    <div
                      className="bar"
                      style={{ width: percentages[1].toString() + "%" }}
                    >
                      {stats["2"]}
                    </div>
                  </div>
                </div>
                <div className="guess-distribution-chart-row">
                  <div className="label">3</div>
                  <div className="bar-outer">
                    <div
                      className="bar"
                      style={{ width: percentages[2].toString() + "%" }}
                    >
                      {stats["3"]}
                    </div>
                  </div>
                </div>
                <div className="guess-distribution-chart-row">
                  <div className="label">4</div>
                  <div className="bar-outer">
                    <div
                      className="bar"
                      style={{ width: percentages[3].toString() + "%" }}
                    >
                      {stats["4"]}
                    </div>
                  </div>
                </div>
                <div className="guess-distribution-chart-row">
                  <div className="label">5</div>
                  <div className="bar-outer">
                    <div
                      className="bar"
                      style={{ width: percentages[4].toString() + "%" }}
                    >
                      {stats["5"]}
                    </div>
                  </div>
                </div>
                <div className="guess-distribution-chart-row">
                  <div className="label">6</div>
                  <div className="bar-outer">
                    <div
                      className="bar"
                      style={{ width: percentages[5].toString() + "%" }}
                    >
                      {stats["6"]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {gameCompleted &&
            mode === "daily" &&
            days + hours + minutes + seconds > 0 && (
              <div className="next-matthijsle-timer">
                <div className="timer-title">NEXT MATTHIJSLE</div>
                <div className="timer">
                  <div className="hours">
                    {hours.toString().length === 1
                      ? "0" + hours.toString()
                      : hours.toString()}
                  </div>
                  <div className="minutes">
                    :
                    {minutes.toString().length === 1
                      ? "0" + minutes.toString()
                      : minutes.toString()}
                  </div>
                  :
                  <div className="seconds">
                    {seconds.toString().length === 1
                      ? "0" + seconds.toString()
                      : seconds.toString()}
                  </div>
                </div>
              </div>
            )}
          {gameCompleted &&
            ((mode === "daily" && days + hours + minutes + seconds < 0) ||
              mode === "unlimited") && <NewGameButton />}
        </div>
      </Modal>
    );
  };

  return (
    <div className="matthijsle-outer-outer">
      {scoreVisible && <ScoreModal />}
      <TopBar title="Matthijsle" leftIcon={{
        onClick: () => navigate(RoutePath.GAMES),
        Icon: MdArrowBack
      }} 
      rightIcon={{
        onClick: () => setScoreVisible(true),
        Icon: RiBarChart2Fill
      }}
      />
      <div className="matthijsle-outer">
      <div className="matthijsle-inner">

        {wordIncorrect && (
          <div className="incorrect-word">This word is not correct!</div>
        )}
        <div className="board-outer">
          <div className="board">
            {rows.map((row) => {
              return <Word key={Math.random().toString()} row={row} />;
            })}
          </div>
        </div>
        <div className="keyboard">
          <div className="keyboard-row">
            <KeyboardKey value={"Q"} />
            <KeyboardKey value="W" />
            <KeyboardKey value="E" />
            <KeyboardKey value="R" />
            <KeyboardKey value="T" />
            <KeyboardKey value="Y" />
            <KeyboardKey value="U" />
            <KeyboardKey value="I" />
            <KeyboardKey value="O" />
            <KeyboardKey value="P" />
          </div>
          <div className="keyboard-row">
            <KeyboardKey value="A" />
            <KeyboardKey value="S" />
            <KeyboardKey value="D" />
            <KeyboardKey value="F" />
            <KeyboardKey value="G" />
            <KeyboardKey value="H" />
            <KeyboardKey value="J" />
            <KeyboardKey value="K" />
            <KeyboardKey value="L" />
          </div>
          <div className="keyboard-row">
            <div
              className="keyboard-key special delete"
              onClick={() => {
                onClickKeyboard("BACKSPACE");
              }}
            >
              <FiDelete />
            </div>

            <KeyboardKey value="Z" />
            <KeyboardKey value="X" />
            <KeyboardKey value="C" />
            <KeyboardKey value="V" />
            <KeyboardKey value="B" />
            <KeyboardKey value="N" />
            <KeyboardKey value="M" />
            <div
              className="keyboard-key special"
              onClick={() => {
                onClickKeyboard("ENTER");
              }}
            >
              ENTER
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Matthijsle;
