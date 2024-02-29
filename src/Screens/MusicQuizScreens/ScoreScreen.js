import { useContext, useState } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import "../../style/MusicQuizScreens/ScoreScreen.css";

const ScoreScreen = (props) => {
    const mc = useContext(MusicQuizContext);

    const [temp, setTemp] = useState(mc.players);

    const [points, setPoints] = useState({
      one_point: [],
      two_points: [],
    });

    return (
      <div className="score-screen">
        <div className="score-screen-inner">
          <div className="score-screen-title">Player scores</div>
          {mc.players.map((player, idx) => {
            return (
              <div key={Math.random().toString()} className="player-score">
                <div className="player-score-name">{player.name}</div>{" "}
                <div className="player-score-points">{player.points}</div>
                <div className="player-points-buttons">
                  <div
                    className={
                      points.one_point.includes(idx)
                        ? "player-points-button chosen"
                        : points.one_point.length >= 2 ||
                          points.two_points.length > 0
                        ? "player-points-button disabled"
                        : "player-points-button"
                    }
                    onClick={() => {
                      if (points.two_points.length > 0) return;
                      if (points.one_point.includes(idx)) {
                        setPoints((state) => {
                          let temp = { ...state };
                          temp.one_point = temp.one_point.filter(
                            (x) => x !== idx
                          );
                          return temp;
                        });

                        setTemp((state) => {
                          let temp = [...state];
                          temp[idx].points -= 1;
                          return temp;
                        });

                        return;
                      }

                      if (points.one_point.length >= 2) return;

                      setPoints((state) => {
                        let temp = { ...state };
                        temp.one_point.push(idx);
                        return temp;
                      });

                      setTemp((state) => {
                        let temp = [...state];
                        temp[idx].points += 1;
                        return temp;
                      });
                    }}
                  >
                    +1
                  </div>
                  <div
                    className={
                      points.two_points.includes(idx)
                        ? "player-points-button chosen"
                        : points.one_point.length > 0 ||
                          points.two_points.length > 0
                        ? "player-points-button disabled"
                        : "player-points-button"
                    }
                    onClick={() => {
                      if (points.one_point.length > 0) return;
                      if (points.two_points.length > 0) {
                        if (points.two_points[0] !== idx) return;
                        setPoints((state) => {
                          let temp = { ...state };
                          temp.two_points = [];
                          return temp;
                        });

                        setTemp((state) => {
                          let temp = [...state];
                          temp[idx].points -= 2;
                          return temp;
                        });
                        return;
                      }

                      setPoints((state) => {
                        let temp = { ...state };
                        temp.two_points.push(idx);
                        return temp;
                      });

                      setTemp((state) => {
                        let temp = [...state];
                        temp[idx].points += 2;
                        return temp;
                      });
                    }}
                  >
                    +2
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="save-and-continue-outer">
          <div
            className="save-and-continue-inner"
            onClick={() => {
              mc.setPlayers(temp);
              let tempStored = JSON.parse(
                localStorage.getItem(mc.GAME_STORAGE_NAME)
              );

              let tempQuizMaster =
                mc.currentQuizMaster === mc.players.length - 1
                  ? 0
                  : mc.currentQuizMaster + 1;

              mc.setCurrentQuizMaster(tempQuizMaster);
              mc.setCurrentScreen("quizmaster");

              if (tempStored === null) return;

              tempStored.players = temp;
              tempStored.quizMaster = tempQuizMaster;
              localStorage.setItem(
                mc.GAME_STORAGE_NAME,
                JSON.stringify(tempStored)
              );
            }}
          >
            Next round
          </div>
        </div>
      </div>
    );
  };

  export default ScoreScreen;