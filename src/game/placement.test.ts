import { describe, expect, it } from 'vitest';
import type { PlacedShip, ShipName } from '../schemas/ship';
import { DEMO_VIEW } from './demoView';
import { shipCells } from './fleet';
import {
  checkPlacement,
  isInBounds,
  isValidFleet,
  overlapsFleet,
  placeShip,
  randomFleet,
  removeShip,
  validPlacements,
} from './placement';
import { createSeededRandom } from './random';

const ship = (
  name: ShipName,
  row: number,
  col: number,
  orientation: PlacedShip['orientation'] = 'horizontal',
): PlacedShip => ({ name, start: { row, col }, orientation });

describe('isInBounds', () => {
  it('accepts a Carrier reaching the right edge and rejects one past it', () => {
    expect(isInBounds(ship('Carrier', 0, 5))).toBe(true);
    expect(isInBounds(ship('Carrier', 0, 6))).toBe(false);
  });

  it('accepts a Carrier reaching the bottom edge and rejects one past it', () => {
    expect(isInBounds(ship('Carrier', 5, 0, 'vertical'))).toBe(true);
    expect(isInBounds(ship('Carrier', 6, 0, 'vertical'))).toBe(false);
  });

  it('fits a Destroyer into the J10 corner', () => {
    expect(isInBounds(ship('Destroyer', 8, 9, 'vertical'))).toBe(true);
    expect(isInBounds(ship('Destroyer', 9, 8, 'horizontal'))).toBe(true);
    expect(isInBounds(ship('Destroyer', 9, 9, 'vertical'))).toBe(false);
  });
});

describe('orientation', () => {
  it('covers different cells horizontally vs vertically from the same start', () => {
    expect(shipCells(ship('Cruiser', 2, 2, 'horizontal'))).not.toEqual(shipCells(ship('Cruiser', 2, 2, 'vertical')));
  });

  it('can be valid one way and invalid the other near an edge', () => {
    expect(checkPlacement([], ship('Carrier', 0, 6, 'horizontal'))).toBe('out-of-bounds');
    expect(checkPlacement([], ship('Carrier', 0, 6, 'vertical'))).toBeNull();
  });
});

describe('overlap', () => {
  const cruiser = ship('Cruiser', 4, 3); // D5–F5

  it('rejects ships that cross', () => {
    expect(overlapsFleet([cruiser], ship('Battleship', 2, 4, 'vertical'))).toBe(true);
    expect(checkPlacement([cruiser], ship('Battleship', 2, 4, 'vertical'))).toBe('overlap');
  });

  it('rejects sharing a single end cell', () => {
    expect(checkPlacement([cruiser], ship('Destroyer', 4, 5))).toBe('overlap');
  });

  it('allows ships to touch side by side and end to end', () => {
    expect(checkPlacement([cruiser], ship('Submarine', 5, 3))).toBeNull(); // directly below
    expect(checkPlacement([cruiser], ship('Destroyer', 4, 6))).toBeNull(); // right after its end
  });
});

describe('placeShip', () => {
  it('adds a legal ship and returns a new fleet without mutating the input', () => {
    const before: PlacedShip[] = [ship('Carrier', 0, 0)];
    const snapshot = structuredClone(before);
    const result = placeShip(before, ship('Destroyer', 5, 5));
    expect(result).toEqual({ ok: true, fleet: [...before, ship('Destroyer', 5, 5)] });
    expect(before).toEqual(snapshot);
    if (result.ok) expect(result.fleet).not.toBe(before);
  });

  it('reports why a placement was refused', () => {
    const fleet = [ship('Cruiser', 0, 0)];
    expect(placeShip(fleet, ship('Cruiser', 5, 5))).toEqual({ ok: false, error: 'already-placed' });
    expect(placeShip(fleet, ship('Carrier', 9, 7))).toEqual({ ok: false, error: 'out-of-bounds' });
    expect(placeShip(fleet, ship('Destroyer', 0, 1, 'vertical'))).toEqual({ ok: false, error: 'overlap' });
  });
});

describe('removeShip', () => {
  it('removes by name without mutating the input', () => {
    const fleet = [ship('Carrier', 0, 0), ship('Destroyer', 5, 5)];
    const snapshot = structuredClone(fleet);
    expect(removeShip(fleet, 'Carrier')).toEqual([ship('Destroyer', 5, 5)]);
    expect(fleet).toEqual(snapshot);
  });

  it('frees the cells for another ship', () => {
    const fleet = removeShip([ship('Carrier', 0, 0)], 'Carrier');
    expect(checkPlacement(fleet, ship('Battleship', 0, 0))).toBeNull();
  });
});

describe('isValidFleet', () => {
  it('accepts the demo fleet', () => {
    expect(isValidFleet(DEMO_VIEW.fleet)).toBe(true);
  });

  it('rejects an incomplete fleet', () => {
    expect(isValidFleet(DEMO_VIEW.fleet.slice(0, 4))).toBe(false);
  });

  it('rejects overlapping ships', () => {
    const fleet = DEMO_VIEW.fleet.map((s) => (s.name === 'Destroyer' ? ship('Destroyer', 1, 1, 'vertical') : s));
    expect(isValidFleet(fleet)).toBe(false);
  });

  it('rejects a ship off the board', () => {
    const fleet = DEMO_VIEW.fleet.map((s) => (s.name === 'Destroyer' ? ship('Destroyer', 9, 9) : s));
    expect(isValidFleet(fleet)).toBe(false);
  });
});

describe('validPlacements', () => {
  it('counts every legal spot on an empty board', () => {
    // Destroyer: 9 starts per row × 10 rows, both orientations.
    expect(validPlacements([], 'Destroyer')).toHaveLength(180);
    expect(validPlacements([], 'Carrier')).toHaveLength(120);
  });

  it('only returns spots that pass checkPlacement', () => {
    const fleet = DEMO_VIEW.fleet.filter((s) => s.name !== 'Cruiser');
    for (const option of validPlacements(fleet, 'Cruiser')) {
      expect(checkPlacement(fleet, option)).toBeNull();
    }
  });
});

describe('randomFleet', () => {
  it('always produces a valid fleet', () => {
    for (let seed = 0; seed < 500; seed++) {
      expect(isValidFleet(randomFleet(createSeededRandom(seed)))).toBe(true);
    }
  });

  it('is deterministic for a given seed', () => {
    expect(randomFleet(createSeededRandom(123))).toEqual(randomFleet(createSeededRandom(123)));
  });

  it('varies across seeds', () => {
    expect(randomFleet(createSeededRandom(1))).not.toEqual(randomFleet(createSeededRandom(2)));
  });
});
