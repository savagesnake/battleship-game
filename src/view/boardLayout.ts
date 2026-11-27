import { BOARD_SIZE } from '../game/constants';
import type { Coord } from '../schemas/coord';
import { theme } from '../theme';

/** The subset of theme tokens layout depends on, so tests can try other sizes. */
export interface LayoutTokens {
  sizes: { cellSize: number; labelGutter: number };
  spacing: { margin: number; gridGap: number; sectionTitleHeight: number; statusHeight: number };
}

export interface GridLayout {
  /** Top-left corner of cell A1. */
  originX: number;
  originY: number;
  cellSize: number;
  /** Top of the section title above the column labels. */
  titleY: number;
}

export interface Layout {
  width: number;
  height: number;
  gridPixels: number;
  labelGutter: number;
  target: GridLayout;
  ocean: GridLayout;
  status: { x: number; y: number; width: number; height: number };
}

/**
 * Stacked layout (SPEC §3): target grid on top, ocean grid below, status bar at the bottom.
 * Each grid block = section title, column labels, then the grid; row labels sit in a left gutter.
 * Everything derives from theme tokens, so changing cellSize reflows the whole screen (SPEC §8).
 */
export function computeLayout(tokens: LayoutTokens = theme): Layout {
  const { cellSize, labelGutter } = tokens.sizes;
  const { margin, gridGap, sectionTitleHeight, statusHeight } = tokens.spacing;
  const gridPixels = BOARD_SIZE * cellSize;
  const originX = margin + labelGutter;
  const headerHeight = sectionTitleHeight + labelGutter;

  const gridAt = (blockTop: number): GridLayout => ({
    originX,
    originY: blockTop + headerHeight,
    cellSize,
    titleY: blockTop,
  });

  const target = gridAt(margin);
  const ocean = gridAt(target.originY + gridPixels + gridGap);
  const statusY = ocean.originY + gridPixels;

  return {
    width: originX + gridPixels + margin,
    height: statusY + statusHeight + margin,
    gridPixels,
    labelGutter,
    target,
    ocean,
    status: { x: originX, y: statusY, width: gridPixels, height: statusHeight },
  };
}

export const layout = computeLayout();

export function cellTopLeft(grid: GridLayout, coord: Coord): { x: number; y: number } {
  return { x: grid.originX + coord.col * grid.cellSize, y: grid.originY + coord.row * grid.cellSize };
}

export function cellCenter(grid: GridLayout, coord: Coord): { x: number; y: number } {
  const { x, y } = cellTopLeft(grid, coord);
  return { x: x + grid.cellSize / 2, y: y + grid.cellSize / 2 };
}

/** Which cell a canvas point falls in, or null if it's outside the grid. */
export function cellAt(grid: GridLayout, x: number, y: number): Coord | null {
  const col = Math.floor((x - grid.originX) / grid.cellSize);
  const row = Math.floor((y - grid.originY) / grid.cellSize);
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return null;
  return { row, col };
}
