import type { Coord } from '../schemas/coord';
import type { Orientation, PlacedShip, ShipName } from '../schemas/ship';
import { BOARD_SIZE } from './constants';
import { missingShips, shipCells } from './fleet';
import { checkPlacement, isValidFleet, placeShip, randomFleet, removeShip, type PlacementError } from './placement';
import type { Random } from './random';

/** Everything the placement screen (SPEC §4.3) needs; the scene renders it and forwards input. */
export interface PlacementState {
  fleet: PlacedShip[];
  selected: ShipName | null;
  orientation: Orientation;
}

export interface PlacementPreview {
  /** Only on-board cells, so an off-edge preview is drawn clipped. */
  cells: Coord[];
  valid: boolean;
}

export function initialPlacement(): PlacementState {
  return { fleet: [], selected: missingShips([])[0] ?? null, orientation: 'horizontal' };
}

/** Selects a ship; if it's already on the board, picks it back up so it can be moved. */
export function selectShip(state: PlacementState, name: ShipName): PlacementState {
  return { ...state, fleet: removeShip(state.fleet, name), selected: name };
}

export function rotate(state: PlacementState): PlacementState {
  return { ...state, orientation: state.orientation === 'horizontal' ? 'vertical' : 'horizontal' };
}

function candidateAt(state: PlacementState, start: Coord): PlacedShip | null {
  return state.selected ? { name: state.selected, start, orientation: state.orientation } : null;
}

export function previewAt(state: PlacementState, coord: Coord): PlacementPreview | null {
  const ship = candidateAt(state, coord);
  if (!ship) return null;
  const cells = shipCells(ship).filter(
    ({ row, col }) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE,
  );
  return { cells, valid: checkPlacement(state.fleet, ship) === null };
}

/** Places the selected ship with its top-left at `coord`, then selects the next unplaced ship. */
export function placeAt(
  state: PlacementState,
  coord: Coord,
): { state: PlacementState; error: PlacementError | null } {
  const ship = candidateAt(state, coord);
  if (!ship) return { state, error: null };
  const result = placeShip(state.fleet, ship);
  if (!result.ok) return { state, error: result.error };
  return {
    state: { ...state, fleet: result.fleet, selected: missingShips(result.fleet)[0] ?? null },
    error: null,
  };
}

export function resetPlacement(): PlacementState {
  return initialPlacement();
}

export function randomizePlacement(state: PlacementState, random: Random): PlacementState {
  return { ...state, fleet: randomFleet(random), selected: null };
}

/** Ready is allowed only once all five ships are legally placed. */
export function isReady(state: PlacementState): boolean {
  return isValidFleet(state.fleet);
}
