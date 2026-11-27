import Phaser from 'phaser';
import { oceanBoard, startingView } from '../game/boardCells';
import { FLEET } from '../game/fleet';
import { randomFleet, type PlacementError } from '../game/placement';
import {
  initialPlacement,
  isReady,
  placeAt,
  previewAt,
  randomizePlacement,
  resetPlacement,
  rotate,
  selectShip,
  type PlacementState,
} from '../game/placementState';
import type { Coord } from '../schemas/coord';
import { GameModeSchema, type GameMode } from '../schemas/gameMode';
import type { GameSetup } from '../schemas/gameSetup';
import { theme } from '../theme';
import { cellAt, placementLayout } from '../view/boardLayout';
import { drawButton } from '../view/drawButton';
import { drawGrid } from '../view/drawGrid';
import { drawPreview } from '../view/drawPreview';
import { drawShipOption, type ShipOptionState } from '../view/drawShipOption';

const HINT_DEFAULT = 'Select a ship · R to rotate · click to place';
const HINT_ALL_PLACED = 'All ships placed — press Ready';
const ERROR_HINTS: Record<PlacementError, string> = {
  'out-of-bounds': "Doesn't fit on the board",
  overlap: 'Overlaps another ship',
  'already-placed': 'That ship is already placed',
};

// Placement screen (SPEC §4.3). Rules live in game/placementState; this scene renders and forwards input.
export class PlacementScene extends Phaser.Scene {
  private mode: GameMode = 'vsComputer';
  private state: PlacementState = initialPlacement();
  private hint = HINT_DEFAULT;
  private hintIsError = false;
  private hovered: Coord | null = null;
  private staticLayer: Phaser.GameObjects.Container | null = null;
  private previewLayer: Phaser.GameObjects.Container | null = null;

  constructor() {
    super('Placement');
  }

  init(data: unknown): void {
    // Scene data is a boundary between scenes, so validate it rather than trust it.
    const parsed = GameModeSchema.safeParse((data as { mode?: unknown } | undefined)?.mode);
    this.mode = parsed.success ? parsed.data : 'vsComputer';
    // The scene object is reused between visits, so reset everything here.
    this.state = initialPlacement();
    this.hovered = null;
    this.setHint(null);
  }

  create(): void {
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.hovered = cellAt(placementLayout.grid, pointer.x, pointer.y);
      this.redrawPreview();
    });
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      const coord = cellAt(placementLayout.grid, pointer.x, pointer.y);
      if (coord) this.onGridClick(coord);
    });
    this.input.keyboard?.on('keydown-R', () => this.applyState(rotate(this.state)));
    this.redraw();
  }

  private onGridClick(coord: Coord): void {
    const { state, error } = placeAt(this.state, coord);
    this.applyState(state, error);
  }

  private applyState(state: PlacementState, error: PlacementError | null = null): void {
    this.state = state;
    this.setHint(error);
    this.redraw();
  }

  private setHint(error: PlacementError | null): void {
    this.hintIsError = error !== null;
    if (error) this.hint = ERROR_HINTS[error];
    else this.hint = isReady(this.state) ? HINT_ALL_PLACED : HINT_DEFAULT;
  }

  private redraw(): void {
    this.staticLayer?.destroy();
    const { grid, pickerRows, buttons, hint } = placementLayout;
    const objects: Phaser.GameObjects.GameObject[] = [];

    objects.push(drawGrid(this, grid, 'Place your fleet', oceanBoard(startingView(this.state.fleet))));

    FLEET.forEach(({ name }, i) => {
      const row = pickerRows[i];
      if (!row) return;
      const placed = this.state.fleet.some((ship) => ship.name === name);
      const look: ShipOptionState = this.state.selected === name ? 'selected' : placed ? 'placed' : 'available';
      objects.push(drawShipOption(this, row, name, look, () => this.applyState(selectShip(this.state, name))));
    });

    objects.push(
      drawButton(this, {
        ...buttons.rotate,
        size: 'small',
        label: `Rotate (${this.state.orientation === 'horizontal' ? '↔' : '↕'})`,
        enabled: true,
        onClick: () => this.applyState(rotate(this.state)),
      }),
      drawButton(this, {
        ...buttons.randomize,
        size: 'small',
        label: 'Randomize',
        enabled: true,
        onClick: () => this.applyState(randomizePlacement(this.state, Math.random)),
      }),
      drawButton(this, {
        ...buttons.reset,
        size: 'small',
        label: 'Reset',
        enabled: true,
        onClick: () => this.applyState(resetPlacement()),
      }),
      drawButton(this, {
        ...buttons.ready,
        size: 'small',
        label: 'Ready',
        enabled: isReady(this.state),
        onClick: () => this.startBattle(),
      }),
    );

    objects.push(
      this.add
        .text(hint.x, hint.y, this.hint, {
          fontFamily: theme.fonts.family,
          fontSize: theme.fonts.labelSize,
          color: this.hintIsError ? theme.colors.hintError : theme.colors.hint,
        })
        .setOrigin(0.5),
    );

    this.staticLayer = this.add.container(0, 0, objects);
    this.redrawPreview();
  }

  private redrawPreview(): void {
    this.previewLayer?.destroy();
    this.previewLayer = null;
    if (!this.hovered) return;
    const preview = previewAt(this.state, this.hovered);
    if (preview) this.previewLayer = drawPreview(this, placementLayout.grid, preview);
  }

  private startBattle(): void {
    if (!isReady(this.state)) return;
    const setup: GameSetup = {
      mode: this.mode,
      playerFleet: this.state.fleet,
      // The computer always places randomly (SPEC §4.3); Math.random is injected here at the scene edge.
      computerFleet: randomFleet(Math.random),
    };
    this.scene.start('Battle', { setup });
  }
}
