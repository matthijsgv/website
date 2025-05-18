import React from "react";
import { useContext, useEffect } from "react";
import "../style/MusicQuiz.css";

import MusicQuizContext from "../store/music-quiz-context";
import screenMap from "Components/MusicQuizComponents/MusicQuizScreenMap";
import { SCREENS } from "Components/MusicQuizComponents/MusicQuizScreens";
import LoadingIndicator from "Components/LoadingIndicator";
import SpotifyContext from "store/spotify-context";
import SpotifyLoginScreen from "./SpotifyLoginScreen";

const MusicQuiz = () => {
  const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URL;
  const GAME_STORAGE_NAME = "music_quiz_current_game";

  const mc = useContext(MusicQuizContext);
  const spotifyContext = useContext(SpotifyContext);
  const CurrentScreen = screenMap[mc.currentScreen] || null;

  useEffect(() => {
    console.log(CurrentScreen);
    const prevGame = localStorage.getItem(GAME_STORAGE_NAME);
    console.log("Prev Game", prevGame);
    if (prevGame !== null) {
      console.log("MusicQuizStorage", prevGame);
      mc.navigateTo(SCREENS.GAME_CHOICE);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="music-quiz">
        {spotifyContext.token === null && (
          <SpotifyLoginScreen redirectUrl={REDIRECT_URI} />
        )}
        {spotifyContext.token !== null && (
          <div>
            {mc.loading && (
              <LoadingIndicator
                style={{ size: "4vw", thickness: "0.2vw" }}
                mobileStyle={{ size: "20vw", thickness: "1vw" }}
                colors={{
                  mainColor: "rgb(30, 215, 96)",
                  secondaryColor: "rgba(30, 215, 96, 0.1)",
                }}
              />
            )}
            {!mc.loading && CurrentScreen && (
              <div>
                <CurrentScreen />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicQuiz;
