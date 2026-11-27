import type { PlacedShip, ShipName } from '../schemas/ship';
import { OrientationSchema } from '../schemas/ship';
import { BOARD_SIZE } from './constants';
import { FLEET, isCompleteFleet, shipCells } from './fleet';
import { randomInt, type Random } from './random';

/** Why a placement was refused (SPEC §4.2). */
export type PlacementError = 'out-of-bounds' | 'overlap' | 'already-placed';

export type PlacementResult = { ok: true; fleet: PlacedShip[] } | { ok: false; error: PlacementError };

const cellKey = ({ row, col }: { row: number; col: number }) => row * BOARD_SIZE + col;

/** Ship fits entirely on the grid. */
export function isInBounds(ship: PlacedShip): boolean {
  return shipCells(ship).every(
    ({ row, col }) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE,
  );
}

/** Ship shares a cell with any ship in the fleet. Touching (adjacent cells) is allowed. */
export function overlapsFleet(fleet: readonly PlacedShip[], ship: PlacedShip): boolean {
  const occupied = new Set(fleet.flatMap(shipCells).map(cellKey));
  return shipCells(ship).some((cell) => occupied.has(cellKey(cell)));
}

/** Reason the ship can't go here, or null if it can. Drives the §4.3 valid/invalid preview. */
export function checkPlacement(fleet: readonly PlacedShip[], ship: PlacedShip): PlacementError | null {
  if (fleet.some((placed) => placed.name === ship.name)) return 'already-placed';
  if (!isInBounds(ship)) return 'out-of-bounds';
  if (overlapsFleet(fleet, ship)) return 'overlap';
  return null;
}

/** Adds a ship if the placement is legal. Returns a new fleet; never mutates the input. */
export function placeShip(fleet: readonly PlacedShip[], ship: PlacedShip): PlacementResult {
  const error = checkPlacement(fleet, ship);
  return error ? { ok: false, error } : { ok: true, fleet: [...fleet, ship] };
}

/** Takes a ship back off the board (e.g. to move it). Returns a new fleet. */
export function removeShip(fleet: readonly PlacedShip[], name: ShipName): PlacedShip[] {
  return fleet.filter((ship) => ship.name !== name);
}

/** One of each ship, all on the board, none overlapping. */
export function isValidFleet(fleet: readonly PlacedShip[]): boolean {
  if (!isCompleteFleet(fleet) || !fleet.every(isInBounds)) return false;
  const keys = fleet.flatMap(shipCells).map(cellKey);
  return new Set(keys).size === keys.length;
}

/** Every legal spot for this ship given what's already placed. */
export function validPlacements(fleet: readonly PlacedShip[], name: ShipName): PlacedShip[] {
  const options: PlacedShip[] = [];
  for (const orientation of OrientationSchema.options) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const ship: PlacedShip = { name, start: { row, col }, orientation };
        if (checkPlacement(fleet, ship) === null) options.push(ship);
      }
    }
  }
  return options;
}

const MAX_RANDOM_ATTEMPTS = 100;

/**
 * A full, valid fleet chosen at random (SPEC §4.3 Randomize, and the computer's fleet).
 * Picks each ship from its list of legal spots, so it never produces an invalid fleet.
 */
export function randomFleet(random: Random): PlacedShip[] {
  for (let attempt = 0; attempt < MAX_RANDOM_ATTEMPTS; attempt++) {
    let fleet: PlacedShip[] = [];
    for (const { name } of FLEET) {
      const options = validPlacements(fleet, name);
      const choice = options[randomInt(random, options.length)];
      // Can't happen with the standard fleet on 10×10, but restart rather than loop forever.
      if (!choice) break;
      fleet = [...fleet, choice];
    }
    if (isCompleteFleet(fleet)) return fleet;
  }
  throw new Error('randomFleet: could not place the fleet');
}
