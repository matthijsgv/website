export const gamePhases = {
  PLAYING: "playing",
  READY_TO_LOCK_IN: "readyToLockIn",
  LOCKED_IN: "lockedIn",
  REMOVING_HITSTER: "removingHitster",
  TRYING_TO_HITSTER: "tryingToHitster",
  REVEALED: "revealed",
  BUYING_CARD: "buyingCard",
} as const;

export type GamePhase = typeof gamePhases[keyof typeof gamePhases];

export function getGamePhaseIndex(phase: GamePhase): number {
  return Object.values(gamePhases).indexOf(phase);
}