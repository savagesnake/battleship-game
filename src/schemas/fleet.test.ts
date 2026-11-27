import { describe, expect, it } from 'vitest';
import { DEMO_VIEW } from '../game/demoView';
import { FleetSchema } from './fleet';

const fleet = DEMO_VIEW.fleet;

describe('FleetSchema', () => {
  it('accepts a complete fleet', () => {
    expect(FleetSchema.safeParse(fleet).success).toBe(true);
  });

  it.each([
    ['empty', []],
    ['four ships', fleet.slice(0, 4)],
    ['six ships', [...fleet, fleet[0]]],
    ['duplicate name', fleet.map((s) => (s.name === 'Submarine' ? { ...s, name: 'Cruiser' } : s))],
    ['invalid ship inside', fleet.map((s, i) => (i === 0 ? { ...s, orientation: 'diagonal' } : s))],
    ['not an array', { ships: fleet }],
  ])('rejects %s', (_label, value) => {
    expect(FleetSchema.safeParse(value).success).toBe(false);
  });
});
