import { useState, useContext } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import { FaPlay, FaPause } from "react-icons/fa";

import "../../style/MusicQuizScreens/SongPlayer.css";

const SongPlayerScreen = () => {
  const [songRevealed, setSongRevealed] = useState(false);
  const [firstPlayTriggered, setFirstPlayTriggered] = useState(false);

  const GAME_STORAGE_NAME = "music_quiz_current_game";

  const mc = useContext(MusicQuizContext);

  const play = async (trackId) => {
    return fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${mc.deviceId}`,
      {
        body: JSON.stringify({
          uris: [`spotify:track:${trackId}`],
          offset: {
            position: 0,
          },
        }),
        headers: {
          Authorization: `Bearer ${mc.token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
      }
    );
  };

  const onPressPlay = async () => {
    if (!firstPlayTriggered) {
      setFirstPlayTriggered(true);
      await play(mc.currentSong);
      let temp = JSON.parse(localStorage.getItem(GAME_STORAGE_NAME));
      if (temp === null) return;

      temp.playedSongs.push(mc.currentSong);
      localStorage.setItem(GAME_STORAGE_NAME, JSON.stringify(temp));

      return;
    }

    mc.player.togglePlay();
  };

  return (
    <div className="song-player">
      {songRevealed && (
        <div className="song-reveal-solution">
          {mc.current_track.name}
          <br />
          - <br />
          {mc.current_track.artists[0].name}
        </div>
      )}
      {!songRevealed && (
        <div className="wave-outer">
          Guess the song title {"&"} artist
          <div id="wave" className="wave-inner">
            <div
              className={!mc.is_paused ? "wave-item playing" : "wave-item"}
            ></div>
            <div
              className={!mc.is_paused ? "wave-item playing" : "wave-item"}
            ></div>
            <div
              className={!mc.is_paused ? "wave-item playing" : "wave-item"}
            ></div>
            <div
              className={!mc.is_paused ? "wave-item playing" : "wave-item"}
            ></div>
            <div
              className={!mc.is_paused ? "wave-item playing" : "wave-item"}
            ></div>
            <div
              className={!mc.is_paused ? "wave-item playing" : "wave-item"}
            ></div>
            <div
              className={!mc.is_paused ? "wave-item playing" : "wave-item"}
            ></div>
            <div
              className={!mc.is_paused ? "wave-item playing" : "wave-item"}
            ></div>
          </div>
        </div>
      )}

      <div className="song-reveal">
        {songRevealed && (
          <img
            className="album-cover"
            src={mc.current_track.album.images[0].url}
            alt="Album cover"
          />
        )}
        {!songRevealed && (
          <div
            className="song-reveal-button"
            onClick={() => {
              if (!firstPlayTriggered) {
                return;
              }
              setSongRevealed(true);
            }}
          >
            Reveal Song
          </div>
        )}
      </div>
      <div className="play-pause-button-outer">
        <div
          className="play-pause-button"
          onClick={() => {
            onPressPlay();
          }}
        >
          {!mc.is_paused ? <FaPause /> : <FaPlay />}
        </div>
        {songRevealed && (
          <div
            className="next-button"
            onClick={() => {
              if (!mc.is_paused) {
                mc.player.togglePlay();
              }
              mc.setCurrentScreen("score");
            }}
          >
            To Scores
          </div>
        )}
      </div>
    </div>
  );
};

export default SongPlayerScreen;
