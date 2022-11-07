import { FaRegUser } from "react-icons/fa";
import "../../style/MusicQuizScreens/PlayerScreen.css";
import { useContext, useState } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
const PlayerScreen = () => {
    const [names, setNames] = useState([""]);
    const mc = useContext(MusicQuizContext);

    return (
      <div className="player-screen">
        <div className="player-selection">
          <div className="player-screen-title">Name the players </div>

          {names.map((name, idx) => {
            return (
              <div className="player">
                <div className="player-icon">
                  <FaRegUser />
                </div>
                <input
                  className="player-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setNames((state) => {
                      let temp = [...state];
                      temp[idx] = e.target.value;
                      return temp;
                    });
                  }}
                />
              </div>
            );
          })}
          <div
            className="add-player-button"
            onClick={() => {
              setNames((state) => [...state, ""]);
            }}
          >
            + Add Player
          </div>
        </div>
        <div className="save-and-continue-outer">
          <div
            className="save-and-continue-inner"
            onClick={async () => {
              const tempPlayers = names.map((name) => {
                return {
                  name: name,
                  points: 0,
                };
              });
              
              mc.setPlayers(tempPlayers);
              localStorage.setItem(
                mc.GAME_STORAGE_NAME,
                JSON.stringify({
                  players: tempPlayers,
                  playedSongs: [],
                  quizMaster: mc.currentQuizMaster,
                  playlists: [],
                })
              );
              mc.loadPlaylistsInfo();
              mc.setCurrentScreen("quizmaster");
            }}
          >
            Save and continue
          </div>
        </div>
      </div>
    );
  };

  export default PlayerScreen;