import Phaser from 'phaser';
import { oceanBoard, targetBoard } from '../game/boardCells';
import { PlayerViewSchema, type PlayerView } from '../schemas/playerView';
import { theme } from '../theme';
import { layout } from '../view/boardLayout';
import { drawGrid } from '../view/drawGrid';

// Renders one player's view (SPEC §3, §9.1). Firing (§5) is not wired up yet.
export class BattleScene extends Phaser.Scene {
  private view: PlayerView | null = null;

  constructor() {
    super('Battle');
  }

  init(data: unknown): void {
    // Scene data is a boundary between scenes, so validate it rather than trust it.
    const parsed = PlayerViewSchema.safeParse((data as { view?: unknown } | undefined)?.view);
    this.view = parsed.success ? parsed.data : null;
  }

  create(): void {
    if (!this.view) {
      this.scene.start('Menu');
      return;
    }

    drawGrid(this, layout.target, 'Target', targetBoard(this.view));
    drawGrid(this, layout.ocean, 'Your fleet', oceanBoard(this.view));

    const { status } = layout;
    this.add
      .text(status.x + status.width / 2, status.y + status.height / 2, 'Your turn — demo board', {
        fontFamily: theme.fonts.family,
        fontSize: theme.fonts.bodySize,
        color: theme.colors.text,
      })
      .setOrigin(0.5);
  }
}
