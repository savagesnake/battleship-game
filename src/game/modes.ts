import type { GameMode } from '../schemas/gameMode';

export interface GameModeOption {
  readonly mode: GameMode;
  readonly label: string;
  readonly available: boolean;
}

/** Menu order. Online vs Player is planned after v1 (SPEC §2); flip `available` when it ships. */
export const GAME_MODES: readonly GameModeOption[] = [
  { mode: 'vsComputer', label: 'vs Computer', available: true },
  { mode: 'vsPlayer', label: 'vs Player', available: false },
];

export function isModeAvailable(mode: GameMode): boolean {
  return GAME_MODES.some((option) => option.mode === mode && option.available);
}
