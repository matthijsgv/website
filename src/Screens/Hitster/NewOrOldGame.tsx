import { useHitsterContext } from "store/hitster-context";
import "../../style/Hitster/NewOrOldGame.css";

const NewOrOldGame = () => {
  const hitsterContext = useHitsterContext();
  return (
    <div className="new_or_old_game_screen">
      <div className="new_or_old_game_screen_title">Continue your game?</div>
      <div className="new_or_old_game_screen_subtitle">
        You have an existing game. What would you like to do?
      </div>
      <div className="new_or_old_game_buttons">
        <div
          className="new_or_old_game_button"
          onClick={() => {
            hitsterContext.continuePreviousGame();
          }}
        >
          Continue Game
        </div>
        <div
          className="new_or_old_game_button"
          onClick={() => {
            hitsterContext.createNewGame();
          }}
        >
          Start New Game
        </div>
      </div>
    </div>
  );
};

export default NewOrOldGame;
