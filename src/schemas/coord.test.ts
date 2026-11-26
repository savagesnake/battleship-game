import { describe, expect, it } from 'vitest';
import { CoordSchema } from './coord';

describe('CoordSchema', () => {
  it.each([
    { row: 0, col: 0 },
    { row: 9, col: 9 },
    { row: 4, col: 7 },
  ])('accepts %o', (coord) => {
    expect(CoordSchema.safeParse(coord).success).toBe(true);
  });

  it.each([
    ['negative row', { row: -1, col: 0 }],
    ['col past edge', { row: 0, col: 10 }],
    ['non-integer', { row: 1.5, col: 2 }],
    ['missing col', { row: 3 }],
    ['string value', { row: '3', col: 2 }],
    ['null', null],
  ])('rejects %s', (_label, value) => {
    expect(CoordSchema.safeParse(value).success).toBe(false);
  });
});
