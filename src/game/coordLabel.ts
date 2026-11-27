import type { Coord } from '../schemas/coord';
import { BOARD_SIZE } from './constants';

export const COLUMN_LABELS: readonly string[] = Array.from({ length: BOARD_SIZE }, (_, i) =>
  String.fromCharCode('A'.charCodeAt(0) + i),
);
export const ROW_LABELS: readonly string[] = Array.from({ length: BOARD_SIZE }, (_, i) => String(i + 1));

/** `{ row: 6, col: 1 }` → `"B7"` (SPEC §3). */
export function formatCoord(coord: Coord): string {
  return `${COLUMN_LABELS[coord.col]}${ROW_LABELS[coord.row]}`;
}

/** `"B7"` / `"b7"` → `{ row: 6, col: 1 }`; anything off the board → `null`. */
export function parseCoord(text: string): Coord | null {
  const match = /^([A-Za-z])(\d{1,2})$/.exec(text.trim());
  if (!match) return null;
  const [, letter = '', digits = ''] = match;
  const col = COLUMN_LABELS.indexOf(letter.toUpperCase());
  const row = ROW_LABELS.indexOf(digits);
  if (col === -1 || row === -1) return null;
  return { row, col };
}
