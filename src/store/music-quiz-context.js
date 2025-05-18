import { SCREENS } from "Components/MusicQuizComponents/MusicQuizScreens";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import SpotifyContext from "./spotify-context";

const MusicQuizContext = React.createContext({
  token: "",
  setToken: (t) => {},
  playlists: [],
  setPlaylists: (p) => {},
  loadPlaylist: (p) => {},
  pickSong: (p) => {},
  currentScreen: "",
  currentSong: {},
  loading: false,
  GAME_STORAGE_NAME: "",
  players: [],
  setPlayers: (p) => {},
  currentQuizMaster: 0,
  setCurrentQuizMaster: (q) => {},
  playedSongs: [],
  setPlayedSongs: (s) => {},
  loadPlaylistsInfo: (p) => {},
  navigateTo: (p) => {},
  currentPlaylist: {},
  setCurrentPlaylist: (p) => {},
});

export const MusicQuizProvider = (props) => {
  const [token, setToken] = useState(null);
  const [currentScreen, setCurrentScreen] = useState(SCREENS.PLAYER_SCREEN);
  const [players, setPlayers] = useState([]);
  const [playlists, setPlayLists] = useState(null);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playedSongs, setPlayedSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentQuizMaster, setCurrentQuizMaster] = useState(0);

  const GAME_STORAGE_NAME = "music_quiz_current_game";

  const spotifyContext = useContext(SpotifyContext);

  // useEffect(() => {
  //   if (spotifyContext.token === null) {
  //     return;
  //   }
  // }, [spotifyContext.token]);

  useEffect(() => {
    console.log("Current screen", currentScreen);
  },[currentScreen]);

  const playlistsIds = [
    "4cVibuAVfrfiwwZaHGpBzd", //rock classics
    "7e6gKFwEXMF6uDQzmD9YXn", //70s
    "0gqrnk12Q8OExuCeKyBRCq", //legendary
    "37i9dQZF1DWWiDhnQ2IIru", //70s roadtrip
    "37i9dQZF1DWTmvXBN4DgpA", //top2000
    // "2JjsUmf4HpcIMMSvos1wa3", //meine musik
    "0zFSvcgzpslkTia17jCgL7", //80s
    "21GcJ5Kh7lh2G5VdVq1zqZ", //2000s
    "4jxsupz77qca3c7ljBdx87", //90s
    "37i9dQZF1DX5Ejj0EkURtP", //2010s
    "5X9rtYxwwCOTpgQprZnZT4", //MTV HITS
    // "37i9dQZF1DX30w0JtSIv4j", //hiphop,
    "18T2KJQefXj2R0YAKQ6uGH", //best of nederpop
    "37i9dQZF1DWSqmBTGDYngZ", //shower songs
  ];

  useEffect(() => {
    if (playlists) {
      let temp = JSON.parse(localStorage.getItem(GAME_STORAGE_NAME));
      if (temp === null) return;

      temp.playlists = playlists.map((x) => x.id);
      localStorage.setItem(GAME_STORAGE_NAME, JSON.stringify(temp));
    }
  }, [playlists]);

  const loadPlaylistInfo = async (id) => {
    return new Promise((resolve) => {
      const callback = (res) => {
        if (res.error) {
          console.error("Spotify API Error", res.error);
          resolve(null);
          return;
        }
  
        const playlist = {
          id,
          name: res.name,
          image: res.images?.[0]?.url ?? null,
          loaded: false,
          tracks: [],
        };
  
        resolve(playlist);
      };
  
      spotifyContext.loadPlaylistInfo(id, callback);
    });
  };



  

  const getAllPlaylistTracks = async (id) => {
    setLoading(true);
    const tracks = await spotifyContext.getAllTracksFromPlaylist(id);
    console.log(tracks);
    return tracks;
  };

  const loadPlaylist = async (playlist) => {
    let obj = { ...playlist };

    obj.tracks = await getAllPlaylistTracks(obj.id);
    obj.loaded = true;

    setPlayLists((state) => {
      let temp = [...state];
      let idx = playlists.findIndex((i) => i.id === obj.id);
      temp[idx] = obj;
      return temp;
    });

    return obj;
  };

  const loadPlaylistsInfo = async (playlist_ids = playlistsIds) => {
    let tempPlaylists = [];


    await Promise.all(
      playlist_ids.map(async (id) => {
        const temp = await loadPlaylistInfo(id);
        if (temp !== null) tempPlaylists.push(temp);
      })
    );

    setPlayLists(tempPlaylists);
  };

  const pickSong = async (playlist) => {
    let tempTracks = [];
    if (playlist.loaded) {
      tempTracks = playlist.tracks.filter(
        (item) => !playedSongs.includes(item)
      );
    } else {
      let tempPlaylist = await loadPlaylist(playlist);
      tempTracks = tempPlaylist.tracks.filter(
        (item) => !playedSongs.includes(item)
      );
    }

    let pickedSong = tempTracks[Math.floor(Math.random() * tempTracks.length)];
    setCurrentSong(pickedSong);
    setPlayedSongs((state) => [...state, pickedSong]);
    navigateTo(SCREENS.SONG_PLAYER);
    setLoading(false);
  };

  const navigateTo = (nextPage) => {
    setCurrentScreen(nextPage);
  };

  return (
    <MusicQuizContext.Provider
      value={{
        token: token,
        setToken: setToken,
        playlists: playlists,
        setPlaylists: setPlayLists,
        loadPlaylist: loadPlaylist,
        pickSong: pickSong,
        currentScreen: currentScreen,
        currentSong: currentSong,
        loading: loading,
        GAME_STORAGE_NAME: GAME_STORAGE_NAME,
        players: players,
        setPlayers: setPlayers,
        currentQuizMaster: currentQuizMaster,
        setCurrentQuizMaster: setCurrentQuizMaster,
        playedSongs: playedSongs,
        setPlayedSongs: setPlayedSongs,
        loadPlaylistsInfo: loadPlaylistsInfo,
        navigateTo: navigateTo,
        currentPlaylist: currentPlaylist,
        setCurrentPlaylist: setCurrentPlaylist
      }}
    >
      {props.children}
    </MusicQuizContext.Provider>
  );
};

export default MusicQuizContext;
