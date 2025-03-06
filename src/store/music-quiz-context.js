import React from 'react';
import  { useState, useEffect } from "react";

const MusicQuizContext = React.createContext({
  token: "",
  setToken: (t) => {},
  playlists: [],
  setPlaylists: (p) => {},
  loadPlaylist: (p) => {},
  pickSong: (p) => {},
  currentScreen: "",
  setCurrentScreen: (s) => {},
  player: {},
  deviceId: "",
  currentSong: {},
  current_track: {},
  is_paused: false,
  loading: false,
  GAME_STORAGE_NAME: "",
  players: [],
  setPlayers: (p) => {},
  currentQuizMaster: 0,
  setCurrentQuizMaster: (q) => {},
  playedSongs: [],
  setPlayedSongs: (s) => {},
  loadPlaylistsInfo: (p) => {},
});

export const MusicQuizProvider = (props) => {
  const [token, setToken] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("playerScreen");
  const [players, setPlayers] = useState([]);
  const [playlists, setPlayLists] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playedSongs, setPlayedSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [is_paused, setPaused] = useState(false);
  // eslint-disable-next-line
  const [is_active, setActive] = useState(false);
  const [current_track, setTrack] = useState({});
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [currentQuizMaster, setCurrentQuizMaster] = useState(0);

  const GAME_STORAGE_NAME = "music_quiz_current_game";

  useEffect(() => {
    if (token === null) {
      setCurrentScreen("gameChoice");
      setPlayer(null);
      setDeviceId(null);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Matthijs' Music Quiz",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 1,
      });

      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        setTrack(state.track_window.current_track);
        setPaused(state.paused);

        player.getCurrentState().then((state) => {
          !state ? setActive(false) : setActive(true);
        });
      });

      player.connect();
      setPlayer(player);
    };
  }, [token]);

  useEffect(() => {
    if (deviceId !== null) {
      connectToDevice();
    }
    // eslint-disable-next-line
  }, [deviceId]);

  const connectToDevice = async () => {
    return fetch("https://api.spotify.com/v1/me/player", {
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
    });
  };

  const playlistsIds = [
    "37i9dQZF1DWXRqgorJj26U", //rock classics
    "37i9dQZF1DWTJ7xPn4vNaz", //70s
    "37i9dQZF1DWWGFQLoP9qlv", //legendary
    "37i9dQZF1DWWiDhnQ2IIru", //70s roadtrip
    "37i9dQZF1DWTmvXBN4DgpA", //top2000
    "2JjsUmf4HpcIMMSvos1wa3", //meine musik
    "37i9dQZF1DX4UtSsGT1Sbe", //80s
    "37i9dQZF1DX4o1oenSJRJd", //2000s
    "37i9dQZF1DXbTxeAdrVG2l", //90s
    "37i9dQZF1DX5Ejj0EkURtP", //2010s
    // "37i9dQZF1DX04mASjTsvf0", //rnb
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
    let playlist = {};
    await fetch(
      `https://api.spotify.com/v1/playlists/${id}?fields=name,images`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((res) => {
        playlist = {
          id: id,
          name: res.name,
          image: res.images[0] !== undefined ? res.images[0].url : null,
          loaded: false,
          tracks: [],
        };
      })
      .catch((e) => {
        console.error("ERROR OCCURED", e);
        playlist = null;
      })

    return playlist;
  };

  const getAllPlaylistTracks = async (id) => {
    setLoading(true);
    let tracks = [];
    let next = `https://api.spotify.com/v1/playlists/${id}/tracks`;
    const fetchTracks = async (link) => {
      await fetch(link, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      })
        .then((res) => res.json())
        .then((response) => {
          tracks = tracks.concat(response.items.map((item) => item.track.id));
          next = response.next;
        })
        .catch((e) => setToken(null));
    };

    while (next !== null) {
      await fetchTracks(next);
    }

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
    setCurrentScreen("song");
    setLoading(false);
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
        setCurrentScreen: setCurrentScreen,
        player: player,
        deviceId: deviceId,
        currentSong: currentSong,
        current_track: current_track,
        is_paused: is_paused,
        loading: loading,
        GAME_STORAGE_NAME: GAME_STORAGE_NAME,
        players: players,
        setPlayers: setPlayers,
        currentQuizMaster: currentQuizMaster,
        setCurrentQuizMaster: setCurrentQuizMaster,
        playedSongs: playedSongs,
        setPlayedSongs: setPlayedSongs,
        loadPlaylistsInfo: loadPlaylistsInfo,
      }}
    >
      {props.children}
    </MusicQuizContext.Provider>
  );
};

export default MusicQuizContext;
