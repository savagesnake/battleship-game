import Phaser from 'phaser';
import { layout, theme } from '../theme';

// Placeholder that proves Phaser + theme wiring; the real menu (SPEC §7) comes later.
export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    const centerX = layout.width / 2;
    const centerY = layout.height / 2;

    this.add
      .text(centerX, centerY, 'Battleship', {
        fontFamily: theme.fonts.family,
        fontSize: theme.fonts.titleSize,
        color: theme.colors.text,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY + theme.spacing.margin * 2, 'Coming soon', {
        fontFamily: theme.fonts.family,
        fontSize: theme.fonts.bodySize,
        color: theme.colors.textMuted,
      })
      .setOrigin(0.5);
  }
}
