import Phaser from 'phaser';
import { SHIP_LENGTH } from '../game/fleet';
import type { ShipName } from '../schemas/ship';
import { theme } from '../theme';
import type { Rect } from './boardLayout';

export type ShipOptionState = 'selected' | 'available' | 'placed';

/** One row of the ship picker: name on the left, one square per cell of length on the right. */
export function drawShipOption(
  scene: Phaser.Scene,
  row: Rect,
  name: ShipName,
  state: ShipOptionState,
  onClick: () => void,
): Phaser.GameObjects.Container {
  const { colors, sizes, fonts } = theme;
  const fill = { selected: colors.pickerSelected, available: colors.pickerAvailable, placed: colors.pickerPlaced }[state];
  const inset = sizes.pickerRowInset;
  const midY = row.y + row.height / 2;

  const background = scene.add
    .rectangle(row.x, row.y + inset, row.width, row.height - inset * 2, fill)
    .setOrigin(0)
    .setInteractive({ useHandCursor: true });
  background.on('pointerup', onClick);

  const label = scene.add
    .text(row.x + sizes.pickerPadding, midY, state === 'placed' ? `${name} — placed` : name, {
      fontFamily: fonts.family,
      fontSize: fonts.labelSize,
      color: state === 'placed' ? colors.pickerTextPlaced : colors.pickerText,
    })
    .setOrigin(0, 0.5);

  const length = SHIP_LENGTH[name];
  const step = sizes.pickerSquareSize + sizes.pickerSquareGap;
  const squaresLeft = row.x + row.width - sizes.pickerPadding - length * step + sizes.pickerSquareGap;
  const squares = Array.from({ length }, (_, i) =>
    scene.add
      .rectangle(squaresLeft + i * step, midY, sizes.pickerSquareSize, sizes.pickerSquareSize, colors.ship)
      .setOrigin(0, 0.5)
      .setAlpha(state === 'placed' ? sizes.placedAlpha : 1),
  );

  return scene.add.container(0, 0, [background, label, ...squares]);
}
