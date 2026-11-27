import Phaser from 'phaser';
import type { PlacementPreview } from '../game/placementState';
import { theme } from '../theme';
import { cellTopLeft, type GridLayout } from './boardLayout';

/** Translucent green/red cells showing where the selected ship would go (SPEC §4.3). */
export function drawPreview(
  scene: Phaser.Scene,
  grid: GridLayout,
  preview: PlacementPreview,
): Phaser.GameObjects.Container {
  const color = preview.valid ? theme.colors.previewValid : theme.colors.previewInvalid;
  const cells = preview.cells.map((coord) => {
    const { x, y } = cellTopLeft(grid, coord);
    return scene.add
      .rectangle(x, y, grid.cellSize, grid.cellSize, color, theme.sizes.previewAlpha)
      .setOrigin(0);
  });
  return scene.add.container(0, 0, cells);
}
