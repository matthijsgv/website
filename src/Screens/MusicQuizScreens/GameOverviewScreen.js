import React from 'react';
import { useContext } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import "../../style/MusicQuizScreens/GameOverviewScreen.css";

const GameOverviewScreen = () => {
  const mc = useContext(MusicQuizContext);
  const prevGame = JSON.parse(localStorage.getItem(mc.GAME_STORAGE_NAME));

  return (
    <div className="score-screen">
      <div className="score-screen-inner">
        <div className="score-screen-title">Game Overview</div>
        {prevGame.players.map((player, idx) => {
          return (
            <div className="overview-player">
              {idx === prevGame.quizMaster && (
                <div className="quiz-master-indication">Quiz Master</div>
              )}
              <div className="overview-player-name">{player.name}</div>
              <div className="overview-player-score">{player.points}</div>
            </div>
          );
        })}
      </div>
      <div className="save-and-continue-outer">
        <div
          className="save-and-continue-inner"
          onClick={() => {
            mc.setCurrentQuizMaster(prevGame.quizMaster);
            mc.setPlayers(prevGame.players);
            mc.setPlayedSongs(prevGame.playedSongs);
            mc.loadPlaylistsInfo(prevGame.playlists);
            mc.setCurrentScreen("quizmaster");
          }}
        >
          Continue Game
        </div>
      </div>
    </div>
  );
};

export default GameOverviewScreen;
