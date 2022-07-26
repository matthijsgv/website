import { useEffect, useRef, useState } from "react";
import "../style/MusicQuiz.css";

import { FaSpotify, FaPlay, FaPause, FaRegUser, FaSave } from "react-icons/fa";
import SpotifyWebApi from "spotify-web-api-js";
import Modal from "../UI/Modal";

import { MdEdit, MdOutlineDeleteOutline } from "react-icons/md";

const playlistIds = [
  "37i9dQZF1DWXRqgorJj26U",
  "37i9dQZF1DWTJ7xPn4vNaz",
  "37i9dQZF1DWWGFQLoP9qlv",
  "37i9dQZF1DWWiDhnQ2IIru",
  "37i9dQZF1DWTmvXBN4DgpA",
];

const MusicQuiz = () => {
  const CLIENT_ID = "c4af7145099a4bed866f9c39f3ab7d0f";
  const REDIRECT_URI = "http://localhost:3000/music_quiz";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES =
    "user-modify-playback-state streaming user-read-email user-read-private";

  const [token, setToken] = useState("test");
  const [playlists, setPlayLists] = useState(null);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [playedSongs, setPlayedSongs] = useState([]);
  const spotifyApi = new SpotifyWebApi();
  const [currentScreen, setCurrentScreen] = useState("playerScreen");
  const [songPlaying, setSongPlaying] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [players, setPlayers] = useState([
    { name: "Player 1", points: 0 },
    { name: "Player 2", points: 0 },
  ]);

  const expireTimeout = useRef();

  const ErrorModal = () => {
    return (
      <Modal
        closeModal={() => {
          setErrorModalVisible(false);
        }}
      >
        <div className="error-modal">
          <div className="error-modal-title">An error has occured</div>
          Most of the time the error is fixed, by opening the spotify app on
          your device and clearing your queue.
        </div>
      </Modal>
    );
  };

  useEffect(() => {
    console.log("Token", token);
    if (token !== null) return;

    let temp = localStorage.getItem("spotify_token");

    if (temp !== null) {
      let temp2 = JSON.parse(temp);
      if (temp2.expires > new Date().getTime()) {
        expireTimeout.current = setTimeout(() => {
          setToken(null);
        }, temp2.expires - new Date().getTime());
        setToken(temp2.token);
        return;
      }
    }

    const hash = window.location.hash;
    if (hash) {
      let temp_token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      localStorage.setItem(
        "spotify_token",
        JSON.stringify({
          token: temp_token,
          expires: new Date().getTime() + 1000 * 60 * 59,
        })
      );

      expireTimeout.current = setTimeout(() => {
        setToken("");
      }, 1000 * 60 * 59);

      setToken(temp_token);
    } else {
      setToken("");
    }
  }, [token]);

  useEffect(() => {
    console.log("test");
    console.log(playlists);
    if (playlists === null) {
      console.log("true");
      setPlaylistsLoading(true);
    } else {
      setPlaylistsLoading(false);
    }
  }, [playlists]);

  useEffect(() => {
    const readSinglePlaylist = async (id) => {
      spotifyApi.setAccessToken(token);
      let playlist = {};

      let playlistInfo = await spotifyApi.getPlaylist(id);
      console.log(playlistInfo);
      playlist["name"] = playlistInfo.name;
      playlist["description"] = playlistInfo.description;
      playlist["image"] = playlistInfo.images[0].url;
      let results = [];
      // eslint-disable-next-line
      let stop = false;
      let helper = 0;
      // eslint-disable-next-line
      while (!stop && helper < 30) {
        await spotifyApi
          .getPlaylistTracks(id, {
            offset: helper * 100,
          })
          // eslint-disable-next-line
          .then((response) => {
            results = results.concat([...response.items]);
            if (response.next === null) {
              stop = true;
            }
          })
          // eslint-disable-next-line
          .catch((e) => {
            console.log(e);
            stop = true;
          });
        helper += 1;
      }

      playlist["tracks"] = results;
      return playlist;
    };

    const getAllPlaylists = async (playlistIds) => {
      const playlistList = [];

      for (const id of playlistIds) {
        playlistList.push(await readSinglePlaylist(id));
      }

      setPlayLists(playlistList);
    };

    if (token !== null && token.length > 0) {
      console.log("getting playlists");
      getAllPlaylists(playlistIds);
    }
    // eslint-disable-next-line
  }, [token]);

  const pickRandomFromPlaylist = async (playlist) => {
    console.log("played Songs:", playedSongs);

    let currentPlaylist = playlist.tracks.filter(
      (item) => !playedSongs.includes(item.track.id)
    );

    if (currentPlaylist.length === 0) console.log("rip");
    else {
      let currentSong =
        currentPlaylist[Math.floor(Math.random() * currentPlaylist.length)];
      let currentSongId = currentSong.track.id;
      console.log(currentSong);
      spotifyApi.setAccessToken(token);
      await spotifyApi
        .queue(`spotify:track:${currentSongId}`)
        .then(() => {
          setSongPlaying(currentSong);
          setCurrentScreen("song");
          setPlayedSongs((state) => [...state, currentSongId]);
        })
        .catch((e) => {
          setErrorModalVisible(true);
        });
    }
  };
  const Playlist = (props) => {
    return (
      <div
        className="playlist-outer"
        onClick={() => {
          pickRandomFromPlaylist(props.playlist);
        }}
      >
        <div className="playlist-image-outer">
          <img
            className="playlist-image"
            src={props.playlist.image}
            alt={props.playlist.name + "_cover"}
          />
        </div>
        <div className="playlist-title">{props.playlist.name}</div>
      </div>
    );
  };

  const SongPlayer = () => {
    const [playing, setPlaying] = useState(false);
    const [firstPlayTriggered, setFirstPlayTriggered] = useState(false);
    const [songRevealed, setSongRevealed] = useState(false);

    useEffect(() => {
      console.log("Playing", playing);
      if (!firstPlayTriggered) {
        if (playing) {
          setFirstPlayTriggered(true);
          spotifyApi.skipToNext();
        }
        return;
      }
      if (playing) {
        spotifyApi.play();
      }
      if (!playing) {
        spotifyApi.pause();
      }
      // eslint-disable-next-line
    }, [playing]);

    return (
      <div className="song-player">
        {songRevealed && (
          <div className="song-reveal-solution">
            {songPlaying.track.name}
            <br />
            By <br />
            {songPlaying.track.artists[0].name}
          </div>
        )}
        {!songRevealed && (
          <div className="wave-outer">
            Guess the song title {"&"} artist
            <div id="wave" className="wave-inner">
              <div
                className={playing ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={playing ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={playing ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={playing ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={playing ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={playing ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={playing ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={playing ? "wave-item playing" : "wave-item"}
              ></div>
            </div>
          </div>
        )}
        <div
          className="playlist-button"
          onClick={() => {
            setCurrentScreen("playlists");
          }}
        ></div>
        <div className="song-reveal">
          {songRevealed && (
            <img
              className="album-cover"
              src={songPlaying.track.album.images[0].url}
              alt="Album cover"
            />
          )}
          {!songRevealed && (
            <div
              className="song-reveal-button"
              onClick={() => {
                setSongRevealed(true);
              }}
            >
              Reveal Song
            </div>
          )}
        </div>
        <div className="play-pause-button-outer">
          <div
            className="play-pause-button"
            onClick={() => {
              setPlaying((state) => !state);
            }}
          >
            {playing ? <FaPause /> : <FaPlay />}
          </div>
          {songRevealed && <div className="next-button">To Scores</div>}
        </div>
      </div>
    );
  };

  const Player = (props) => {
    const [editMode, setEditMode] = useState(false);

    const [name, setName] = useState(props.player.name);

    return (
      <div className="player">
        <div className="player-icon">
          <FaRegUser />
        </div>{" "}
        {!editMode && <div>{props.player.name}</div>}
        {editMode && (
          <input
            className="player-name-input"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              props.setTemp((state) => {
                let temp = [...state];
                temp[props.idx].name = e.target.value;
                return temp;
              });
            }}
          />
        )}
        {!editMode && (
          <div className="player-edit-buttons">
            <div
              className="player-edit-button edit"
              onClick={() => {
                setEditMode(true);
              }}
            >
              <MdEdit />
            </div>
            <div
              className="player-edit-button delete"
              onClick={() => {
                if (players.length <= 2) return;

                setPlayers((state) => {
                  let temp = [...state];
                  temp.splice(props.idx, 1);
                  return temp;
                });
              }}
            >
              <MdOutlineDeleteOutline />
            </div>
          </div>
        )}
        {editMode && (
          <div className="player-edit-buttons">
            <div
              className="player-edit-button save"
              onClick={() => {
                setPlayers((state) => {
                  let temp = [...state];
                  temp[props.idx].name = name;
                  return temp;
                });
              }}
            >
              <FaSave />
            </div>
          </div>
        )}
      </div>
    );
  };

  const PlayerScreen = () => {
    const [temp, setTemp] = useState(players);

    return (
      <div className="player-screen">
        <div className="player-selection">
          <div className="player-screen-title">Name the players </div>

          {players.map((player, idx) => {
            return <Player setTemp={setTemp} player={player} idx={idx} />;
          })}
          <div
            className="add-player-button"
            onClick={() => {
              setPlayers((state) => {
                let temp = [...state];
                return [
                  ...temp,
                  {
                    name: "Player " + (state.length + 1).toString(),
                    points: 0,
                  },
                ];
              });
            }}
          >
            + Add Player
          </div>
        </div>
        <div className="save-and-continue-outer">
          <div
            className="save-and-continue-inner"
            onClick={() => {
              setPlayers(temp);
              setCurrentScreen("score");
            }}
          >
            Save and continue
          </div>
        </div>
      </div>
    );
  };

  const ScoreScreen = (props) => {

    const [temp, setTemp] = useState(players);

    const [points, setPoints] = useState({
      one_point: [],
      two_points: [],
    });


    return (
      <div className="score-screen">
        <div className="score-screen-title">Player scores</div>
        {players.map((player, idx) => {
          return (
            <div className="player-score">
              <div className="player-score-name">{player.name}</div>{" "}
              <div className="player-score-points">{player.points}</div>
              <div className="player-points-buttons">
                <div className={points.one_point.includes(idx) ? "player-points-button chosen": ((points.one_point.length >= 2 || points.two_points.length > 0) ? "player-points-button disabled": "player-points-button")} onClick={() => {
                  if (points.two_points.length > 0) return;
                  if (points.one_point.includes(idx) ){
                    setPoints(state => {
                      let temp = {...state};
                      temp.one_point = temp.one_point.filter(x => x !== idx);
                      return temp;
                    });
                    return;
                  }

                  if (points.one_point.length >= 2) return;

                  setPoints(state => {
                    let temp = {...state};
                    temp.one_point.push(idx);
                    return temp;
                  });
                }}>
                  +1
                </div>
                <div className={points.two_points.includes(idx) ? "player-points-button chosen" : ((points.one_point.length> 0 || points.two_points.length> 0 ) ? "player-points-button disabled" : "player-points-button")} onClick={() => {
                  if (points.one_point.length > 0) return;
                  if (points.two_points.length > 0) {
                      if (points.two_points[0] !== idx) return;
                        setPoints(state => {
                          let temp = {...state};
                          temp.two_points = [];
                          return temp;
                        });
                    return  
                  } 

                  setPoints(state => {
                    let temp = {...state};
                    temp.two_points.push(idx);
                    return temp;
                  })
                }}>
                  +2
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {errorModalVisible && <ErrorModal />}
      <div className="music-quiz">
        {token === "" && (
          <div
            className="spotify-login-button"
            onClick={() => {
              setToken(null);
              window.open(
                `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`
              );
            }}
          >
            <FaSpotify /> Login to Spotify
          </div>
        )}
        {token !== null && token.length > 0 && (
          <div>
            {!playlistsLoading && (
              <div className="playlist-loading-indicator"></div>
            )}
            {playlistsLoading && (
              <div>
                {currentScreen === "playerScreen" && <PlayerScreen />}
                {currentScreen === "playlists" && (
                  <div className="playlist-list">
                    {playlists.map((playlist) => (
                      <Playlist playlist={playlist} />
                    ))}
                  </div>
                )}
                {currentScreen === "song" && <SongPlayer />}
                {currentScreen === "score" && <ScoreScreen />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicQuiz;
