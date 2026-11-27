import { describe, expect, it } from 'vitest';
import { FLEET, SHIP_LENGTH, shipCells } from './fleet';

describe('FLEET', () => {
  it('matches SPEC §4.1 (5 ships, 17 cells)', () => {
    expect(FLEET.map((s) => s.name)).toEqual(['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer']);
    expect(FLEET.reduce((sum, s) => sum + s.length, 0)).toBe(17);
    expect(SHIP_LENGTH.Carrier).toBe(5);
    expect(SHIP_LENGTH.Destroyer).toBe(2);
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
