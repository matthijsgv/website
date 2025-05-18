import React from "react";
import { useContext, useState, useEffect } from "react";
import "../../style/MusicQuizScreens/AddPlaylistScreen.css";
import MusicQuizContext from "../../store/music-quiz-context";
import { FaSearch, FaSave } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";
import { MdArrowBack } from "react-icons/md";
import PlayListList from "./PlayListList";
import SavePlayListChangesModal from "./SavePlaylistChangesModal";
import TopBar from "../../UI/TopBar";
import { SCREENS } from "Components/MusicQuizComponents/MusicQuizScreens";

const AddPlayListScreen = (props) => {
  const [searchLists, setSearchLists] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [offset, setOffset] = useState(0);

  const [playlistsToAdd, setPlaylistToAdd] = useState([]);
  const [playlistToRemove, setPlaylistToRemove] = useState([]);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  const mc = useContext(MusicQuizContext); 

  const mapActivePlaylistToManagePlayObject = (playlist) => {
    return {
      id : playlist.id,
      image: playlist.image,
      active: true,
      name: playlist.name
    }
  };

  const saveChanges = () => {
    mc.setPlaylists((state) => {
      let temp = [...state];
      temp = temp.filter(
        (item) => !playlistToRemove.map((i) => i.id).includes(item.id)
      );
      temp = temp.concat(
        playlistsToAdd.map((item) => {
          return {
            id: item.id,
            name: item.name,
            image: item.image,
            loaded: false,
            tracks: [],
          };
        })
      );
      return temp;
    });

    setPlaylistToAdd([]);
    setPlaylistToRemove([]);
    setSaveModalVisible(false);
  };

  useEffect(() => {
    setSearchLists(mc.playlists.map(mapActivePlaylistToManagePlayObject));
  }, []);

  const searchPlaylists = async () => {
    setOffset(0);

    return fetch(
      `https://api.spotify.com/v1/search?q=${searchString}&type=playlist`,
      {
        headers: {
          Authorization: `Bearer ${mc.token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    )
      .then((result) => result.json())
      .then((res) => {
        setSearchLists(
          res.playlists.items
            .filter((i) => i !== null)
            .map((item) => {
              return {
                id: item.id,
                image:
                  item.images[0] !== undefined ? item.images[0].url : undefined,
                name: item.name,
                active:
                  mc.playlists.find((x) => x.id === item.id) !== undefined,
              };
            })
        );
      });
  };

  useEffect(() => {
    setSearchLists([]);
  }, [searchString]);

  const extendSearchList = async () => {
    let off = offset + 1;
    let realOffset = (off * 20).toString();
    setOffset(off);

    return fetch(
      `https://api.spotify.com/v1/search?q=${searchString}&type=playlist&offset=${realOffset}`,
      {
        headers: {
          Authorization: `Bearer ${mc.token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((res) => {
        setSearchLists((state) => {
          let temp = [...state];
          return temp.concat(
            res.playlists.items.map((item) => {
              return {
                id: item.id,
                image:
                  item.images[0] !== undefined ? item.images[0].url : undefined,
                name: item.name,
                active:
                  mc.playlists.find((x) => x.id === item.id) !== undefined,
              };
            })
          );
        });
      });
  };

  const onSearch = () => {
    if (searchString === "") {
      return;
    }

    searchPlaylists();
  };

  return (
    <div className="playlist_search_screen">
      <TopBar
        title="Manage Playlists"
        leftIcon={{
          onClick: () => mc.navigateTo(SCREENS.PLAYLISTS),
          Icon: MdArrowBack,
        }}
      />
      {saveModalVisible && (
        <SavePlayListChangesModal
          closeModal={() => setSaveModalVisible(false)}
          toRemove={playlistToRemove}
          toAdd={playlistsToAdd}
          onSave={saveChanges}
        />
      )}
      <div className="playlist-searchbar">
        <div className="playlist-search-row">
          <input
            placeholder="Search for a playlist..."
            className="playlist-search-input"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
          ></input>
          <div
            className="playlist-search-icon-outer"
            onClick={() => {
              if (searchString === "") {
                return;
              }

              searchPlaylists();
            }}
          >
            <FaSearch />
          </div>
        </div>
      </div>
      {/* {!searchLists.length && (
        <div className="playlist-search-placeholder-outer">
          <div className="playlist-search-placeholder">
            Search for a playlist using the searchbar on top.<br></br>-<br />
            You can add any playlist you like.
          </div>
        </div>
      )} */}
      <PlayListList
        playlists={searchLists}
        onClick={(playlist) => {
          if (mc.playlists.find((x) => x.id === playlist.id) !== undefined) {
            if (playlist.active) {
              setPlaylistToRemove((state) => [...state, playlist]);
            } else {
              setPlaylistToRemove((state) =>
                state.filter((x) => x.id !== playlist.id)
              );
            }
          } else {
            if (!playlist.active) {
              setPlaylistToAdd((state) => [...state, playlist]);
            } else {
              setPlaylistToAdd((state) =>
                state.filter((item) => item.id !== playlist.id)
              );
            }
          }
          setSearchLists((state) => {
            let temp = [...state];
            let i = temp.findIndex((item) => item.id === playlist.id);
            temp[i].active = !temp[i].active;
            return temp;
          });
        }}
      />
      {(playlistToRemove.length > 0 || playlistsToAdd.length > 0) && (
        <div
          className="playlist-edit-save-button"
          onClick={() => {
            setSaveModalVisible(true);
          }}
        >
          <FaSave />
        </div>
      )}
      {searchLists.length > 0 && (
        <div className="extend-list-row">
          <div
            className="extend-list-button"
            onClick={() => {
              extendSearchList();
            }}
          >
            <BsPlusCircle />
          </div>
        </div>
      )}
    </div>
  );
};
export default AddPlayListScreen;
