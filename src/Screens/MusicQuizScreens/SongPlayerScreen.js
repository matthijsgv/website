import React from "react";
import { useState, useContext } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import { FaPlay, FaPause, FaSpotify } from "react-icons/fa";

import "../../style/MusicQuizScreens/SongPlayer.css";
import { SCREENS } from "Components/MusicQuizComponents/MusicQuizScreens";
import SpotifyContext from "store/spotify-context";
import MusicQuizScreen from "./MusicQuizScreen";

const SongPlayerScreen = () => {
  const [firstPlayTriggered, setFirstPlayTriggered] = useState(false);

  const GAME_STORAGE_NAME = "music_quiz_current_game";

  const mc = useContext(MusicQuizContext);
  const spotifyContext = useContext(SpotifyContext);


  console.log("Playlist", mc.currentPlaylist);
  const onPressPlay = async () => {
    console.log("current Song ", mc.currentSong);
    if (!firstPlayTriggered) {
      setFirstPlayTriggered(true);
      spotifyContext.playTrack(mc.currentSong.track.id);
      let temp = JSON.parse(localStorage.getItem(GAME_STORAGE_NAME));
      if (temp === null) return;

      temp.playedSongs.push(mc.currentSong);
      localStorage.setItem(GAME_STORAGE_NAME, JSON.stringify(temp));

      return;
    }

    spotifyContext.togglePlay();
  };

  const Wave = (props) => {
    const WaveItem = ({ active }) => {
      return <div className={active ? "wave-item playing" : "wave-item"} />;
    };
    return (
      <div className="wave-outer">
        <div id="wave" className="wave-inner">
          {Array.from({ length: 8 }).map((_, index) => (
            <WaveItem key={"wave_item" + index} active={props.active} />
          ))}
        </div>
      </div>
    );
  };

  const PlayRow = () => {
    return (
      <div className="song_player_play_row">
        <div className="song_player_spotify_logo">
          <FaSpotify />
        </div>
        <div className="song_player_meta_data">
          <div className="song_player_meta_data_row up" />
          <div className="song_player_meta_data_row down" />
        </div>
        <div className="song_player_play_button">
          <div
            className="play-pause-button"
            onClick={() => {
              onPressPlay();
            }}
          >
            {spotifyContext.playing ? <FaPause /> : <FaPlay />}
          </div>
        </div>
      </div>
    );
  };

  const PlaylistRow = () => {
    return <div className="song_player_playlist_row">
      <img 
        className="song_player_playlist_album" 
        src={mc.currentPlaylist.image}
        alt="Album cover"
        />
      <div className="song_player_playlist_title">
      <div className="song_player_playlist_title_subtitle">From playlist:</div>
        {mc.currentPlaylist.name}</div>
    </div>
  }

  return (
    <MusicQuizScreen
      title="Guess the song"
      button={{
        label: "Reveal song",
        onClick: () => {
          if (!firstPlayTriggered) {
            return;
          }
          mc.navigateTo(SCREENS.SONG_REVEAL);
        },
      }}
    >
      <div className="song_player_content">
        <PlaylistRow />
        <Wave active={spotifyContext.playing} />
        <PlayRow />
      </div>
    </MusicQuizScreen>
  );
};

export default SongPlayerScreen;
