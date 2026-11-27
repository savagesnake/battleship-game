import Phaser from 'phaser';
import { GAME_MODES } from '../game/modes';
import { theme } from '../theme';
import { layout } from '../view/boardLayout';
import { drawButton } from '../view/drawButton';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    const { sizes, spacing, fonts, colors } = theme;
    const centerX = layout.width / 2;

    const buttonsHeight =
      GAME_MODES.length * sizes.buttonHeight + (GAME_MODES.length - 1) * spacing.buttonGap;
    const title = this.add
      .text(centerX, 0, 'Battleship', {
        fontFamily: fonts.family,
        fontSize: fonts.titleSize,
        color: colors.text,
      })
      .setOrigin(0.5, 0);

    // Centre title + buttons as one block.
    const blockHeight = title.height + spacing.titleGap + buttonsHeight;
    const top = (layout.height - blockHeight) / 2;
    title.setY(top);

    const firstButtonY = top + title.height + spacing.titleGap + sizes.buttonHeight / 2;

    GAME_MODES.forEach((option, index) => {
      drawButton(this, {
        x: centerX,
        y: firstButtonY + index * (sizes.buttonHeight + spacing.buttonGap),
        label: option.label,
        enabled: option.available,
        badge: option.available ? undefined : 'Coming soon',
        onClick: () => this.scene.start('Placement', { mode: option.mode }),
      });
    });
  }
}
