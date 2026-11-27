import { describe, expect, it } from 'vitest';
import { PlayerViewSchema } from '../schemas/playerView';
import { BOARD_SIZE } from './constants';
import { DEMO_VIEW } from './demoView';
import { FLEET, shipCells } from './fleet';
import { isSunk } from './sunk';

describe('DEMO_VIEW', () => {
  it('is a valid PlayerView', () => {
    expect(PlayerViewSchema.safeParse(DEMO_VIEW).success).toBe(true);
  });

  it('has the full fleet, all in bounds', () => {
    expect(DEMO_VIEW.fleet.map((s) => s.name).sort()).toEqual(FLEET.map((s) => s.name).sort());
    const cells = [...DEMO_VIEW.fleet, ...DEMO_VIEW.sunkEnemyShips].flatMap(shipCells);
    expect(cells.every((c) => c.row < BOARD_SIZE && c.col < BOARD_SIZE)).toBe(true);
  });

  it('shows one sunk own ship and only sunk enemy ships', () => {
    expect(DEMO_VIEW.fleet.filter((s) => isSunk(s, DEMO_VIEW.incomingShots)).map((s) => s.name)).toEqual([
      'Destroyer',
    ]);
    expect(DEMO_VIEW.sunkEnemyShips.every((s) => isSunk(s, DEMO_VIEW.outgoingShots))).toBe(true);
  });
});
