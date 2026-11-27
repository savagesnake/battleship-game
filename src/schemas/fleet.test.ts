import { describe, expect, it } from 'vitest';
import { DEMO_VIEW } from '../game/demoView';
import { FleetSchema } from './fleet';

const fleet = DEMO_VIEW.fleet;

describe('FleetSchema', () => {
  it('accepts a complete, legally placed fleet', () => {
    expect(FleetSchema.safeParse(fleet).success).toBe(true);
  });

  it('explains which rule failed', () => {
    const offBoard = fleet.map((s) => (s.name === 'Carrier' ? { ...s, start: { row: 1, col: 7 } } : s));
    const result = FleetSchema.safeParse(offBoard);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Carrier is off the board');
  });

  it.each([
    ['empty', []],
    ['four ships', fleet.slice(0, 4)],
    ['six ships', [...fleet, fleet[0]]],
    ['duplicate name', fleet.map((s) => (s.name === 'Submarine' ? { ...s, name: 'Cruiser' } : s))],
    ['invalid ship inside', fleet.map((s, i) => (i === 0 ? { ...s, orientation: 'diagonal' } : s))],
    ['not an array', { ships: fleet }],
    ['overlapping ships', fleet.map((s) => (s.name === 'Destroyer' ? { ...s, start: { row: 1, col: 1 } } : s))],
    ['ship off the board', fleet.map((s) => (s.name === 'Carrier' ? { ...s, start: { row: 1, col: 7 } } : s))],
  ])('rejects %s', (_label, value) => {
    expect(FleetSchema.safeParse(value).success).toBe(false);
  });
});
