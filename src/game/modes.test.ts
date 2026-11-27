import { describe, expect, it } from 'vitest';
import { GameModeSchema } from '../schemas/gameMode';
import { GAME_MODES, isModeAvailable } from './modes';

describe('GAME_MODES', () => {
  it('lists vs Computer first', () => {
    expect(GAME_MODES[0]?.mode).toBe('vsComputer');
  });

  it('lists every schema mode exactly once', () => {
    const listed = GAME_MODES.map((option) => option.mode).sort();
    expect(listed).toEqual([...GameModeSchema.options].sort());
  });
});

describe('isModeAvailable', () => {
  it('allows vs Computer in v1', () => {
    expect(isModeAvailable('vsComputer')).toBe(true);
  });

  it('blocks vs Player until online play ships', () => {
    expect(isModeAvailable('vsPlayer')).toBe(false);
  });
});
