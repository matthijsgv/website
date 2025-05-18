import React from "react";
import { useContext } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import "../../style/MusicQuizScreens/QuizMasterScreen.css";
import { SCREENS } from "Components/MusicQuizComponents/MusicQuizScreens";
import MusicQuizScreen from "./MusicQuizScreen";
const QuizMasterScreen = () => {
  const mc = useContext(MusicQuizContext);
  return (
    <MusicQuizScreen
      button={{
        label: "Choose a playlist",
        onClick: () => {
          mc.navigateTo(SCREENS.PLAYLISTS);
        },
      }}
    >
      <div className="quiz_master_outer">
        <div className="quiz-master-screen-inner">
          The quizmaster this round is
          <div className="quiz-master-screen-name">
            {mc.players[mc.currentQuizMaster].name}
          </div>
          <div className="quiz-master-screen-smaller-text">
            They can choose the next playlist!
          </div>
        </div>
      </div>
    </MusicQuizScreen>
  );
};

export default QuizMasterScreen;
