import { describe, expect, it } from 'vitest';
import { createSeededRandom, randomInt } from './random';

describe('createSeededRandom', () => {
  it('repeats the same sequence for the same seed', () => {
    const a = createSeededRandom(42);
    const b = createSeededRandom(42);
    const seqA = Array.from({ length: 20 }, a);
    expect(Array.from({ length: 20 }, b)).toEqual(seqA);
  });

  it('gives a different sequence for a different seed', () => {
    const a = Array.from({ length: 5 }, createSeededRandom(1));
    const b = Array.from({ length: 5 }, createSeededRandom(2));
    expect(a).not.toEqual(b);
  });

  it('stays within [0, 1)', () => {
    const random = createSeededRandom(7);
    for (let i = 0; i < 10_000; i++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe('randomInt', () => {
  it('stays within [0, max) and covers every value', () => {
    const random = createSeededRandom(3);
    const seen = new Set<number>();
    for (let i = 0; i < 1000; i++) {
      const value = randomInt(random, 10);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(10);
      seen.add(value);
    }
    expect(seen.size).toBe(10);
  });

  it('handles the edges of the source range', () => {
    expect(randomInt(() => 0, 10)).toBe(0);
    expect(randomInt(() => 0.999999, 10)).toBe(9);
  });
});
