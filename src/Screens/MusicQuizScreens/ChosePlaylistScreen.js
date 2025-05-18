import React from "react";
import { useContext } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import PlayListList from "./PlayListList";
import "../../style/MusicQuizScreens/ChosePlaylistScreen.css";
import { MdEditNote } from "react-icons/md";
import { SCREENS } from "Components/MusicQuizComponents/MusicQuizScreens";
import MusicQuizScreen from "./MusicQuizScreen";

const ChosePlaylistScreen = (props) => {
  const mc = useContext(MusicQuizContext);

  const ManagePlaylistIcon = () => {
    return (
      <div
        className="manage_playlists_button"
        onClick={() => mc.navigateTo(SCREENS.MANAGE_PLAYLIST)}
      >
        <MdEditNote />
      </div>
    );
  };

  return (
    <MusicQuizScreen
      title="Choose a playlist"
      iconTopRight={<ManagePlaylistIcon />}
    >
      <div className="choose_playlist_screen">
        <PlayListList
          playlists={mc.playlists}
          onClick={(playlist) => {
            mc.pickSong(playlist);
            mc.setCurrentPlaylist(playlist);
          }}
        />
      </div>
    </MusicQuizScreen>
  );
};

export default ChosePlaylistScreen;
