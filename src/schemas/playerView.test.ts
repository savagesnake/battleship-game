import { describe, expect, it } from 'vitest';
import { PlayerViewSchema } from './playerView';

const empty = { fleet: [], incomingShots: [], outgoingShots: [], sunkEnemyShips: [] };

describe('PlayerViewSchema', () => {
  it('accepts an empty view', () => {
    expect(PlayerViewSchema.safeParse(empty).success).toBe(true);
  });

  it('accepts a populated view', () => {
    const view = {
      fleet: [{ name: 'Destroyer', start: { row: 0, col: 0 }, orientation: 'horizontal' }],
      incomingShots: [{ coord: { row: 0, col: 0 }, result: 'hit' }],
      outgoingShots: [{ coord: { row: 5, col: 5 }, result: 'miss' }],
      sunkEnemyShips: [],
    };
    expect(PlayerViewSchema.safeParse(view).success).toBe(true);
  });

  it.each([
    ['missing fleet', { incomingShots: [], outgoingShots: [], sunkEnemyShips: [] }],
    ['invalid shot inside', { ...empty, incomingShots: [{ coord: { row: 0, col: 0 }, result: 'x' }] }],
    ['invalid ship inside', { ...empty, fleet: [{ name: 'Raft', start: { row: 0, col: 0 }, orientation: 'horizontal' }] }],
    ['not an object', null],
  ])('rejects %s', (_label, value) => {
    expect(PlayerViewSchema.safeParse(value).success).toBe(false);
  });
});
