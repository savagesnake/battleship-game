import { describe, expect, it } from 'vitest';
import { OrientationSchema, PlacedShipSchema, ShipNameSchema } from './ship';

describe('ShipNameSchema', () => {
  it.each(['Carrier', 'Battleship', 'Cruiser', 'Submarine', 'Destroyer'])('accepts %s', (name) => {
    expect(ShipNameSchema.safeParse(name).success).toBe(true);
  });

  it.each([['carrier'], ['Frigate'], [''], [null]])('rejects %o', (value) => {
    expect(ShipNameSchema.safeParse(value).success).toBe(false);
  });
});

describe('OrientationSchema', () => {
  it('accepts horizontal and vertical', () => {
    expect(OrientationSchema.safeParse('horizontal').success).toBe(true);
    expect(OrientationSchema.safeParse('vertical').success).toBe(true);
  });

  it('rejects diagonal', () => {
    expect(OrientationSchema.safeParse('diagonal').success).toBe(false);
  });
});

describe('PlacedShipSchema', () => {
  const valid = { name: 'Cruiser', start: { row: 2, col: 3 }, orientation: 'vertical' };

  it('accepts a valid ship', () => {
    expect(PlacedShipSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['bad name', { ...valid, name: 'Frigate' }],
    ['bad orientation', { ...valid, orientation: 'diagonal' }],
    ['start out of range', { ...valid, start: { row: 10, col: 0 } }],
    ['missing start', { name: 'Cruiser', orientation: 'vertical' }],
  ])('rejects %s', (_label, value) => {
    expect(PlacedShipSchema.safeParse(value).success).toBe(false);
  });
});
