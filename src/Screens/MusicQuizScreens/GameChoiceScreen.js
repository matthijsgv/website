import React from 'react';
import { useContext } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import "../../style/MusicQuizScreens/GameChoiceScreen.css";
const GameChoiceScreen = () => {

    const mc = useContext(MusicQuizContext);

    return (
      <div className="game-choice-screen">
        Do you want to start a
        <div
          className="game-choice-button"
          onClick={() => {
            mc.setCurrentScreen("playerScreen");
          }}
        >
          New Game
        </div>
        or continue with your
        <div
          className="game-choice-button"
          onClick={() => {
            mc.setCurrentScreen("gameOverview");
          }}
        >
          Previous Game
        </div>
      </div>
    );
  };

  export default GameChoiceScreen;