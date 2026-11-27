import { describe, expect, it } from 'vitest';
import type { PlacedShip } from '../schemas/ship';
import { isSunk } from './sunk';

const destroyer: PlacedShip = { name: 'Destroyer', start: { row: 4, col: 4 }, orientation: 'horizontal' };

describe('isSunk', () => {
  it('is false with no shots', () => {
    expect(isSunk(destroyer, [])).toBe(false);
  });

  it('is false when only partly hit', () => {
    expect(isSunk(destroyer, [{ coord: { row: 4, col: 4 }, result: 'hit' }])).toBe(false);
  });

  it('is true when every cell is hit', () => {
    expect(
      isSunk(destroyer, [
        { coord: { row: 4, col: 4 }, result: 'hit' },
        { coord: { row: 4, col: 5 }, result: 'hit' },
      ]),
    ).toBe(true);
  });

  it('ignores misses on the same cells', () => {
    expect(
      isSunk(destroyer, [
        { coord: { row: 4, col: 4 }, result: 'hit' },
        { coord: { row: 4, col: 5 }, result: 'miss' },
      ]),
    ).toBe(false);
  });
});
