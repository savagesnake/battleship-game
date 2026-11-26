// Single home for every visual token (SPEC §8). Placeholder v1 palette, meant to be replaced.

export const BOARD_SIZE = 10;

export const theme = {
  colors: {
    background: 0x0b1d2e,
    water: 0x1e4d7a,
    gridLine: 0x9cc3e6,
    ship: 0x7a8794,
    shipSunk: 0x5a1f1f,
    pegHit: 0xd93636,
    pegMiss: 0xf2f2f2,
    previewValid: 0x3fbf6f,
    previewInvalid: 0xd93636,
    text: '#f2f2f2',
    textMuted: '#9cc3e6',
  },
  sizes: {
    cellSize: 32,
    gridLineWidth: 1,
    pegRadius: 8,
    labelGutter: 24,
  },
  fonts: {
    family: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    titleSize: '40px',
    bodySize: '18px',
    labelSize: '14px',
  },
  spacing: {
    margin: 24,
    gridGap: 32,
    statusHeight: 48,
  },
  timings: {
    aiDelayMs: 600,
  },
} as const;

/** Canvas size derived from theme values, so changing cellSize reflows everything. */
export function computeLayout(t: typeof theme = theme) {
  const gridPixels = BOARD_SIZE * t.sizes.cellSize;
  const gridWithLabels = gridPixels + t.sizes.labelGutter;
  const width = gridWithLabels + t.spacing.margin * 2;
  // Two stacked grids (target above, ocean below) plus a status bar.
  const height =
    t.spacing.margin * 2 + gridWithLabels * 2 + t.spacing.gridGap + t.spacing.statusHeight;
  return { gridPixels, gridWithLabels, width, height };
}

export const layout = computeLayout();
