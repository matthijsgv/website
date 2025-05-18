import React from "react";
import "../../style/Components/MusicQuizComponents/MusicQuizButton.css";
import { useScreenWidth } from "util/useScreenWidth";


const MusicQuizButton = (props) => {
    const screenWidth = useScreenWidth();

    const customStyle = {
        width:
          screenWidth > 600
            ? props.width || props.mobileWidth
            : props.mobileWidth || props.width,
            fontSize:
          screenWidth > 600
            ? props.fontSize || props.mobileFontSize
            : props.mobileFontSize || props.fontSize,
      };

    return <div className="music_quiz_button" onClick={props.onClick} style={customStyle}>
        {props.label}
    </div>
};

export default MusicQuizButton;