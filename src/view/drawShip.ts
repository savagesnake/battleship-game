import Phaser from 'phaser';
import { SHIP_LENGTH } from '../game/fleet';
import type { PlacedShip } from '../schemas/ship';
import { theme } from '../theme';
import { cellTopLeft, type GridLayout } from './boardLayout';

/** One shape for the whole ship, so it can later be swapped for a sprite in one place (SPEC §8). */
export function drawShip(
  scene: Phaser.Scene,
  grid: GridLayout,
  ship: PlacedShip,
  sunk: boolean,
): Phaser.GameObjects.Rectangle {
  const inset = theme.sizes.shipInset;
  const span = SHIP_LENGTH[ship.name] * grid.cellSize;
  const horizontal = ship.orientation === 'horizontal';
  const { x, y } = cellTopLeft(grid, ship.start);
  return scene.add
    .rectangle(
      x + inset,
      y + inset,
      (horizontal ? span : grid.cellSize) - inset * 2,
      (horizontal ? grid.cellSize : span) - inset * 2,
      sunk ? theme.colors.shipSunk : theme.colors.ship,
    )
    .setOrigin(0);
}
