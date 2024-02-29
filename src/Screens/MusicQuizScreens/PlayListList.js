import { FaSpotify } from "react-icons/fa";
import "../../style/MusicQuizScreens/PlayListList.css";

const PlayListList = (props) => {
  return (
    <div className="playlist-grid">
      {props.playlists !== null &&
        props.playlists.map((item) => {
          return <PlayList playlist={item} onClick={() => props.onClick(item)} />;
        })}
    </div>
  );
};


const PlayList = (props) => {
  return (
    <div className={(props.playlist.active === undefined || props.playlist.active) ? "playlist-search-result" : "playlist-search-result inactive"} onClick={() => props.onClick()}>
      <div>
        {props.playlist.image !== undefined ? (
          <img
            className="playlist-search-image"
            src={props.playlist.image}
            alt={props.playlist.name + "_cover"}
          />
        ) : (
          <div className="playlist-search-image">
            <FaSpotify />
          </div>
        )}
      </div>
      <div className="playlist-search-title">{props.playlist.name}</div>
    </div>
  );
};

export default PlayListList;
