import HitsterCreateGame from "Screens/Hitster/HitsterCreateGame";
import {SCREENS} from "./HitsterScreens";
import HitsterPlayScreen from "Screens/Hitster/HitsterPlayScreen";
import NewOrOldGame from "Screens/Hitster/NewOrOldGame";

const screenMap = {
  [SCREENS.PLAY_SCREEN]: HitsterPlayScreen,
  [SCREENS.CREATE_GAME]: HitsterCreateGame,
  [SCREENS.CHOOSE]: NewOrOldGame
};
 export default screenMap;