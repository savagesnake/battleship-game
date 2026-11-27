import { describe, expect, it } from 'vitest';
import type { PlayerView } from '../schemas/playerView';
import { oceanBoard, startingView, targetBoard } from './boardCells';

const empty: PlayerView = { fleet: [], incomingShots: [], outgoingShots: [], sunkEnemyShips: [] };

describe('oceanBoard', () => {
  it('is a 10×10 empty grid for an empty view', () => {
    const { cells, ships } = oceanBoard(empty);
    expect(cells).toHaveLength(10);
    expect(cells.every((row) => row.length === 10)).toBe(true);
    expect(cells.flat().every((c) => c.ship === 'none' && c.peg === 'none')).toBe(true);
    expect(ships).toEqual([]);
  });

  it('marks own ship cells afloat and places incoming pegs', () => {
    const { cells, ships } = oceanBoard({
      ...empty,
      fleet: [{ name: 'Cruiser', start: { row: 1, col: 1 }, orientation: 'horizontal' }],
      incomingShots: [
        { coord: { row: 1, col: 2 }, result: 'hit' },
        { coord: { row: 9, col: 9 }, result: 'miss' },
      ],
    });
    expect(cells[1]?.[1]).toEqual({ ship: 'afloat', peg: 'none' });
    expect(cells[1]?.[2]).toEqual({ ship: 'afloat', peg: 'hit' });
    expect(cells[9]?.[9]).toEqual({ ship: 'none', peg: 'miss' });
    expect(ships[0]?.sunk).toBe(false);
  });

  it('marks a fully hit ship as sunk', () => {
    const { cells, ships } = oceanBoard({
      ...empty,
      fleet: [{ name: 'Destroyer', start: { row: 0, col: 0 }, orientation: 'vertical' }],
      incomingShots: [
        { coord: { row: 0, col: 0 }, result: 'hit' },
        { coord: { row: 1, col: 0 }, result: 'hit' },
      ],
    });
    expect(ships[0]?.sunk).toBe(true);
    expect(cells[0]?.[0]?.ship).toBe('sunk');
    expect(cells[1]?.[0]?.ship).toBe('sunk');
  });
});

describe('targetBoard', () => {
  it('never reveals an enemy ship that is not sunk', () => {
    const { cells, ships } = targetBoard({
      ...empty,
      // A hit on an unsunk enemy ship: only the peg is known.
      outgoingShots: [{ coord: { row: 5, col: 5 }, result: 'hit' }],
    });
    expect(ships).toEqual([]);
    expect(cells.flat().every((c) => c.ship === 'none')).toBe(true);
    expect(cells[5]?.[5]?.peg).toBe('hit');
  });

  it('ignores the player’s own fleet', () => {
    const { ships } = targetBoard({
      ...empty,
      fleet: [{ name: 'Carrier', start: { row: 0, col: 0 }, orientation: 'horizontal' }],
    });
    expect(ships).toEqual([]);
  });

  it('reveals sunk enemy ships', () => {
    const sunkShip = { name: 'Destroyer', start: { row: 0, col: 8 }, orientation: 'horizontal' } as const;
    const { cells, ships } = targetBoard({
      ...empty,
      outgoingShots: [
        { coord: { row: 0, col: 8 }, result: 'hit' },
        { coord: { row: 0, col: 9 }, result: 'hit' },
      ],
      sunkEnemyShips: [sunkShip],
    });
    expect(ships).toEqual([{ ship: sunkShip, sunk: true }]);
    expect(cells[0]?.[8]).toEqual({ ship: 'sunk', peg: 'hit' });
    expect(cells[0]?.[9]).toEqual({ ship: 'sunk', peg: 'hit' });
  });
});

describe('startingView', () => {
  it('has the fleet and no shots', () => {
    const fleet = [{ name: 'Carrier', start: { row: 0, col: 0 }, orientation: 'horizontal' } as const];
    expect(startingView(fleet)).toEqual({ fleet, incomingShots: [], outgoingShots: [], sunkEnemyShips: [] });
  });
});
