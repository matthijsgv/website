import React, { useContext } from "react";
import "../../style/MusicQuizScreens/SongRevealScreen.css";
import MusicQuizContext from "store/music-quiz-context";
import MusicQuizButton from "Components/MusicQuizComponents/MusicQuizButton";
import SpotifyContext from "store/spotify-context";
import { SCREENS } from "Components/MusicQuizComponents/MusicQuizScreens";
import { FaSpotify } from "react-icons/fa";
const SongRevealScreen = () => {
  const mc = useContext(MusicQuizContext);
  const spotifyContext = useContext(SpotifyContext);

  const sanitizeSongName = (name) => {
    return name
      // Remove anything in parentheses
      .replace(/\s*\(.*?\)/g, '')
      // Remove anything after a dash (commonly used for versions)
      .replace(/\s*-\s*.*$/, '')
      // Remove “Remastered”, “Live”, etc. keywords
      .replace(/\b(remastered|live|from the .+?|version)\b/gi, '')
      // Collapse multiple spaces and trim
      .replace(/\s+/g, ' ')
      .trim();
  }

  const joinMultipleArtists = (artists) => {
    const names = artists.map((artist) => artist.name);
    if (names.length === 0) return '?';
    if (names.length === 1) return names[0];
    if (names.length === 2) return `${names[0]} & ${names[1]}`;
    return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
  };

  return (
    <div className="song_reveal_outer">
      <div className="song_reveal_inner">
        <div className="song_reveal_inner_content">
          <div className="song_reveal_spotify_logo">
            <FaSpotify /> Spotify
          </div>
        <img 
        className="song_reveal_album_cover" 
        src={mc.currentSong.track.album.images[0].url}
        alt="Album cover"
        />
        <div className="song_reveal_song_title">
          {sanitizeSongName(mc.currentSong.track.name)}
        </div>
        <div className="song_reveal_artist">
          {joinMultipleArtists(mc.currentSong.track.artists)}
        </div>
        </div>
      </div>
      <div className="song_reveal_to_scores_button">
        <MusicQuizButton label="To scores" fontSize="1.5vw" mobileFontSize="5vw" onClick={() => {
          spotifyContext.pause()
          mc.navigateTo(SCREENS.SCORE_KEEPER);
          }}/>
      </div>
    </div>
  );
};

export default SongRevealScreen;


