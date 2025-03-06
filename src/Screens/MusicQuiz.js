import React from 'react';
import { useContext, useEffect, useState } from "react";
import "../style/MusicQuiz.css";

import { FaSpotify } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import AddPlayListScreen from "./MusicQuizScreens/AddPlaylistScreen";
import MusicQuizContext from "../store/music-quiz-context";
import ChosePlaylistScreen from "./MusicQuizScreens/ChosePlaylistScreen";
import SongPlayerScreen from "./MusicQuizScreens/SongPlayerScreen";
import ScoreScreen from "./MusicQuizScreens/ScoreScreen";
import GameChoiceScreen from "./MusicQuizScreens/GameChoiceScreen";
import GameOverviewScreen from "./MusicQuizScreens/GameOverviewScreen";
import PlayerScreen from "./MusicQuizScreens/PlayerScreen";
import QuizMasterScreen from "./MusicQuizScreens/QuizMasterScreen";

const MusicQuiz = () => {
  const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URL;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "code";
  const SCOPES =
    "user-modify-playback-state streaming user-read-email user-read-private user-read-playback-state app-remote-control user-library-modify user-library-read";
  const GAME_STORAGE_NAME = "music_quiz_current_game";
  const [token, setToken] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const mc = useContext(MusicQuizContext);

  useEffect(() => {
    let code = searchParams.get("code");
    setSearchParams({});
    if (code) {
      fetch("https://accounts.spotify.com/api/token", {
        body: `code=${code}&redirect_uri=${REDIRECT_URI}&grant_type=authorization_code`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer(
              process.env.REACT_APP_CLIENT_ID +
                ":" +
                process.env.REACT_APP_CLIENT_SECRET
            ).toString("base64"),
        },
        method: "POST",
      })
        .then((result) => result.json())
        .then((response) => {
          setToken(response.access_token);
        });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    mc.setToken(token);
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (localStorage.getItem(GAME_STORAGE_NAME) !== null) {
      mc.setCurrentScreen("gameChoice");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div className="music-quiz">
        {token === null && (
          <div
            className="spotify-login-button"
            onClick={() => {
              setToken(null);
              let state = (Math.random() + 1).toString(36).substring(16);
              window.location.replace(
                `${AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}&state=${state}`
              );
            }}
          >
            <FaSpotify /> Login to Spotify
          </div>
        )}
        {token !== null && token.length > 0 && (
          <div>
            {mc.loading && <div className="playlist-loading-indicator"></div>}
            {!mc.loading && (
              <div>
                {mc.currentScreen === "gameChoice" && <GameChoiceScreen />}
                {mc.currentScreen === "playerScreen" && <PlayerScreen />}
                {mc.currentScreen === "gameOverview" && <GameOverviewScreen />}
                {mc.currentScreen === "playlists" && <ChosePlaylistScreen />}
                {mc.currentScreen === "song" && <SongPlayerScreen />}
                {mc.currentScreen === "score" && <ScoreScreen />}
                {mc.currentScreen === "quizmaster" && <QuizMasterScreen />}
                {mc.currentScreen === "edit" && <AddPlayListScreen />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicQuiz;
