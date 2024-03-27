import { useContext } from "react";
import MusicQuizContext from "../../store/music-quiz-context";
import TopBar from "../../UI/TopBar";
import PlayListList from "./PlayListList";
import "../../style/MusicQuizScreens/ChosePlaylistScreen.css";
import {MdEditNote} from "react-icons/md";

const ChosePlaylistScreen = (props) => {
  const mc = useContext(MusicQuizContext);

  return (
    <div className="choose_playlist_screen">
      <TopBar title="Playlists" rightIcon={{
        onClick: () => mc.setCurrentScreen("edit"),
        Icon: MdEditNote
      }} />
      <PlayListList
        playlists={mc.playlists}
        onClick={(playlist) => {
          mc.pickSong(playlist);
        }}
      />

      
    </div>
  );
};


export default ChosePlaylistScreen;
