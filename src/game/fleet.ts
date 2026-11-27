import type { Coord } from '../schemas/coord';
import type { PlacedShip, ShipName } from '../schemas/ship';

/** Standard fleet (SPEC §4.1), in placement order. */
export const FLEET: readonly { name: ShipName; length: number }[] = [
  { name: 'Carrier', length: 5 },
  { name: 'Battleship', length: 4 },
  { name: 'Cruiser', length: 3 },
  { name: 'Submarine', length: 3 },
  { name: 'Destroyer', length: 2 },
];

export const SHIP_LENGTH: Readonly<Record<ShipName, number>> = Object.fromEntries(
  FLEET.map((ship) => [ship.name, ship.length]),
) as Record<ShipName, number>;

/** Cells a ship covers, from its start cell rightwards (horizontal) or downwards (vertical). */
export function shipCells(ship: PlacedShip): Coord[] {
  return Array.from({ length: SHIP_LENGTH[ship.name] }, (_, i) =>
    ship.orientation === 'horizontal'
      ? { row: ship.start.row, col: ship.start.col + i }
      : { row: ship.start.row + i, col: ship.start.col },
  );
}
