import React, { useState, useEffect, useContext } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { MdArrowBack } from "react-icons/md";
import MusicQuizContext from "store/music-quiz-context";
import PlayListList from "./PlayListList";
import { SCREENS } from "Components/MusicQuizComponents/MusicQuizScreens";
import "../../style/MusicQuizScreens/ManagePlaylistScreen.css";
import LoadingIndicator from "Components/LoadingIndicator";
import SpotifyContext from "store/spotify-context";
import MusicQuizScreen from "./MusicQuizScreen";
import { TbMusicSearch } from "react-icons/tb";
import { MdYoutubeSearchedFor } from "react-icons/md";



const ManagePlaylistScreen = () => {
  const [searchLists, setSearchLists] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [lastSearchString, setLastSearchString] = useState("");

  const [searching, setSearching] = useState(false);
  const [extending, setExtending] = useState(false);

  const SEARCH_LIMIT = 20;

  const [nextSearchQuery, setNextSearchQuery] = useState(null);

  const [searchModeActive, setSearchModeActive] = useState(false);

  const mc = useContext(MusicQuizContext);
  const spotifyContext = useContext(SpotifyContext);


  const mapActivePlaylistToManagePlayObject = (playlist) => {
    return {
      id: playlist.id,
      image: playlist.image,
      active: true,
      name: playlist.name,
    };
  };

  const loadActivePlaylistsAsSearchList = () => {
    setSearchLists(mc.playlists.map(mapActivePlaylistToManagePlayObject));
  }

  useEffect(() => {
    loadActivePlaylistsAsSearchList();
        // eslint-disable-next-line
  }, []);

  const convertPlaylistResponseToObject = (playlistReponseItem) => {
    return {
      id: playlistReponseItem.id,
      image:
        playlistReponseItem.images[0] !== undefined
          ? playlistReponseItem.images[0].url
          : undefined,
      name: playlistReponseItem.name,
      active:
        mc.playlists.find((x) => x.id === playlistReponseItem.id) !== undefined,
    };
  };

  const fetchPlaylistFromSearch = async (extend = false) => {
    const encodedSearch = encodeURIComponent(searchString.trim());
    let query = nextSearchQuery;
    if (encodedSearch === lastSearchString && !extend) return;

    extend ? setExtending(true) : setSearching(true);

    if (query === null || encodedSearch !== lastSearchString) {
      query = `https://api.spotify.com/v1/search?q=${encodedSearch}&type=playlist&limit=${SEARCH_LIMIT}`;
    }

    const searchPlaylistsCallback = (response) => {
        if (response.playlists.next !== undefined) {
          setNextSearchQuery(response.playlists.next);
        }

        const newPlaylists = response.playlists.items
          .filter((i) => i !== null)
          .map(convertPlaylistResponseToObject);
        setSearchLists((state) =>
          extend ? [...state, ...newPlaylists] : newPlaylists
        );

        setLastSearchString(encodedSearch);
        setTimeout(() => {
          setSearching(false);
        }, 500);
        setExtending(false);
    }

    return spotifyContext.searchPlaylists(query, searchPlaylistsCallback);
  };



  const onSearch = () => {
    const trimmedSearch = searchString.trim();
    if (trimmedSearch === "") return;

    setSearchModeActive(true);
    fetchPlaylistFromSearch();
  };

  const onCancel = () => {
    setSearchString("");
    setLastSearchString("");    
    setSearchModeActive(false);
    setNextSearchQuery(null);
    loadActivePlaylistsAsSearchList();
  }

  const switchPlaylistActive = (playlistId, newState) => {
    setSearchLists((state) => {
      let temp = [...state];
      let idx = temp.findIndex((i) => i.id === playlistId);
      temp[idx].active = newState;
      return temp;
    });
  };

  const addPlaylist = (playlist) => {
    switchPlaylistActive(playlist.id, true);
    mc.setPlaylists((state) => [...state, playlist]);
  };

  const deletePlaylist = (playlist) => {
    switchPlaylistActive(playlist.id, false);
    mc.setPlaylists((state) => state.filter((p) => p.id !== playlist.id));
  };

  const ExtendSearchRow = (props) => {
    return (
      <div className="extend-list-row">
        <div
          className="extend-list-button"
          onClick={() => {
            if (!extending) {
              fetchPlaylistFromSearch(true);
            }
          }}
        >
          {extending ? <LoadingIndicator
                style={{ size: "3vw", thickness: "0.2vw" }}
                mobileStyle={{ size: "7vw", thickness: "0.4vw" }}
                colors={{
                  mainColor: "rgb(30, 215, 96)",
                  secondaryColor: "rgba(30, 215, 96, 0.1)",
                }}
            /> : <BsPlusCircle />}
        </div>
      </div>
    );
  };

  const ReturnButton = () => {
    return <div className="return_button" onClick={() => mc.navigateTo(SCREENS.PLAYLISTS)}>
      <MdArrowBack />
    </div>
  }

  const ClearSearchButton = (props) => {
return <div className="return_button" onClick={() => onCancel()}>
  {props.clearable && <MdYoutubeSearchedFor />}
</div>
  };

  return (
    <MusicQuizScreen title="Manage your playlists" iconTopLeft={<ReturnButton />} iconTopRight={<ClearSearchButton clearable={searchString !== ""} />}>
    <div className="playlist_search_screen">


      <Searchbar
        searchString={searchString}
        setSearchString={setSearchString}
        onSearch={onSearch}
        onCancel={onCancel}
      />

      {!searching && (
        <>
          <PlayListList
            editable={true}
            playlists={searchLists}
            onClick={(playlist) => {
              if (!playlist.active) {
                addPlaylist(playlist);
              } else {
                deletePlaylist(playlist);
              }
            }}
          />
          {searchLists.length > 0 && searchModeActive && <ExtendSearchRow />}
        </>
      )}
      {searching && (
        <div className="playlist_search_indicator_outer">
          <LoadingIndicator
                style={{ size: "4vw", thickness: "0.2vw" }}
                mobileStyle={{ size: "20vw", thickness: "1vw" }}
                colors={{
                  mainColor: "rgb(30, 215, 96)",
                  secondaryColor: "rgba(30, 215, 96, 0.1)",
                }}
            />
        </div>
      )}

      {}
    </div>
    </MusicQuizScreen>
  );
};

const Searchbar = (props) => {
  return (
    <div className="playlist-searchbar">
      <div className="playlist-search-row">
        <div className="playlist-search-field">
          <input
            placeholder="Search for a playlist..."
            className="playlist-search-input"
            value={props.searchString}
            onChange={(e) => props.setSearchString(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                props.onSearch();
              }
            }}
          ></input>
        </div>

        <div
          className="playlist-search-icon-outer"
          onClick={() => {
            props.onSearch();
          }}
        >
          <TbMusicSearch />
        </div>
      </div>
    </div>
  );
};

export default ManagePlaylistScreen;
