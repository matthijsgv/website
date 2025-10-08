import React, { useContext, useState, useEffect } from "react";
import SpotifyContext from "./spotify-context";
import { sanitizeSongName } from "../util/sanizeSongName";
import { joinMultipleArtists } from "../util/joinMultipleArtists";
import { pickRandomFromArray } from "../util/pickRandomFromArray";
import {
  GamePhase,
  gamePhases,
} from "../Components/HitsterComponents/GamePhases";
import {
  GameOverview,
  HitsterContextType,
  HitsterGuess,
  HitsterGuessedValue,
  HitsterProviderProps,
  HitsterTrack,
  PlayerColors,
  Playlist,
  RoundResult,
  CreatePlayer,
  HitsterStorage,
  PlaylistMetadata,
} from "types/hitster-types";

import { SCREENS } from "../Components/HitsterComponents/HitsterScreens";
const HitsterContext = React.createContext<HitsterContextType | undefined>(
  undefined
);

export const HitsterProvider = (props: HitsterProviderProps) => {
  const HITSTER_GAME_OVERVIEW_STORAGE = "hitster_game_overview";
  const [gameKey, setGameKey] = useState(0);
  const spotifyContext = useContext(SpotifyContext);

  const [currentScreen, setCurrentScreen] = useState<string>(
    SCREENS.CREATE_GAME
  );

  const [gamePhase, setGamePhase] = useState<GamePhase>(gamePhases.PLAYING);

  const [hitsterGuesses, setHitsterGuesses] = useState<HitsterGuess[]>([]);
  const [lockedInGuess, setLockedInGuess] =
    useState<HitsterGuessedValue | null>(null);

  const [pendingRemoval, setPendingRemoval] = useState<string | null>(null);

  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);

  const playerColors: PlayerColors = {
    pink: "#ED80E9",
    red: "#FF0000",
    orange: "#fc7303",
    yellow: "#FFCE1B",
    green: "#008000",
    lightBlue: "#0099CC",
    blue: "#330099",
    purple: "#990099",
  };

  const [gameOverview, setGameOverview] = useState<GameOverview | null>(null);
  const colors = ["#70D6FF", "#FF70A6", "#FF9770", "#FFD670", "#E9FF70"];

  const [isButyingCard, setIsBuyingCard] = useState<boolean>(false);
  const initializePlaylist = (playlist: PlaylistMetadata): Playlist => {
    return {
      id: playlist.id,
      name: playlist.name,
      loaded: false,
      tracks: [],
    };
  };

  const playlistsIds = [
    {id: "4cVibuAVfrfiwwZaHGpBzd", name: "Rock classics"},
    {id:"29GKgpSS4EYpJkrf913PFt", name: "60s hits"},
    {id:"7e6gKFwEXMF6uDQzmD9YXn", name: "70s"},
    {id:"0gqrnk12Q8OExuCeKyBRCq", name: "Legendary"},
    {id:"1DTzz7Nh2rJBnyFbjsH1Mh", name: "Top 2000"},
    {id:"0zFSvcgzpslkTia17jCgL7", name: "80s"},
    {id:"15sZyUgStYmvzm3QfdVDIp", name: "2000s"},
    {id:"4jxsupz77qca3c7ljBdx87", name: "90s"},
    {id:"5XALIurWS8TuF6kk8bj438", name: "2010s"},
    {id:"2WQxrq5bmHMlVuzvtwwywV", name: "Hitster"}, 
    {id:"6QrVkClF1eJSjb9FDfqtJ8", name: "Hitster rock"},
    {id:"7epfU4cGVZ1xHWQbQJl7km", name: "Greatest songs of all time"} 

  ];

  const currentPlayer = () => {
    return gameOverview!.players[gameOverview!.currentPlayer];
  };

  const [playlists, setPlaylists] = useState<Playlist[]>(
    playlistsIds.map(initializePlaylist)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [playedTracks, setPlayedTracks] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState<HitsterTrack | null>(null);
  const [nextTrack, setNextTrack] = useState<HitsterTrack | null>(null);

  const [currentPendingHitster, setCurrentPendingHitster] =
    useState<HitsterGuessedValue | null>(null);

  useEffect(() => {
    const pickFirstSong = async () => {
      let next = await pickNextTrack();
      setNextTrack(next);
    };

    if (spotifyContext.token !== null) {
      pickFirstSong();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotifyContext.token]);

  useEffect(() => {
    if (gameOverview !== null && playedTracks.length > 0) {
      const toStore: HitsterStorage = {
        playedTracks: playedTracks,
        gameOverview: gameOverview,
      };
      localStorage.setItem(
        HITSTER_GAME_OVERVIEW_STORAGE,
        JSON.stringify(toStore)
      );
    }
  }, [playedTracks, gameOverview]);

  useEffect(() => {
    const storedGame = loadFromStorage();
    if (storedGame) {
      setCurrentScreen(SCREENS.CHOOSE);
    }
  }, []);

  const continuePreviousGame = () => {
    const storedGame = loadFromStorage();
    setPlayedTracks(storedGame!.playedTracks);
    setGameOverview(storedGame!.gameOverview);
    setCurrentScreen(SCREENS.PLAY_SCREEN);
  };

  const createNewGame = () => {
    setCurrentScreen(SCREENS.CREATE_GAME);
  };

  const loadFromStorage = (): HitsterStorage | null => {
    const fromStorage = localStorage.getItem(HITSTER_GAME_OVERVIEW_STORAGE);
    if (!fromStorage) {
      return null;
    }
    return JSON.parse(fromStorage);
  };

  const pickRandomPlaylist = () => {
    const randomPlaylist = pickRandomFromArray(playlists);
    console.log(randomPlaylist);
    return {
      idx: playlists.findIndex((pl) => pl.id === randomPlaylist.id),
      playlist: randomPlaylist,
    };
  };

  const loadAllTracksOfPlaylist = async (idx: number, id: string) => {
    setLoading(true);
    const tracks: any[] = await spotifyContext.getAllTracksFromPlaylist(id);
    let tracksConverted = tracks.map((item) => {
      let track = item.track;
      return {
        name: sanitizeSongName(track.name),
        id: track.id,
        artists: joinMultipleArtists(track.artists),
      };
    });
    setPlaylists((state) => {
      let temp = [...state];
      temp[idx].tracks = tracksConverted;
      temp[idx].loaded = true;
      return temp;
    });

    return tracksConverted;
  };

  const pickNextTrack = async () => {
    const nextPlaylist = pickRandomPlaylist();
    let tracks = [];
    let nextTrack = null;
    if (nextPlaylist.playlist.loaded) {
      tracks = nextPlaylist.playlist.tracks;
    } else {
      tracks = await loadAllTracksOfPlaylist(
        nextPlaylist.idx,
        nextPlaylist.playlist.id
      );
    }
    while (!nextTrack || playedTracks.includes(nextTrack.id)) {
      nextTrack = pickRandomTrack(tracks);
    }
    const releaseYear = new Promise((resolve) => {
      spotifyContext.getTracksByTracknameAndArtist(
        nextTrack.name,
        nextTrack.artists,
        (res: any) => {
          if (res?.tracks?.items?.length) {
            const releaseDates = res.tracks.items
              .map((item: any) => item.album.release_date)
              .filter(Boolean)
              .map((date: string) => date.slice(0, 4)); // Extract year only
            const earliest = releaseDates.reduce(
              (min: number, year: number) => (!min || year < min ? year : min),
              null
            );
            resolve(earliest);
          } else {
            resolve(null);
          }
        }
      );
    });

    // Add the year to the track object
    nextTrack.releaseYear = await releaseYear;
    nextTrack.color = pickRandomFromArray(colors);
    setLoading(false);
    return nextTrack;
  };

  const pickRandomTrack = (tracks: any[]) => {
    return pickRandomFromArray(tracks);
  };

  const setNextTrackToCurrentTrack = async () => {
    let next = nextTrack;
    if (next === null) {
      next = await pickNextTrack();
    }
    setCurrentTrack(nextTrack);

    next = await pickNextTrack();
    setPlayedTracks((prev) => [...prev, next!.id]);
    setNextTrack(next);
  };

  const assignPlayerToGuess = (player: string) => {
    if (currentPendingHitster === null) return;
    let curPlayer = gameOverview!.players.find((item) => item.name === player);
    if (!curPlayer) return;
    setHitsterGuesses((prev) => [
      ...prev,
      {
        player: player,
        color: curPlayer.color,
        guess: currentPendingHitster,
      },
    ]);
    setCurrentPendingHitster(null);
    setGamePhase(gamePhases.LOCKED_IN);
  };

  const removeHitsterGuess = () => {
    setHitsterGuesses((prev) => {
      return [...prev].filter((item) => item.player !== pendingRemoval);
    });
    setPendingRemoval(null);
    setGamePhase(gamePhases.LOCKED_IN);
  };

  const checkIfRightAnswer = (
    answer: number,
    lowerBound: number,
    upperBound: number
  ): boolean => {
    return answer >= lowerBound && answer <= upperBound;
  };

  useEffect(() => {
    const onReveal = () => {
      const answer = +currentTrack!.releaseYear;

      const playerCorrect = checkIfRightAnswer(
        answer,
        lockedInGuess!.lowerBound,
        lockedInGuess!.upperBound
      );

      let hitstersCorrect: string[] = [];

      for (const hitsterGuess of hitsterGuesses) {
        if (
          checkIfRightAnswer(
            answer,
            hitsterGuess.guess.lowerBound,
            hitsterGuess.guess.upperBound
          )
        ) {
          hitstersCorrect.push(hitsterGuess.player);
        }
      }

      setRoundResult({
        playerCorrect: playerCorrect,
        hitstersCorrect: hitstersCorrect,
      });
    };

    if (gamePhase === gamePhases.REVEALED) {
      onReveal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase]);



  const addCardToPlayer = (card: HitsterTrack, playerName: string | null, setNextPlayer: boolean) => {
    setGameOverview((prev) => {
      if (prev === null) return null;
      const nextIndex = setNextPlayer ? ((prev.currentPlayer + 1) % prev.players.length) : prev.currentPlayer;
      if (playerName === null) {
        return {
          currentPlayer: nextIndex,
          players: prev.players,
        };
      }
      const updatedPlayers = prev.players.map((player) => {
        if (player.name !== playerName) return player;

        const updatedTimeline = [...player.timeline, card].sort(
          (a, b) => parseInt(a.releaseYear) - parseInt(b.releaseYear)
        );

        return {
          ...player,
          timeline: updatedTimeline,
        };
      });

      return {
        currentPlayer: nextIndex,
        players: updatedPlayers,
      };
    });
  };

  const startNewRound = () => {
    spotifyContext.pause();

    let whoGetsTheCard = roundResult!.playerCorrect
      ? currentPlayer().name
      : roundResult!.hitstersCorrect.length > 0
      ? roundResult!.hitstersCorrect[0]
      : null;

    addCardToPlayer(currentTrack!, whoGetsTheCard, true);

    setNextTrackToCurrentTrack();
    setGamePhase(gamePhases.PLAYING);
    setCurrentPendingHitster(null);
    setHitsterGuesses([]);
    setLockedInGuess(null);
    setGameKey((prev) => prev + 1);
  };

  const startGame = (players: CreatePlayer[]) => {
    setGameOverview({
      currentPlayer: 0,
      players: players.map((pl) => {
        return {
          ...pl,
          timeline: [],
        };
      }),
    });
    setCurrentScreen(SCREENS.PLAY_SCREEN);
  };

  const buyCard = (playerName: string) => {
    if (currentTrack === null) return;
    addCardToPlayer(currentTrack, playerName, false);
    setGamePhase(gamePhases.PLAYING);
    setCurrentPendingHitster(null);
    setHitsterGuesses([]);
    setLockedInGuess(null);
    setNextTrackToCurrentTrack();
    setIsBuyingCard(false);
        setGameKey((prev) => prev + 1);

  }

  return (
    <HitsterContext.Provider
      value={{
        gameKey: gameKey,
        loading: loading,
        playlists: playlists,
        pickRandomPlaylist: pickRandomPlaylist,
        getNextTrack: setNextTrackToCurrentTrack,
        currentScreen: currentScreen,
        currentTrack: currentTrack,
        nextTrack: nextTrack,
        gameOverview: gameOverview,
        gamePhase: gamePhase,
        setGamePhase: setGamePhase,
        hitsterGuesses: hitsterGuesses,
        setHitsterGuesses: setHitsterGuesses,
        currentPlayer: currentPlayer,
        currentPendingHitster: currentPendingHitster,
        setCurrentPendingHitster: setCurrentPendingHitster,
        assignPlayerToGuess: assignPlayerToGuess,
        lockedInGuess: lockedInGuess,
        setLockedInGuess: setLockedInGuess,
        removeHitsterGuess: removeHitsterGuess,
        setPendingRemoval: setPendingRemoval,
        roundResult: roundResult,
        startNewRound: startNewRound,
        playerColors: playerColors,
        startGame: startGame,
        continuePreviousGame: continuePreviousGame,
        createNewGame: createNewGame,
        isBuyingCard: isButyingCard,
        setIsBuyingCard: setIsBuyingCard,
        buyCard: buyCard,
      }}
    >
      {props.children}
    </HitsterContext.Provider>
  );
};

export default HitsterContext;

export const useHitsterContext = (): HitsterContextType => {
  const context = useContext(HitsterContext);
  if (!context) {
    throw new Error("useHitsterContext must be used within a HitsterProvider");
  }
  return context;
};
