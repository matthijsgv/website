import React from "react";
import { useContext } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import "../../style/MusicQuizScreens/GameChoiceScreen.css";
import { SCREENS } from "Components/MusicQuizComponents/MusicQuizScreens";
import MusicQuizButton from "Components/MusicQuizComponents/MusicQuizButton";
const GameChoiceScreen = () => {
  const mc = useContext(MusicQuizContext);


  return (
    <div className="game-choice-screen">
      Do you want to start a
      <MusicQuizButton
        label="New game"
        onClick={() => mc.navigateTo(SCREENS.PLAYER_SCREEN)}
        width="20vw"
        mobileWidth="80vw"
      />
      or continue with your
      <MusicQuizButton
        label="Previous game"
        onClick={() => mc.navigateTo(SCREENS.GAME_OVERVIEW)}
        width="20vw"
        mobileWidth="80vw"
      />
    </div>
  );
};

export default GameChoiceScreen;
