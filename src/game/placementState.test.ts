import { describe, expect, it } from 'vitest';
import { createSeededRandom } from './random';
import {
  initialPlacement,
  isReady,
  placeAt,
  previewAt,
  randomizePlacement,
  resetPlacement,
  rotate,
  selectShip,
  type PlacementState,
} from './placementState';

const placeAll = (): PlacementState => {
  // Each ship on its own row, starting at column 0.
  let state = initialPlacement();
  for (let row = 0; state.selected; row += 2) state = placeAt(state, { row, col: 0 }).state;
  return state;
};

describe('initialPlacement', () => {
  it('starts empty, horizontal, with the Carrier selected', () => {
    expect(initialPlacement()).toEqual({ fleet: [], selected: 'Carrier', orientation: 'horizontal' });
  });
});

describe('selectShip', () => {
  it('selects an unplaced ship', () => {
    expect(selectShip(initialPlacement(), 'Cruiser').selected).toBe('Cruiser');
  });

  it('picks a placed ship back up off the board', () => {
    const placed = placeAt(initialPlacement(), { row: 0, col: 0 }).state;
    expect(placed.fleet.map((s) => s.name)).toEqual(['Carrier']);
    const pickedUp = selectShip(placed, 'Carrier');
    expect(pickedUp.fleet).toEqual([]);
    expect(pickedUp.selected).toBe('Carrier');
  });
});

describe('rotate', () => {
  it('toggles orientation and back', () => {
    const once = rotate(initialPlacement());
    expect(once.orientation).toBe('vertical');
    expect(rotate(once).orientation).toBe('horizontal');
  });
});

describe('previewAt', () => {
  it('is valid on an empty spot', () => {
    const preview = previewAt(initialPlacement(), { row: 2, col: 2 });
    expect(preview?.valid).toBe(true);
    expect(preview?.cells).toHaveLength(5);
  });

  it('is invalid and clipped past the edge', () => {
    const preview = previewAt(initialPlacement(), { row: 0, col: 8 });
    expect(preview?.valid).toBe(false);
    expect(preview?.cells).toEqual([
      { row: 0, col: 8 },
      { row: 0, col: 9 },
    ]);
  });

  it('follows the current orientation', () => {
    const preview = previewAt(rotate(initialPlacement()), { row: 0, col: 9 });
    expect(preview?.valid).toBe(true);
    expect(preview?.cells.every((c) => c.col === 9)).toBe(true);
  });

  it('is invalid over another ship', () => {
    const state = placeAt(initialPlacement(), { row: 0, col: 0 }).state; // Carrier A1–E1
    expect(previewAt(rotate(state), { row: 0, col: 2 })?.valid).toBe(false);
  });

  it('is null when no ship is selected', () => {
    expect(previewAt({ ...initialPlacement(), selected: null }, { row: 0, col: 0 })).toBeNull();
  });
});

describe('placeAt', () => {
  it('places the ship and selects the next unplaced one', () => {
    const { state, error } = placeAt(initialPlacement(), { row: 0, col: 0 });
    expect(error).toBeNull();
    expect(state.fleet).toEqual([{ name: 'Carrier', start: { row: 0, col: 0 }, orientation: 'horizontal' }]);
    expect(state.selected).toBe('Battleship');
  });

  it('leaves state unchanged and reports why on an invalid spot', () => {
    const before = initialPlacement();
    expect(placeAt(before, { row: 0, col: 6 })).toEqual({ state: before, error: 'out-of-bounds' });
    const withCarrier = placeAt(before, { row: 0, col: 0 }).state;
    expect(placeAt(withCarrier, { row: 0, col: 1 })).toEqual({ state: withCarrier, error: 'overlap' });
  });

  it('does nothing when no ship is selected', () => {
    const state = { ...initialPlacement(), selected: null };
    expect(placeAt(state, { row: 0, col: 0 })).toEqual({ state, error: null });
  });

  it('selects nothing once the whole fleet is placed', () => {
    const state = placeAll();
    expect(state.fleet).toHaveLength(5);
    expect(state.selected).toBeNull();
  });
});

describe('isReady', () => {
  it('is false until every ship is placed', () => {
    let state = initialPlacement();
    for (let row = 0; state.selected; row += 2) {
      expect(isReady(state)).toBe(false);
      state = placeAt(state, { row, col: 0 }).state;
    }
    expect(isReady(state)).toBe(true);
  });
});

describe('randomizePlacement / resetPlacement', () => {
  it('randomize places a full valid fleet', () => {
    const state = randomizePlacement(initialPlacement(), createSeededRandom(9));
    expect(isReady(state)).toBe(true);
    expect(state.selected).toBeNull();
  });

  it('keeps the chosen orientation for later moves', () => {
    const state = randomizePlacement(rotate(initialPlacement()), createSeededRandom(9));
    expect(state.orientation).toBe('vertical');
  });

  it('reset clears the board back to the start', () => {
    expect(resetPlacement()).toEqual(initialPlacement());
    expect(isReady(resetPlacement())).toBe(false);
  });
});
