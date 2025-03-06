import React from 'react';
import { MdOutlineRestartAlt } from "react-icons/md";

const GameOverScreen = (props) => {
  console.log("GAME OVER");
  let highscoresTemp = JSON.parse(localStorage.getItem(props.tetris_storage));
  let x = 5;
  for (let i = 0; i < highscoresTemp.length; i++) {
    if (props.score > highscoresTemp[i]) {
      x = i;
      break;
    }
  }

  if (x < 5) {
    let newHighscores = [
      ...highscoresTemp.slice(0, x),
      props.score,
      ...highscoresTemp.slice(x, 4),
    ];
    localStorage.setItem(props.tetris_storage, JSON.stringify(newHighscores));
  }

  return (
    <div className="tetris_gameover_screen">
      {x < 5 && (
        <div className="congratulation_message">
          Congratulations! <br />
          {x === 0
            ? "New highscore!"
            : x === 1
            ? "New 2nd highest score!"
            : x === 2
            ? "New 3rd highest score!"
            : `New ${x + 1}th highest score!`}
        </div>
      )}
      <div className="tetris-gameover-slide-in">Game Over</div>
      <div
        className="restart-button"
        onClick={() => {
          window.location.reload(false);
        }}
      >
        <div className="restart-icon">
          <MdOutlineRestartAlt />
        </div>{" "}
        Restart
      </div>
    </div>
  );
};

export default GameOverScreen;
