import type { PlacedShip } from '../schemas/ship';
import type { PlayerView } from '../schemas/playerView';
import type { Shot } from '../schemas/shot';
import { BOARD_SIZE } from './constants';
import { shipCells } from './fleet';
import { isSunk } from './sunk';

export interface CellView {
  ship: 'none' | 'afloat' | 'sunk';
  peg: 'none' | 'hit' | 'miss';
}

export interface ShipView {
  ship: PlacedShip;
  sunk: boolean;
}

/** Everything needed to draw one grid: per-cell state (`cells[row][col]`) and whole-ship shapes. */
export interface BoardView {
  cells: CellView[][];
  ships: ShipView[];
}

function buildBoard(ships: ShipView[], shots: readonly Shot[]): BoardView {
  const cells: CellView[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, (): CellView => ({ ship: 'none', peg: 'none' })),
  );
  const at = (row: number, col: number): CellView | undefined => cells[row]?.[col];

  for (const { ship, sunk } of ships) {
    for (const { row, col } of shipCells(ship)) {
      const cell = at(row, col);
      if (cell) cell.ship = sunk ? 'sunk' : 'afloat';
    }
  }
  for (const shot of shots) {
    const cell = at(shot.coord.row, shot.coord.col);
    if (cell) cell.peg = shot.result;
  }
  return { cells, ships };
}

/** Lower grid: the player's own fleet plus the opponent's shots against it (SPEC §3). */
export function oceanBoard(view: PlayerView): BoardView {
  const ships = view.fleet.map((ship) => ({ ship, sunk: isSunk(ship, view.incomingShots) }));
  return buildBoard(ships, view.incomingShots);
}

/** Upper grid: the player's own shots. Enemy ships appear only once sunk (SPEC §3, §5.2). */
export function targetBoard(view: PlayerView): BoardView {
  const ships = view.sunkEnemyShips.map((ship) => ({ ship, sunk: true }));
  return buildBoard(ships, view.outgoingShots);
}

/** View at the start of a battle (or during placement): own fleet, no shots yet. */
export function startingView(fleet: readonly PlacedShip[]): PlayerView {
  return { fleet: [...fleet], incomingShots: [], outgoingShots: [], sunkEnemyShips: [] };
}
