import React, { useEffect, useRef, useState } from "react";

const SpotifyContext = React.createContext({
  token: "",
  // setToken: (t) => {},
  loadTokenFromStorage: () => true || false,
  fetchToken: (code, redirectUri) => {},
  play: () => {},
  pause: () => {},
  togglePlay: () => {},
  playTrack: (trackId) => {},
  loadPlaylistInfo: (id, cb) => {},
  getAllTracksFromPlaylist: async (id, cb) => {},
  searchPlaylists: (query, cb) => {},
  playing: true,
});

export const SpotifyProvider = (props) => {
  const playerStateRef = useRef(null);
  const playerRef = useRef(null);
  const [authToken, setAuthToken] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [playing, setPlaying] = useState(false);
  const SPOTIFY_AUTH_TOKEN_STORAGE = "spotify_token";
  const SPOTIFY_REFRESH_TOKEN_STORAGE = "spotify_refresh_token";

  const startUpSpotifyPlayer = () => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);
    // @ts-ignore
    window.onSpotifyWebPlaybackSDKReady = () => {
      // @ts-ignore
      const player = new window.Spotify.Player({
        name: "Matthijs' QR Code Tattoo",
        getOAuthToken: async (cb) => {
          let tokenToUse = authToken;
          const test = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${authToken}` },
          });

          if (test.status === 401) {
            tokenToUse = await refreshToken();
          }

          cb(tokenToUse);
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


        playerStateRef.current = state;
        setPlaying(!state.paused);
      });

      player.connect();
      playerRef.current = player;
    };
  };


  useEffect(() => {
    if (!authToken || playerRef.current) {
      return;
    }
    startUpSpotifyPlayer();
        // eslint-disable-next-line
  }, [authToken]);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    console.log("DEVICED ID CHANGED", deviceId);
    if (deviceId !== null) {
      connectToDevice();
    }
    // eslint-disable-next-line
  }, [deviceId]);

  // AUTHENTICATION

  const loadTokenFromStorage = () => {
    let storedToken = false;
    const authTokenFromStrorage = getTokenFromStorage(
      SPOTIFY_AUTH_TOKEN_STORAGE
    );
    if (authTokenFromStrorage !== null && authTokenFromStrorage !== undefined) {
      setAuthToken(authTokenFromStrorage);
      storedToken = true;
    }
    return storedToken;
  };

  const updateAuthToken = (accesToken) => {
    setAuthToken(accesToken);
    storeToken(SPOTIFY_AUTH_TOKEN_STORAGE, accesToken);
  };

  const fetchAuthToken = async (code, redirectUri) => {
    const clientID = process.env.REACT_APP_CLIENT_ID;
    const clentSecret = process.env.REACT_APP_CLIENT_SECRET;

    const basicAuth = btoa(`${clientID}:${clentSecret}`);

    return fetch("https://accounts.spotify.com/api/token", {
      body: `code=${code}&redirect_uri=${redirectUri}&grant_type=authorization_code`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      method: "POST",
    })
      .then((result) => result.json())
      .then((response) => {
        updateAuthToken(response.access_token);
        storeToken(SPOTIFY_REFRESH_TOKEN_STORAGE, response.refresh_token);
      });
  };

  const refreshToken = async () => {
    const refreshToken = getTokenFromStorage(SPOTIFY_REFRESH_TOKEN_STORAGE);
    const clientID = process.env.REACT_APP_CLIENT_ID;
    const clentSecret = process.env.REACT_APP_CLIENT_SECRET;

    const basicAuth = btoa(`${clientID}:${clentSecret}`);
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    };
    return fetch("https://accounts.spotify.com/api/token", payload)
      .then((result) => result.json())
      .then((response) => {
        console.log("REFRESH", response);
        updateAuthToken(response.access_token);
        storeToken(SPOTIFY_AUTH_TOKEN_STORAGE, response.refresh_token);
        return response.access_token;
      });
  };

  const storeToken = (storage, token) => {
    if (token != null && token !== undefined) {
      localStorage.setItem(storage, token);
    }
  };

  const getTokenFromStorage = (storagePath) => {
    return localStorage.getItem(storagePath);
  };

  const spotifyApiCall = async (fetchFunction) => {
    let res = await fetchFunction(authToken);

    if (res && res.status && res.status === 401) {
      const newToken = await refreshToken();

      res = await fetchFunction(newToken);
    }

    if (res && res.status && res.status === 401) {
      setAuthToken(null);
      return 
    }

    return res;
  };

  // CONNECTION

  const connectToDevice = async () => {
    return fetch("https://api.spotify.com/v1/me/player", {
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false,
      }),
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
    }).then((response) => {});
  };

  const playFetch = async (trackId, token) => {
    return fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        body: JSON.stringify({
          uris: [`spotify:track:${trackId}`],
          offset: {
            position: 0,
          },
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "PUT",
      }
    );
  };

  const loadPlaylistInfo = (id, callback) =>
    spotifyApiCall((token) => fetchPlaylistInfo(id, callback, token));
  const fetchPlaylistInfo = async (id, cb, token) => {
    await fetch(
      `https://api.spotify.com/v1/playlists/${id}?fields=name,images`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((response) => cb(response))
      .catch((error) => cb({ error: error }));
  };

  const fetchPage = async (token, url, pageCallback) => {
    return fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        pageCallback(response);
        return response.next;
      })
      .catch((error) => {
        pageCallback({ error: error });
        return null;
      });
  };

  const spotifyPaginatedApiCall = async (initialUrl, cb) => {
    let next = initialUrl;
    while (next) {
          // eslint-disable-next-line
      next = await spotifyApiCall((token) => fetchPage(token, next, cb));
    }
  };

  // const getAllTracksFromPlaylist = (playlistId, pageCallback) => {
  //   let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  //   spotifyPaginatedApiCall(url, pageCallback);
  // };

  const getAllTracksFromPlaylist = async (playlistId) => {
    return new Promise((resolve, reject) => {
      const allTracks = [];
  
      const handlePage = (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          allTracks.push(...response.items);
        }
      };
  
      spotifyPaginatedApiCall(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        handlePage
      ).then(() => resolve(allTracks));
    });
  };

  const fetchSearch = (query, cb, token) => {
    return fetch(query, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
       cb(res);
      }).catch(error => cb({error:error}));
  }

  const searchPlaylists = (query, cb) => spotifyApiCall((token) => fetchSearch(query, cb, token));



  const playTrack = (trackid) =>
    spotifyApiCall((token) => playFetch(trackid, token));

  const play = () => {
    if (playerStateRef.current.paused) playerRef.current.togglePlay();
  };

  const pause = () => {
    if (!playerStateRef.current.paused) playerRef.current.togglePlay();
  };

  const togglePlay = () => {
    playerRef.current.togglePlay();
  };

  return (
    <SpotifyContext.Provider
      value={{
        token: authToken,
        loadTokenFromStorage: loadTokenFromStorage,
        fetchToken: fetchAuthToken,
        play: play,
        pause: pause,
        playing: playing,
        playTrack: playTrack,
        togglePlay: togglePlay,
        loadPlaylistInfo: loadPlaylistInfo,
        getAllTracksFromPlaylist: getAllTracksFromPlaylist,
        searchPlaylists: searchPlaylists,
      }}
    >
      {props.children}
    </SpotifyContext.Provider>
  );
};

export default SpotifyContext;
