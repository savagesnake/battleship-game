import Phaser from 'phaser';
import type { Coord } from '../schemas/coord';
import { theme } from '../theme';
import { cellTopLeft, type GridLayout } from './boardLayout';

/** Empty water cell with its grid-line border. */
export function drawCell(scene: Phaser.Scene, grid: GridLayout, coord: Coord): Phaser.GameObjects.Rectangle {
  const { x, y } = cellTopLeft(grid, coord);
  return scene.add
    .rectangle(x, y, grid.cellSize, grid.cellSize, theme.colors.water)
    .setOrigin(0)
    .setStrokeStyle(theme.sizes.gridLineWidth, theme.colors.gridLine);
}
