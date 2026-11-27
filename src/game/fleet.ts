import type { Coord } from '../schemas/coord';
import { ShipNameSchema, type PlacedShip, type ShipName } from '../schemas/ship';

/**
 * Ship lengths (SPEC §4.1). `satisfies` makes a missing, extra or misspelled ship a compile error,
 * so this table and ShipNameSchema can't drift apart.
 */
export const SHIP_LENGTH = {
  Carrier: 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2,
} as const satisfies Record<ShipName, number>;

/** The fleet in placement order (the order of ShipNameSchema). */
export const FLEET: readonly { name: ShipName; length: number }[] = ShipNameSchema.options.map((name) => ({
  name,
  length: SHIP_LENGTH[name],
}));

export const FLEET_SIZE = FLEET.length;
export const FLEET_CELL_COUNT = FLEET.reduce((sum, ship) => sum + ship.length, 0);

/** Cells a ship covers, from its start cell rightwards (horizontal) or downwards (vertical). */
export function shipCells(ship: PlacedShip): Coord[] {
  return Array.from({ length: SHIP_LENGTH[ship.name] }, (_, i) =>
    ship.orientation === 'horizontal'
      ? { row: ship.start.row, col: ship.start.col + i }
      : { row: ship.start.row + i, col: ship.start.col },
  );
}

/** Fleet ships not yet placed, in fleet order. */
export function missingShips(ships: readonly PlacedShip[]): ShipName[] {
  const placed = new Set(ships.map((ship) => ship.name));
  return FLEET.map((ship) => ship.name).filter((name) => !placed.has(name));
}

/** Exactly one of each fleet ship: no duplicates, no extras, nothing missing. Positions are not checked here (§4.2). */
export function isCompleteFleet(ships: readonly PlacedShip[]): boolean {
  return ships.length === FLEET_SIZE && missingShips(ships).length === 0;
}
