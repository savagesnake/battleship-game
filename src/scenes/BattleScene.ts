import Phaser from 'phaser';
import { oceanBoard, startingView, targetBoard } from '../game/boardCells';
import type { PlacedShip } from '../schemas/ship';
import { GameSetupSchema } from '../schemas/gameSetup';
import type { PlayerView } from '../schemas/playerView';
import { theme } from '../theme';
import { layout } from '../view/boardLayout';
import { drawGrid } from '../view/drawGrid';

// Renders the player's view (SPEC §3, §9.1). Firing (§5) is not wired up yet.
export class BattleScene extends Phaser.Scene {
  private view: PlayerView | null = null;
  /** Kept for §5 (shooting); never drawn, since enemy ships stay hidden until sunk. */
  private computerFleet: PlacedShip[] = [];

  constructor() {
    super('Battle');
  }

  init(data: unknown): void {
    // Scene data is a boundary between scenes, so validate it rather than trust it.
    const parsed = GameSetupSchema.safeParse((data as { setup?: unknown } | undefined)?.setup);
    this.view = parsed.success ? startingView(parsed.data.playerFleet) : null;
    this.computerFleet = parsed.success ? parsed.data.computerFleet : [];
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
      .text(status.x + status.width / 2, status.y + status.height / 2, 'Your turn — firing comes next', {
        fontFamily: theme.fonts.family,
        fontSize: theme.fonts.bodySize,
        color: theme.colors.text,
      })
      .setOrigin(0.5);
  }
}
