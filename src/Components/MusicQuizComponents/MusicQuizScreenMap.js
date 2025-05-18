import { SCREENS } from "./MusicQuizScreens";

import GameChoiceScreen from "Screens/MusicQuizScreens/GameChoiceScreen";
import PlayerScreen from "Screens/MusicQuizScreens/PlayerScreen";
import GameOverviewScreen from "Screens/MusicQuizScreens/GameOverviewScreen";
import ChosePlaylistScreen from "Screens/MusicQuizScreens/ChosePlaylistScreen";
import SongPlayerScreen from "Screens/MusicQuizScreens/SongPlayerScreen";
import ScoreScreen from "Screens/MusicQuizScreens/ScoreScreen";
import QuizMasterScreen from "Screens/MusicQuizScreens/QuizMasterScreen";
import ManagePlaylistScreen from "Screens/MusicQuizScreens/ManagePlaylistScreen";
import SongRevealScreen from "Screens/MusicQuizScreens/SongRevealScreen";

const screenMap = {
  [SCREENS.GAME_CHOICE]: GameChoiceScreen,
  [SCREENS.PLAYER_SCREEN]: PlayerScreen,
  [SCREENS.GAME_OVERVIEW]: GameOverviewScreen,
  [SCREENS.PLAYLISTS]: ChosePlaylistScreen,
  [SCREENS.SONG_PLAYER]: SongPlayerScreen,
  [SCREENS.SONG_REVEAL]: SongRevealScreen,
  [SCREENS.SCORE_KEEPER]: ScoreScreen,
  [SCREENS.QUIZ_MASTER]: QuizMasterScreen,
  [SCREENS.MANAGE_PLAYLIST]: ManagePlaylistScreen
};

export default screenMap;
