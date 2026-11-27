import { describe, expect, it } from 'vitest';
import { ShotSchema } from './shot';

describe('ShotSchema', () => {
  it.each(['hit', 'miss'])('accepts a %s', (result) => {
    expect(ShotSchema.safeParse({ coord: { row: 0, col: 9 }, result }).success).toBe(true);
  });

  it.each([
    ['unknown result', { coord: { row: 0, col: 0 }, result: 'sunk' }],
    ['coord out of range', { coord: { row: -1, col: 0 }, result: 'hit' }],
    ['missing result', { coord: { row: 0, col: 0 } }],
    ['missing coord', { result: 'miss' }],
  ])('rejects %s', (_label, value) => {
    expect(ShotSchema.safeParse(value).success).toBe(false);
  });
});
