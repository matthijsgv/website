import React from "react";
import { FaSpotify, FaRegTrashAlt, FaPlus } from "react-icons/fa";
import "../../style/MusicQuizScreens/PlayListList.css";

const PlayListList = (props) => {
  return (
    <div className="playlist-grid">
      {props.playlists !== null &&
        props.playlists.map((item) => {
          return (
            <PlayList
              active={item.active}
              editable={props.editable}
              playlist={item}
              onClick={() => props.onClick(item)}
            />
          );
        })}
    </div>
  );
};

const AddRemoveButton = (props) => {
  return (
    <div
      className={
        "playlist-add-remove-button" + (props.isAdd ? " add" : " remove")
      }
      onClick={props.onClick}
    >
      {props.isAdd ? <FaPlus /> : <FaRegTrashAlt />}
    </div>
  );
};

const PlayList = (props) => {

  return (
    <div
      className={"playlist_outer" + ((props.editable && props.active) ?  " active" : "" )}
      key={Math.random().toString()}
      onClick={props.onClick}
    >
      {props.editable && (
        <AddRemoveButton isAdd={!props.active} />
      )}
      <div>
        {props.playlist.image !== undefined ? (
          <img
            className="playlist_image"
            src={props.playlist.image}
            alt={props.playlist.name + "_cover"}
          />
        ) : (
          <div className="playlist_image">
            <FaSpotify />
          </div>
        )}
      </div>
      <div className="playlist_name">{props.playlist.name}</div>
    </div>
  );
};

export default PlayListList;
