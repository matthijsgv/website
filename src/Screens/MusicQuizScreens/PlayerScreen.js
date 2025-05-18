import React from "react";
import "../../style/MusicQuizScreens/PlayerScreen.css";
import { useContext, useState } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import { SCREENS } from "Components/MusicQuizComponents/MusicQuizScreens";
import { TiUserAdd, TiUser } from "react-icons/ti";
import MusicQuizScreen from "./MusicQuizScreen";


const PlayerInput = (props) => {
  return (
    <div className="player">
      <div className="player-icon">
        <TiUser />
      </div>
      <input
        className="player-name-input"
        type="text"
        value={props.name}
        onChange={(e) => {
          props.setNames((state) => {
            let temp = [...state];
            temp[props.index] = e.target.value;
            return temp;
          });
        }}
      />
    </div>
  );
};


const PlayerScreen = () => {
  const [names, setNames] = useState([""]);
  const mc = useContext(MusicQuizContext);


  const AddPlayerButton = () => {
    return (
      <div
        className="add-player-button"
        onClick={() => {
          setNames((state) => [...state, ""]);
        }}
      >
        <div className="add_player_icon">
          <TiUserAdd />
        </div>{" "}
        Add player
      </div>
    );
  };

  const onSubmit = async () => {
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
    )
    mc.loadPlaylistsInfo();
    mc.navigateTo(SCREENS.QUIZ_MASTER);
  };

  return (
    <MusicQuizScreen 
    title="Add your players"
    button={{
      label: "Start game",
      onClick: onSubmit,
    }}
    >
      <div className="player_screen_content">
        {names.map((name, idx) => {
          return <PlayerInput name={name} index={idx} setNames={setNames} />;
        })}
        <AddPlayerButton />
      </div>
    </MusicQuizScreen>
  );
};

export default PlayerScreen;
