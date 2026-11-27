import Phaser from 'phaser';
import { GameModeSchema, type GameMode } from '../schemas/gameMode';
import { layout, theme } from '../theme';
import { drawButton } from '../view/drawButton';

// Placeholder so the menu has somewhere to go; the real placement UI is SPEC §4.3.
export class PlacementScene extends Phaser.Scene {
  private mode: GameMode = 'vsComputer';

  constructor() {
    super('Placement');
  }

  init(data: unknown): void {
    // Scene data is a boundary between scenes, so validate it rather than trust it.
    const parsed = GameModeSchema.safeParse((data as { mode?: unknown } | undefined)?.mode);
    if (!parsed.success) {
      this.scene.start('Menu');
      return;
    }
    this.mode = parsed.data;
  }

  create(): void {
    const { fonts, colors, sizes, spacing } = theme;
    const centerX = layout.width / 2;
    const centerY = layout.height / 2;

    this.add
      .text(centerX, centerY - sizes.buttonHeight, 'Placement — coming next', {
        fontFamily: fonts.family,
        fontSize: fonts.bodySize,
        color: colors.text,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, centerY - sizes.buttonHeight + spacing.margin, `Mode: ${this.mode}`, {
        fontFamily: fonts.family,
        fontSize: fonts.labelSize,
        color: colors.textMuted,
      })
      .setOrigin(0.5);

    drawButton(this, {
      x: centerX,
      y: centerY + sizes.buttonHeight,
      label: 'Back to menu',
      enabled: true,
      onClick: () => this.scene.start('Menu'),
    });
  }
}
