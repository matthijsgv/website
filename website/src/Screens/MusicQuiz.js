import { useEffect, useRef, useState } from "react";
import "../style/MusicQuiz.css";

import { FaSpotify, FaPlay, FaPause, FaRegUser } from "react-icons/fa";
import SpotifyWebApi from "spotify-web-api-js";
import Modal from "../UI/Modal";
import {useSearchParams} from "react-router-dom";

const playlistIds = [
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

const MusicQuiz = () => {
  const REDIRECT_URI = "https://matthijsqrcodetattoo.nl/music_quiz";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "code";
  const SCOPES =
    "user-modify-playback-state streaming user-read-email user-read-private user-read-playback-state app-remote-control user-library-modify user-library-read";
  const TOKEN_STORAGE_NAME = "spotify_token";
  const GAME_STORAGE_NAME = "music_quiz_current_game";
  const [token, setToken] = useState(null);
  const [playlists, setPlayLists] = useState(null);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);
  const [playedSongs, setPlayedSongs] = useState([]);
  const spotifyApi = new SpotifyWebApi();
  const [songPlaying, setSongPlaying] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [players, setPlayers] = useState([]);

  const [currentScreen, setCurrentScreen] = useState("playerScreen");

  const [currentQuizMaster, setCurrentQuizMaster] = useState(0);
  const [expireTime, setExpireTime] = useState(null);
  const [expireModalVisible, setExpireModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [player, setPlayer] = useState(undefined);
  const [currentSong, setCurrentSong] = useState();
  const [deviceId, setDeviceId] = useState(null);
  const [firstPlayTriggered, setFirstPlayTriggered] = useState(false);



  const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

const [is_paused, setPaused] = useState(false);
const [is_active, setActive] = useState(false);
const [current_track, setTrack] = useState(track);

const test = async () => {
  await connectToDevice();
  // await play("spotify:track:4u7EnebtmKWzUH433cf5Qv");
}

useEffect(() => {
  console.log(token)
},[token])
useEffect(() => {
  if (deviceId !== null) {
    console.log("Porque")
    console.log("Player", deviceId)
    test();
  }
},[deviceId])
  const ErrorModal = () => {
    return (
      <Modal
        closeModal={() => {
          setErrorModalVisible(false);
        }}
      >
        <div className="error-modal">
          <div className="error-modal-title">An error has occured</div>
          Most of the time the error is fixed by opening the Spotify app on your
          device, play and pause the current song and clearing your queue.
        </div>
      </Modal>
    );
  };

  const saveTracks = () => {
    // const ids = [track];
  
    return fetch(`https://api.spotify.com/v1/me/tracks?ids=4u7EnebtmKWzUH433cf5Qv`, {
      // body: JSON.stringify({ ids }),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'PUT',
    });
  }

  const connectToDevice = async () => {
    return fetch("https://api.spotify.com/v1/me/player", {
      body: JSON.stringify({
        device_ids: [deviceId],
        play: false
      }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "PUT"
    }).then((res) => console.log("Connected", res))
  }

  const play = async (trackId) => {
    return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      body: JSON.stringify( {
       uris: [`spotify:track:${trackId}`],
       offset: {
        position: 0
       }
      }),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });
  }

  const nextTrack = async () => {
     return fetch(`https://api.spotify.com/v1/me/player/next`,{
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
      ).then((res) => console.log("Test", res))
  }

  const queueTrack =  (track) => {
     fetch(`https://api.spotify.com/v1/me/player/queue?uri=${track}&device_id=${deviceId}`,{
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  }
    ).then((res) => console.log("Queue", res))
  }



  useEffect(() => {
    if (token !== null) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
  
      document.body.appendChild(script);
  
      window.onSpotifyWebPlaybackSDKReady = () => {
  
          const player = new window.Spotify.Player({
              name: "Matthijs' Music Quiz",
              getOAuthToken: cb => { cb(token); },
              volume: 0.5
          });
  
          setPlayer(player);
  
          player.addListener('ready', ({ device_id }) => {
              console.log('Ready with Device ID', device_id);
              setDeviceId(device_id);
          });
  
          player.addListener('not_ready', ({ device_id }) => {
              console.log('Device ID has gone offline', device_id);
          });
          
          player.addListener('player_state_changed', ( state => {

            if (!state) {
                return;
            }
            
            setTrack(state.track_window.current_track);
            setPaused(state.paused);
        
        
            player.getCurrentState().then( state => { 
                (!state)? setActive(false) : setActive(true) 
            });
        
        }));
  
  
          player.connect();
          console.log(player)
      };
    }
  },[token])

  useEffect(() => {
      let code = searchParams.get("code");
      setSearchParams({})
      if (code) {
        fetch("https://accounts.spotify.com/api/token",
          {
            body: `code=${code}&redirect_uri=${REDIRECT_URI}&grant_type=authorization_code`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": "Basic " + (new Buffer(process.env.REACT_APP_CLIENT_ID + ':' + process.env.REACT_APP_CLIENT_SECRET).toString('base64'))
            },
          method: "POST"
          }
        ).then((result) => result.json())
        .then((response) => {
          setToken(response.access_token)
        })
      }
  },[])

  useEffect(() => {
    console.log(localStorage.getItem(GAME_STORAGE_NAME));
    if (localStorage.getItem(GAME_STORAGE_NAME) !== null) {
      setCurrentScreen("gameChoice");
    }
  }, []);

  // useEffect(() => {
  //   if (token !== null) return;

  //   let temp = localStorage.getItem(TOKEN_STORAGE_NAME);

  //   if (temp !== null) {
  //     let temp2 = JSON.parse(temp);
  //     if (temp2.expires > new Date().getTime()) {
  //       expireTimeout.current = setTimeout(() => {
  //         setToken("");
  //         localStorage.removeItem(TOKEN_STORAGE_NAME);
  //       }, temp2.expires - new Date().getTime());
  //       setToken(temp2.token);
  //       setExpireTime(temp2.expires);
  //       return;
  //     }
  //   }

  //   const hash = window.location.hash;
  //   if (hash) {
  //     let temp_token = hash
  //       .substring(1)
  //       .split("&")
  //       .find((elem) => elem.startsWith("access_token"))
  //       .split("=")[1];

  //     window.location.hash = "";
  //     localStorage.setItem(
  //       TOKEN_STORAGE_NAME,
  //       JSON.stringify({
  //         token: temp_token,
  //         expires: new Date().getTime() + 1000 * 60 * 59,
  //       })
  //     );

  //     setExpireTime(new Date().getTime() + 1000 * 60 * 59);


  //     expireTimeout.current = setTimeout(() => {
  //       setToken("");
  //       localStorage.removeItem(TOKEN_STORAGE_NAME);
  //     }, 1000 * 60 * 59);

  //     setToken(temp_token);
  //   } else {
  //     setToken("");
  //     localStorage.removeItem(TOKEN_STORAGE_NAME);
  //   }
  // }, [token]);

  useEffect(() => {
    if (playlists === null) {
      setPlaylistsLoading(true);
    } else {
      setPlaylistsLoading(false);
    }
  }, [playlists]);

  useEffect(() => {
    console.log(expireTime);
  }, [expireTime])

  useEffect(() => {
    const readSinglePlaylist = async (id) => {
      spotifyApi.setAccessToken(token);
      let playlist = {};
      let playlistInfo = await spotifyApi.getPlaylist(id);
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
            console.log("Error Godverdekanker", e);
            stop = true;
          });
        helper += 1;
      }

      playlist["tracks"] = results;
      return playlist;
    };

    const getAllPlaylists = async (playlistIds) => {
      const playlistList = [];
      const startTime = new Date().getTime();

      // for (const id of playlistIds) {
      //   playlistList.push(await readSinglePlaylist(id));
      // }

      await Promise.all(
        playlistIds.map(async (id) => {
          const temp = await readSinglePlaylist(id);
          playlistList.push(temp);
        })
      );

      const endTime = new Date().getTime();
      console.log("duration:", endTime - startTime);

      setPlayLists(playlistList);
    };

    if (token !== null && token.length > 0) {
      getAllPlaylists(playlistIds);
    }
    // eslint-disable-next-line
  }, [token]);

  const pickRandomFromPlaylist = async (playlist) => {
    let currentPlaylist = playlist.tracks.filter(
      (item) => !playedSongs.includes(item.track.id)
    );

    if (currentPlaylist.length === 0) console.log("rip");
    else {
      let currentSong =
        currentPlaylist[Math.floor(Math.random() * currentPlaylist.length)];
      let currentSongId = currentSong.track.id;
      spotifyApi.setAccessToken(token);
      setCurrentSong(currentSongId);
      setSongPlaying(currentSong);
      // setCurrentScreen("song");
      // await spotifyApi
      //   .queue(`spotify:track:${currentSongId}`)
      //   .then(() => {
      //     setSongPlaying(currentSong);
          // setPlayedSongs((state) => [...state, currentSongId]);
          // let temp = JSON.parse(
          //   localStorage.getItem(GAME_STORAGE_NAME)
          // );
          // if (temp === null) return;

          // temp.playedSongs.push(currentSongId);
          // localStorage.setItem(GAME_STORAGE_NAME, JSON.stringify(temp));
      //   })
      //   .catch((e) => {
      //     setErrorModalVisible(true);
      //   });
    }
  };


  const Playlist = (props) => {
    return (
      <div
        className="playlist-outer"
        onClick={() => {

          pickRandomFromPlaylist(props.playlist);

          // if (expireTime - new Date().getTime() < 120000 ){
          //   setExpireModalVisible(true);
          //   return;
          // }
          
          setCurrentScreen("song");
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
    const [songRevealed, setSongRevealed] = useState(false);


    const onPressPlay = async () => {
      if (!firstPlayTriggered) {
        console.log("test")
        setFirstPlayTriggered(true);
        await play(currentSong);
        setPlayedSongs((state) => [...state, currentSong]);
        let temp = JSON.parse(
          localStorage.getItem(GAME_STORAGE_NAME)
        );
        if (temp === null) return;

        temp.playedSongs.push(currentSong);
        localStorage.setItem(GAME_STORAGE_NAME, JSON.stringify(temp));

        return;
      }
      
      player.togglePlay();
      
    }

    return (
      <div className="song-player">
        {songRevealed && (
          <div className="song-reveal-solution">
            {songPlaying.track.name}
            <br />
            - <br />
            {songPlaying.track.artists[0].name}
          </div>
        )}
        {!songRevealed && (
          <div className="wave-outer">
            Guess the song title {"&"} artist
            <div id="wave" className="wave-inner">
              <div
                className={!is_paused ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={!is_paused ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={!is_paused ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={!is_paused ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={!is_paused ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={!is_paused ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={!is_paused ? "wave-item playing" : "wave-item"}
              ></div>
              <div
                className={!is_paused ? "wave-item playing" : "wave-item"}
              ></div>
            </div>
          </div>
        )}

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
              onPressPlay();
            }}
          >
            {!is_paused ? <FaPause /> : <FaPlay />}
          </div>
          {songRevealed && (
            <div
              className="next-button"
              onClick={() => {
                spotifyApi.pause();
                setCurrentScreen("score");
                setFirstPlayTriggered(false);
              }}
            >
              To Scores
            </div>
          )}
        </div>
      </div>
    );
  };

  const PlayerScreen = () => {
    const [names, setNames] = useState([""]);

    console.log("rerender");

    return (
      <div className="player-screen">
        <div className="player-selection">
          <div className="player-screen-title">Name the players </div>

          {names.map((name, idx) => {
            return (
              <div className="player">
                <div className="player-icon">
                  <FaRegUser />
                </div>
                <input
                  className="player-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setNames((state) => {
                      let temp = [...state];
                      temp[idx] = e.target.value;
                      return temp;
                    });
                  }}
                />
              </div>
            );
          })}
          <div
            className="add-player-button"
            onClick={() => {
              setNames((state) => [...state, ""]);
            }}
          >
            + Add Player
          </div>
        </div>
        <div className="save-and-continue-outer">
          <div
            className="save-and-continue-inner"
            onClick={() => {
              const tempPlayers = names.map((name) => {
                return {
                  name: name,
                  points: 0,
                };
              });
              setPlayers(tempPlayers);
              localStorage.setItem(
                GAME_STORAGE_NAME,
                JSON.stringify({
                  players: tempPlayers,
                  playedSongs: [],
                  quizMaster: currentQuizMaster,
                })
              );
              setCurrentScreen("quizmaster");
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
        <div className="score-screen-inner">
          <div className="score-screen-title">Player scores</div>
          {players.map((player, idx) => {
            return (
              <div key={Math.random().toString()} className="player-score">
                <div className="player-score-name">{player.name}</div>{" "}
                <div className="player-score-points">{player.points}</div>
                <div className="player-points-buttons">
                  <div
                    className={
                      points.one_point.includes(idx)
                        ? "player-points-button chosen"
                        : points.one_point.length >= 2 ||
                          points.two_points.length > 0
                        ? "player-points-button disabled"
                        : "player-points-button"
                    }
                    onClick={() => {
                      if (points.two_points.length > 0) return;
                      if (points.one_point.includes(idx)) {
                        setPoints((state) => {
                          let temp = { ...state };
                          temp.one_point = temp.one_point.filter(
                            (x) => x !== idx
                          );
                          return temp;
                        });

                        setTemp((state) => {
                          let temp = [...state];
                          temp[idx].points -= 1;
                          return temp;
                        });

                        return;
                      }

                      if (points.one_point.length >= 2) return;

                      setPoints((state) => {
                        let temp = { ...state };
                        temp.one_point.push(idx);
                        return temp;
                      });

                      setTemp((state) => {
                        let temp = [...state];
                        temp[idx].points += 1;
                        return temp;
                      });
                    }}
                  >
                    +1
                  </div>
                  <div
                    className={
                      points.two_points.includes(idx)
                        ? "player-points-button chosen"
                        : points.one_point.length > 0 ||
                          points.two_points.length > 0
                        ? "player-points-button disabled"
                        : "player-points-button"
                    }
                    onClick={() => {
                      if (points.one_point.length > 0) return;
                      if (points.two_points.length > 0) {
                        if (points.two_points[0] !== idx) return;
                        setPoints((state) => {
                          let temp = { ...state };
                          temp.two_points = [];
                          return temp;
                        });

                        setTemp((state) => {
                          let temp = [...state];
                          temp[idx].points -= 2;
                          return temp;
                        });
                        return;
                      }

                      setPoints((state) => {
                        let temp = { ...state };
                        temp.two_points.push(idx);
                        return temp;
                      });

                      setTemp((state) => {
                        let temp = [...state];
                        temp[idx].points += 2;
                        return temp;
                      });
                    }}
                  >
                    +2
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="save-and-continue-outer">
          <div
            className="save-and-continue-inner"
            onClick={() => {
              setPlayers(temp);
              let tempStored = JSON.parse(
                localStorage.getItem(GAME_STORAGE_NAME)
              );

              let tempQuizMaster =
                currentQuizMaster === players.length - 1
                  ? 0
                  : currentQuizMaster + 1;

              setCurrentQuizMaster(tempQuizMaster);
              setCurrentScreen("quizmaster");

              if (tempStored === null) return;

              tempStored.players = temp;
              tempStored.quizMaster = tempQuizMaster;
              localStorage.setItem(
                GAME_STORAGE_NAME,
                JSON.stringify(tempStored)
              );
            }}
          >
            Next round
          </div>
        </div>
      </div>
    );
  };

  const QuizMasterScreen = () => {
    return (
      <div className="quiz-master-screen">
        <div className="quiz-master-screen-inner">
          The quizmaster this round is
          <div className="quiz-master-screen-name">
            {players[currentQuizMaster].name}
          </div>
          <div className="quiz-master-screen-smaller-text">
            They can choose the next playlist!
          </div>
        </div>
        <div className="save-and-continue-outer">
          <div
            className="save-and-continue-inner"
            onClick={() => {
              setCurrentScreen("playlists");
            }}
          >
            Choose playlist
          </div>
        </div>
      </div>
    );
  };

  const GameChoice = () => {
    return (
      <div className="game-choice-screen">
        Do you want to start a
        <div
          className="game-choice-button"
          onClick={() => {
            setCurrentScreen("playerScreen");
          }}
        >
          New Game
        </div>
        or continue with your
        <div
          className="game-choice-button"
          onClick={() => {
            setCurrentScreen("gameOverview");
          }}
        >
          Previous Game
        </div>
      </div>
    );
  };

  const ExpireModal = () => {
    const [timeLeft, setTimeLeft] = useState(Math.floor((expireTime - (new Date()).getTime()) / 1000)); 

    useEffect(() => {
      setInterval(() => {
        setTimeLeft(state => state - 1);
      }, 1000);
    }, []);


    return <Modal closeModal={() => {
      setExpireModalVisible(false);
    }}>
      <div className="expire-modal">
        {timeLeft > 0 && <div className="expire-modal-title">
          Login about to expire
        </div>}
        {timeLeft <= 0 && <div className="expire-modal-title">
          Login is expired
        </div>}
        {timeLeft > 0 && <div>Your current login is expiring in {timeLeft} seconds. Please log in to spotify again so you can play for another hour.</div>}
        {timeLeft <= 0 && <div>Please log in to spotify again so you can play for another hour.</div>}
        <div className="expire-modal-buttons">
        {timeLeft > 0 && <div className="expire-modal-button" onClick={() =>{
          setCurrentScreen("song");
          setExpireModalVisible(false);
        }}>
          Ignore
        </div>}
        <div className="expire-modal-button relogin" onClick={() => {
          setToken("");
          localStorage.removeItem(TOKEN_STORAGE_NAME);
          setExpireModalVisible(false);
        }}>
           Re-login
        </div>

      </div>
      
      </div>

    </Modal>
  }

  const PreviousGameOverview = () => {
    const prevGame = JSON.parse(
      localStorage.getItem(GAME_STORAGE_NAME)
    );

    console.log(prevGame);
    return (
      <div className="score-screen">
        <div className="score-screen-inner">
          <div className="score-screen-title">Game Overview</div>
          {prevGame.players.map((player, idx) => {
            return (
              <div className="overview-player">
                {idx === prevGame.quizMaster && (
                  <div className="quiz-master-indication">Quiz Master</div>
                )}
                <div className="overview-player-name">{player.name}</div>
                <div className="overview-player-score">{player.points}</div>
              </div>
            );
          })}
        </div>
        <div className="save-and-continue-outer">
          <div
            className="save-and-continue-inner"
            onClick={() => {
              setCurrentQuizMaster(prevGame.quizMaster);
              setPlayers(prevGame.players);
              setPlayedSongs(prevGame.playedSongs);
              setCurrentScreen("quizmaster");
            }}
          >
            Continue Game
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {errorModalVisible && <ErrorModal />}
      {expireModalVisible && <ExpireModal />}
      <div className="music-quiz">
        {token === null && (
          <div
            className="spotify-login-button"
            onClick={() => {
              setToken(null);
              let state = (Math.random() + 1).toString(36).substring(16)
              window.open(
                `${AUTH_ENDPOINT}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}&state=${state}`
              );
            }}
          >
            <FaSpotify /> Login to Spotify
          </div>
        )}
        {token !== null && token.length > 0 && (
          <div>
            {playlistsLoading && (
              <div className="playlist-loading-indicator"></div>
            )}
            {!playlistsLoading && (
              <div>
                
                {currentScreen === "gameChoice" && <GameChoice />}
                {currentScreen === "playerScreen" && <PlayerScreen />}
                {currentScreen === "gameOverview" && <PreviousGameOverview />}
                {currentScreen === "playlists" && (
                  <div className="playlist-list">
                    {playlists.map((playlist) => (
                      <Playlist
                        key={Math.random().toString()}
                        playlist={playlist}
                      />
                    ))}
                  </div>
                )}
                {currentScreen === "song" && <SongPlayer />}
                {currentScreen === "score" && <ScoreScreen />}
                {currentScreen === "quizmaster" && <QuizMasterScreen />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicQuiz;
