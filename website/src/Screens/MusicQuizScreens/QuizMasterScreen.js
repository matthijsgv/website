import { useContext } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import "../../style/MusicQuizScreens/QuizMasterScreen.css";
const QuizMasterScreen = () => {
  const mc = useContext(MusicQuizContext);

  return (
    <div className="quiz-master-screen">
      <div className="quiz-master-screen-inner">
        The quizmaster this round is
        <div className="quiz-master-screen-name">
          {mc.players[mc.currentQuizMaster].name}
        </div>
        <div className="quiz-master-screen-smaller-text">
          They can choose the next playlist!
        </div>
      </div>
      <div className="save-and-continue-outer">
        <div
          className="save-and-continue-inner"
          onClick={() => {
            mc.setCurrentScreen("playlists");
          }}
        >
          Choose playlist
        </div>
      </div>
    </div>
  );
};

export default QuizMasterScreen;
