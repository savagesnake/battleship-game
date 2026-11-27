import type { PlacedShip } from '../schemas/ship';
import type { Shot } from '../schemas/shot';
import { shipCells } from './fleet';

/** A ship is sunk when every one of its cells has been hit (SPEC §5.2). */
export function isSunk(ship: PlacedShip, shotsAgainst: readonly Shot[]): boolean {
  return shipCells(ship).every((cell) =>
    shotsAgainst.some(
      (shot) => shot.result === 'hit' && shot.coord.row === cell.row && shot.coord.col === cell.col,
    ),
  );
}
