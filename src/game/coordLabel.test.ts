import { describe, expect, it } from 'vitest';
import { BOARD_SIZE } from './constants';
import { COLUMN_LABELS, formatCoord, parseCoord, ROW_LABELS } from './coordLabel';

describe('labels', () => {
  it('uses A–J for columns and 1–10 for rows', () => {
    expect(COLUMN_LABELS.join('')).toBe('ABCDEFGHIJ');
    expect(ROW_LABELS).toEqual(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']);
  });
});

describe('formatCoord', () => {
  it('formats corners and the SPEC example', () => {
    expect(formatCoord({ row: 0, col: 0 })).toBe('A1');
    expect(formatCoord({ row: 9, col: 9 })).toBe('J10');
    expect(formatCoord({ row: 6, col: 1 })).toBe('B7');
  });
});

describe('parseCoord', () => {
  it('round-trips every cell', () => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        expect(parseCoord(formatCoord({ row, col }))).toEqual({ row, col });
      }
    }
  });

  it('is case-insensitive and trims spaces', () => {
    expect(parseCoord(' b7 ')).toEqual({ row: 6, col: 1 });
  });

  it.each(['K1', 'A11', 'A0', '', '7B', 'AA1', 'A-1', 'A01'])('rejects %o', (text) => {
    expect(parseCoord(text)).toBeNull();
  });
});
