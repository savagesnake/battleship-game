import { describe, expect, it } from 'vitest';
import { GameModeSchema } from './gameMode';

describe('GameModeSchema', () => {
  it.each(['vsComputer', 'vsPlayer'])('accepts %s', (mode) => {
    expect(GameModeSchema.safeParse(mode).success).toBe(true);
  });

  it.each([['hotSeat'], [''], [null], [undefined], [1], ['VSCOMPUTER']])(
    'rejects %o',
    (value) => {
      expect(GameModeSchema.safeParse(value).success).toBe(false);
    },
  );
});
