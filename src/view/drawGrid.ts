import Phaser from 'phaser';
import type { BoardView } from '../game/boardCells';
import { COLUMN_LABELS, ROW_LABELS } from '../game/coordLabel';
import { theme } from '../theme';
import { cellCenter, layout, type GridLayout } from './boardLayout';
import { drawCell } from './drawCell';
import { drawPeg } from './drawPeg';
import { drawShip } from './drawShip';

/**
 * One titled 10×10 grid with A–J / 1–10 labels, ship shapes and pegs.
 * Returns a container so the scene can destroy and redraw it when state changes.
 */
export function drawGrid(
  scene: Phaser.Scene,
  grid: GridLayout,
  title: string,
  board: BoardView,
): Phaser.GameObjects.Container {
  const { colors, fonts } = theme;
  const labelStyle = { fontFamily: fonts.family, fontSize: fonts.labelSize, color: colors.label };
  const objects: Phaser.GameObjects.GameObject[] = [];

  objects.push(
    scene.add.text(grid.originX, grid.titleY, title, {
      fontFamily: fonts.family,
      fontSize: fonts.sectionTitleSize,
      color: colors.sectionTitle,
    }),
  );

  const labelCenterOffset = layout.labelGutter / 2;
  COLUMN_LABELS.forEach((label, col) => {
    const { x } = cellCenter(grid, { row: 0, col });
    objects.push(scene.add.text(x, grid.originY - labelCenterOffset, label, labelStyle).setOrigin(0.5));
  });
  ROW_LABELS.forEach((label, row) => {
    const { y } = cellCenter(grid, { row, col: 0 });
    objects.push(scene.add.text(grid.originX - labelCenterOffset, y, label, labelStyle).setOrigin(0.5));
  });

  // Draw order matters: water, then ships, then pegs on top.
  board.cells.forEach((cells, row) =>
    cells.forEach((_, col) => objects.push(drawCell(scene, grid, { row, col }))),
  );
  for (const { ship, sunk } of board.ships) objects.push(drawShip(scene, grid, ship, sunk));
  board.cells.forEach((cells, row) =>
    cells.forEach((cell, col) => {
      if (cell.peg !== 'none') objects.push(drawPeg(scene, grid, { row, col }, cell.peg));
    }),
  );

  return scene.add.container(0, 0, objects);
}
