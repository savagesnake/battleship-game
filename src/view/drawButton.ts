import Phaser from 'phaser';
import { theme } from '../theme';

export interface ButtonOptions {
  x: number;
  y: number;
  label: string;
  enabled: boolean;
  /** Small secondary line under the label, e.g. "Coming soon". */
  badge?: string | undefined;
  onClick?: (() => void) | undefined;
  /** 'small' for the compact placement buttons. */
  size?: 'normal' | 'small' | undefined;
}

/** Flat rectangle button. Disabled buttons are not interactive at all, so they can't feel half-working. */
export function drawButton(scene: Phaser.Scene, options: ButtonOptions): Phaser.GameObjects.Container {
  const { x, y, label, enabled, badge, onClick, size = 'normal' } = options;
  const { colors, sizes, fonts } = theme;
  const width = size === 'small' ? sizes.smallButtonWidth : sizes.buttonWidth;
  const height = size === 'small' ? sizes.smallButtonHeight : sizes.buttonHeight;

  const background = scene.add.rectangle(
    0,
    0,
    width,
    height,
    enabled ? colors.buttonFill : colors.buttonFillDisabled,
  );

  const labelText = scene.add
    .text(0, 0, label, {
      fontFamily: fonts.family,
      fontSize: fonts.buttonSize,
      color: enabled ? colors.buttonText : colors.buttonTextDisabled,
    })
    .setOrigin(0.5);

  const children: Phaser.GameObjects.GameObject[] = [background, labelText];

  if (badge !== undefined) {
    const badgeText = scene.add
      .text(0, 0, badge, {
        fontFamily: fonts.family,
        fontSize: fonts.badgeSize,
        color: colors.badge,
      })
      .setOrigin(0.5, 0);
    // Stack label and badge as one block, centred vertically in the button.
    const blockHeight = labelText.height + badgeText.height;
    labelText.setY(-blockHeight / 2 + labelText.height / 2);
    badgeText.setY(labelText.y + labelText.height / 2);
    children.push(badgeText);
  }

  if (enabled) {
    background.setInteractive({ useHandCursor: true });
    background.on('pointerover', () => background.setFillStyle(colors.buttonFillHover));
    background.on('pointerout', () => background.setFillStyle(colors.buttonFill));
    background.on('pointerup', () => onClick?.());
  }

  return scene.add.container(x, y, children);
}
