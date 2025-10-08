import { GamePhase } from "Components/HitsterComponents/GamePhases";
import { ReactNode } from "react";

export interface HitsterContextType {
  gameKey: number;
  loading: boolean;
  playlists: Playlist[];
  pickRandomPlaylist: () => void;
  getNextTrack: () => void;
  currentScreen: string;
  currentTrack: HitsterTrack | null;
  nextTrack: HitsterTrack | null;
  gameOverview: GameOverview | null;
  gamePhase: GamePhase;
  setGamePhase: (phase: GamePhase) => void;
  hitsterGuesses: HitsterGuess[];
  setHitsterGuesses: (guesses: HitsterGuess[]) => void;
  currentPlayer: () => HitsterPlayer;
  currentPendingHitster: any;
  setCurrentPendingHitster: (p: any) => void;
  assignPlayerToGuess: (p: string) => void;
  lockedInGuess: any;
  setLockedInGuess: (g: any) => void;
  removeHitsterGuess: () => void;
  setPendingRemoval: (p: string) => void;
  roundResult: RoundResult | null;
  startNewRound: () => void;
  playerColors: PlayerColors;
  startGame: (players: CreatePlayer[]) => void;
  continuePreviousGame: () => void;
  createNewGame: () => void;
  isBuyingCard: boolean;
  setIsBuyingCard: (isBuying: boolean) => void;
  buyCard: (playerName: string) => void;
}

export interface PlaylistTrack {
  id: string;
  name: string;
  artists: string;
}

export interface PlaylistMetadata {
  id: string;
  name: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: PlaylistTrack[];
  loaded: boolean;
}

export interface HitsterPlayer {
  name: string;
  color: string;
  timeline: HitsterTrack[];
}

// export interface TimelineCard {
//   name: string;
//   id: string;
//   artists: string;
//   releaseYear: string;
//   color: string;
// }

export interface GameOverview {
  currentPlayer: number;
  players: HitsterPlayer[];
}

export interface HitsterGuess {
  player: string;
  color: string;
  guess: HitsterGuessedValue;
}

export interface HitsterGuessedValue {
  index: number;
  lowerBound: number;
  upperBound: number;
}

export interface HitsterProviderProps {
  children: ReactNode;
}

export interface HitsterTrack {
  id: string;
  name: string;
  artists: string;
  releaseYear: string;
  color: string;
}

export interface Indicator {
  lowerBound: number;
  upperBound: number;
  active: boolean;
}

export interface TimelineProps {
  player: HitsterPlayer;
}

export interface IndicatorProps {
  index: number;
  indicator: Indicator;
}

export interface TimelineHeaderProps {
  color: string;
  player: string;
  numOfCards: number;
}

export interface RoundResult {
  playerCorrect: boolean;
  hitstersCorrect: string[];
}
export type PlayerColors = {
  pink: string;
  red: string;
  orange: string;
  yellow: string;
  green: string;
  lightBlue: string;
  blue: string;
  purple: string;
};

export interface CreatePlayer {
  name: string;
  color: string;
}

export interface HitsterStorage {
  playedTracks: string[];
  gameOverview: GameOverview;
}
