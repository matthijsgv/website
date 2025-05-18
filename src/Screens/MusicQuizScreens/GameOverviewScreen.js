import React from "react";
import { useContext } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import "../../style/MusicQuizScreens/GameOverviewScreen.css";
import { SCREENS } from "Components/MusicQuizComponents/MusicQuizScreens";
import MusicQuizScreen from "./MusicQuizScreen";

const GameOverviewScreen = () => {
  const mc = useContext(MusicQuizContext);
  const prevGame = JSON.parse(localStorage.getItem(mc.GAME_STORAGE_NAME));

  const PlayerRow = (props) => {
    return (
      <div className="game_overview_player_row">
        <div className="game_overview_quiz_master_field">
          {props.isQuizMaster && "Quiz Master"}
        </div>
        <div className="game_overview_player_name">{props.name}</div>
        <div className="game_overview_score">{props.points}</div>
      </div>
    );
  };

  const onContinue = () => {
    mc.setCurrentQuizMaster(prevGame.quizMaster);
    mc.setPlayers(prevGame.players);
    mc.setPlayedSongs(prevGame.playedSongs);
    mc.loadPlaylistsInfo(prevGame.playlists);
    mc.navigateTo(SCREENS.QUIZ_MASTER);
  };

  return (
    <MusicQuizScreen
      title="Game Overview"
      button={{
        label: "Continue your game",
        onClick: onContinue
      }}
    >
      <div></div>
      <div className="game_overview_players_outer">
        {prevGame.players.map((player, idx) => {
          return (
            <PlayerRow
              isQuizMaster={idx === prevGame.quizMaster}
              name={player.name}
              points={player.points}
            />
          );
        })}
      </div>
    </MusicQuizScreen>
  );
};

export default GameOverviewScreen;
