import { describe, expect, it } from 'vitest';
import { DEMO_VIEW } from '../game/demoView';
import { randomFleet } from '../game/placement';
import { createSeededRandom } from '../game/random';
import { GameSetupSchema } from './gameSetup';

const valid = {
  mode: 'vsComputer',
  playerFleet: DEMO_VIEW.fleet,
  computerFleet: randomFleet(createSeededRandom(5)),
};

describe('GameSetupSchema', () => {
  it('accepts a valid setup', () => {
    expect(GameSetupSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['bad mode', { ...valid, mode: 'hotSeat' }],
    ['incomplete player fleet', { ...valid, playerFleet: DEMO_VIEW.fleet.slice(0, 4) }],
    [
      'overlapping computer fleet',
      { ...valid, computerFleet: valid.computerFleet.map((s) => ({ ...s, start: { row: 0, col: 0 }, orientation: 'vertical' })) },
    ],
    ['missing computer fleet', { mode: 'vsComputer', playerFleet: DEMO_VIEW.fleet }],
  ])('rejects %s', (_label, value) => {
    expect(GameSetupSchema.safeParse(value).success).toBe(false);
  });
});
