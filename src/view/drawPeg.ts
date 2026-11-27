import Phaser from 'phaser';
import type { Coord } from '../schemas/coord';
import type { ShotResult } from '../schemas/shot';
import { theme } from '../theme';
import { cellCenter, type GridLayout } from './boardLayout';

/** Red peg for a hit, white for a miss (SPEC §5.2). */
export function drawPeg(
  scene: Phaser.Scene,
  grid: GridLayout,
  coord: Coord,
  result: ShotResult,
): Phaser.GameObjects.Arc {
  const { x, y } = cellCenter(grid, coord);
  const color = result === 'hit' ? theme.colors.pegHit : theme.colors.pegMiss;
  return scene.add.circle(x, y, theme.sizes.pegRadius, color);
}
