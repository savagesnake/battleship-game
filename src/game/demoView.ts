import type { PlayerView } from '../schemas/playerView';

/**
 * Fixed sample view used as a test fixture (a full valid fleet, hits, misses and sunk ships on both grids).
 * Not used by the UI.
 */
export const DEMO_VIEW: PlayerView = {
  fleet: [
    { name: 'Carrier', start: { row: 1, col: 1 }, orientation: 'horizontal' },
    { name: 'Battleship', start: { row: 3, col: 7 }, orientation: 'vertical' },
    { name: 'Cruiser', start: { row: 6, col: 0 }, orientation: 'horizontal' },
    { name: 'Submarine', start: { row: 8, col: 4 }, orientation: 'horizontal' },
    { name: 'Destroyer', start: { row: 4, col: 2 }, orientation: 'vertical' },
  ],
  incomingShots: [
    { coord: { row: 4, col: 2 }, result: 'hit' },
    { coord: { row: 5, col: 2 }, result: 'hit' },
    { coord: { row: 1, col: 3 }, result: 'hit' },
    { coord: { row: 0, col: 0 }, result: 'miss' },
    { coord: { row: 7, col: 7 }, result: 'miss' },
    { coord: { row: 9, col: 9 }, result: 'miss' },
    { coord: { row: 2, col: 5 }, result: 'miss' },
  ],
  outgoingShots: [
    { coord: { row: 0, col: 8 }, result: 'hit' },
    { coord: { row: 0, col: 9 }, result: 'hit' },
    { coord: { row: 5, col: 5 }, result: 'hit' },
    { coord: { row: 3, col: 3 }, result: 'miss' },
    { coord: { row: 7, col: 1 }, result: 'miss' },
    { coord: { row: 9, col: 6 }, result: 'miss' },
  ],
  sunkEnemyShips: [{ name: 'Destroyer', start: { row: 0, col: 8 }, orientation: 'horizontal' }],
};
