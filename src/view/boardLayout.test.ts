import { describe, expect, it } from 'vitest';
import { BOARD_SIZE } from '../game/constants';
import { theme } from '../theme';
import { cellAt, cellCenter, computeLayout, layout, type LayoutTokens } from './boardLayout';

const bottomOf = (grid: { originY: number }) => grid.originY + layout.gridPixels;

describe('computeLayout', () => {
  it('puts the target grid above the ocean grid without overlap', () => {
    expect(layout.target.originY).toBeLessThan(layout.ocean.originY);
    expect(bottomOf(layout.target)).toBeLessThan(layout.ocean.titleY);
  });

  it('leaves room for labels and titles above each grid', () => {
    for (const grid of [layout.target, layout.ocean]) {
      expect(grid.originY - grid.titleY).toBe(theme.spacing.sectionTitleHeight + theme.sizes.labelGutter);
      expect(grid.originX).toBeGreaterThanOrEqual(theme.sizes.labelGutter);
    }
  });

  it('fits everything inside the canvas', () => {
    expect(layout.target.titleY).toBeGreaterThanOrEqual(0);
    expect(layout.target.originX + layout.gridPixels).toBeLessThanOrEqual(layout.width);
    expect(layout.status.y + layout.status.height).toBeLessThanOrEqual(layout.height);
    expect(layout.status.y).toBeGreaterThanOrEqual(bottomOf(layout.ocean));
  });

  it('reflows when cellSize changes', () => {
    const bigger: LayoutTokens = { ...theme, sizes: { ...theme.sizes, cellSize: theme.sizes.cellSize * 2 } };
    const big = computeLayout(bigger);
    expect(big.gridPixels).toBe(layout.gridPixels * 2);
    expect(big.width - layout.width).toBe(layout.gridPixels);
    expect(big.ocean.originY).toBeGreaterThan(layout.ocean.originY);
  });
});

describe('cellCenter / cellAt', () => {
  it('round-trips every cell on both grids', () => {
    for (const grid of [layout.target, layout.ocean]) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const { x, y } = cellCenter(grid, { row, col });
          expect(cellAt(grid, x, y)).toEqual({ row, col });
        }
      }
    }
  });

  it('returns null outside the grid', () => {
    const g = layout.target;
    expect(cellAt(g, g.originX - 1, g.originY + 1)).toBeNull();
    expect(cellAt(g, g.originX + 1, g.originY - 1)).toBeNull();
    expect(cellAt(g, g.originX + layout.gridPixels, g.originY + 1)).toBeNull();
    expect(cellAt(g, g.originX + 1, g.originY + layout.gridPixels)).toBeNull();
  });
});
