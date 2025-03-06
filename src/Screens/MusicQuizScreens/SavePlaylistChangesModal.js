import React from 'react';
import Modal from "../../UI/Modal";

import "../../style/MusicQuizScreens/SavePlaylistChangesModal.css";

const SavePlayListChangesModal = (props) => {
  return (
    <Modal closeModal={props.closeModal}>
      <div className="save_playlist_modal">
        Do you want to save the following changes?
        {props.toAdd.length > 0 && (
          <div>
            <div className="save_playlist_add_title">Add</div>
            {props.toAdd.map((item) => (
              <div className="save_playlist_list_item">&#x2022; {item.name}</div>
            ))}
          </div>
        )}
        {props.toRemove.length > 0 && (
          <div>
            <div className="save_playlist_remove_title">Remove</div>
            {props.toRemove.map((item) => (
              <div className="save_playlist_list_item">&#x2022; {item.name}</div>
            ))}
          </div>
        )}

        <div className="save_playlist_button_row">
            <div className="save_playlist_button cancel" onClick={props.closeModal}>Cancel</div>
            <div className="save_playlist_button save" onClick={props.onSave}>Save</div>
        </div>
      </div>
    </Modal>
  );
};

export default SavePlayListChangesModal;
