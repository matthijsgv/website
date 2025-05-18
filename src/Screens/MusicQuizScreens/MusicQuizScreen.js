import MusicQuizButton from "Components/MusicQuizComponents/MusicQuizButton";
import React from "react";
import "../../style/MusicQuizScreens/MusicQuizScreen.css";

const MusicQuizScreen = (props) => {
  return (
    <div className="music_quiz_screen_outer">
      {props.title && (
        <div className="music_quiz_screen_title">
            <div className="music_quiz_screen_option_button" >
                {props.iconTopLeft && props.iconTopLeft}
            </div>
            <div className="music_quiz_screen_title_text">
            {props.title}
            </div>
            <div className="music_quiz_screen_option_button">{props.iconTopRight && props.iconTopRight}</div>
            </div>
      )}
      <div className="music_quiz_screen_content">{props.children}</div>
      {props.button && (
        <div className="music_quiz_button_row">
          <MusicQuizButton
            label={props.button.label}
            onClick={props.button.onClick}
          />
        </div>
      )}
    </div>
  );
};

export default MusicQuizScreen;
