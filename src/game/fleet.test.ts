import { describe, expect, it } from 'vitest';
import type { PlacedShip, ShipName } from '../schemas/ship';
import { DEMO_VIEW } from './demoView';
import {
  FLEET,
  FLEET_CELL_COUNT,
  FLEET_SIZE,
  isCompleteFleet,
  missingShips,
  SHIP_LENGTH,
  shipCells,
} from './fleet';

const at = (name: ShipName, row = 0): PlacedShip => ({ name, start: { row, col: 0 }, orientation: 'horizontal' });
const fullFleet: PlacedShip[] = DEMO_VIEW.fleet;

describe('FLEET', () => {
  it('matches SPEC §4.1 in order and length', () => {
    expect(FLEET).toEqual([
      { name: 'Carrier', length: 5 },
      { name: 'Battleship', length: 4 },
      { name: 'Cruiser', length: 3 },
      { name: 'Submarine', length: 3 },
      { name: 'Destroyer', length: 2 },
    ]);
    expect(SHIP_LENGTH.Carrier).toBe(5);
    expect(SHIP_LENGTH.Destroyer).toBe(2);
  });

  it('has 5 ships covering 17 cells', () => {
    expect(FLEET_SIZE).toBe(5);
    expect(FLEET_CELL_COUNT).toBe(17);
  });
});

describe('shipCells', () => {
  it('extends right for horizontal ships', () => {
    expect(shipCells({ name: 'Cruiser', start: { row: 2, col: 3 }, orientation: 'horizontal' })).toEqual([
      { row: 2, col: 3 },
      { row: 2, col: 4 },
      { row: 2, col: 5 },
    ]);
  });

  it('extends down for vertical ships', () => {
    expect(shipCells({ name: 'Destroyer', start: { row: 7, col: 0 }, orientation: 'vertical' })).toEqual([
      { row: 7, col: 0 },
      { row: 8, col: 0 },
    ]);
  });

  it('returns one cell per unit of length', () => {
    for (const { name, length } of FLEET) {
      expect(shipCells({ name, start: { row: 0, col: 0 }, orientation: 'vertical' })).toHaveLength(length);
    }
  });
});

describe('missingShips', () => {
  it('lists the whole fleet in order when nothing is placed', () => {
    expect(missingShips([])).toEqual(['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer']);
  });

  it('lists only unplaced ships for a partial fleet', () => {
    expect(missingShips([at('Cruiser'), at('Carrier', 2)])).toEqual(['Battleship', 'Submarine', 'Destroyer']);
  });

  it('is empty for a full fleet', () => {
    expect(missingShips(fullFleet)).toEqual([]);
  });
});

describe('isCompleteFleet', () => {
  it('accepts a full fleet in any order', () => {
    expect(isCompleteFleet(fullFleet)).toBe(true);
    expect(isCompleteFleet([...fullFleet].reverse())).toBe(true);
  });

  it('rejects an empty or partial fleet', () => {
    expect(isCompleteFleet([])).toBe(false);
    expect(isCompleteFleet(fullFleet.slice(0, 4))).toBe(false);
  });

  it('rejects a duplicate standing in for a missing ship', () => {
    const withTwoCruisers = fullFleet.map((ship) => (ship.name === 'Submarine' ? { ...ship, name: 'Cruiser' as const } : ship));
    expect(isCompleteFleet(withTwoCruisers)).toBe(false);
  });

  it('rejects an extra ship', () => {
    expect(isCompleteFleet([...fullFleet, at('Destroyer', 9)])).toBe(false);
  });
});
