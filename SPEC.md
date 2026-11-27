# Battleship — Game Spec

> **Source of truth for features.** If code and this spec disagree, the spec wins until the spec is updated. Change this file first, then the code.

## 1. Overview

A two-player guessing game. Each player secretly places a fleet of five ships on their own 10×10 grid, then players take turns calling coordinates to sink the opponent's ships. The first player to sink the entire enemy fleet wins.

This is a rebuild of the earlier [simple-battleship](https://github.com/savagesnake/simple-battleship) experiment (a 1-D, single-ship, `prompt()`-based prototype) as a full 10×10 browser game.

**Goal for v1:** simple, correct, playable. Visuals are intentionally plain and must be easy to restyle later (see §8).

## 2. Game modes

| Mode | Status | Description |
|---|---|---|
| **vs Computer** | **v1** | One human against a computer opponent. |
| **vs Player (online)** | Planned, after v1 | Two humans, each on their own device, joined by a room code or link. Not built in v1. |

- Hot-seat (two players sharing one device) is dropped. vs Player will be online instead.
- The main menu lists vs Player as a disabled option labelled "Coming soon"; selecting it does nothing. No other vs Player UI is built in v1.
- The game logic must still be structured so online play can be added later without rewriting `src/game/` (see §9.1).

## 3. Board

- Each player has two 10×10 grids:
  - **Ocean grid (lower section):** the player's own fleet, plus pegs for the opponent's shots against it.
  - **Target grid (upper section):** tracks the player's own shots at the opponent. Enemy ships are never shown here unless sunk (see §5.3).
- Columns are labelled **A–J**, rows **1–10**. A coordinate is written like `B7`.
- Internally, cells use zero-based `{ row: 0–9, col: 0–9 }`.

## 4. Fleet and placement

### 4.1 Fleet

| Ship | Length |
|---|---|
| Carrier | 5 |
| Battleship | 4 |
| Cruiser | 3 |
| Submarine | 3 |
| Destroyer | 2 |

Total: 17 cells per fleet.

### 4.2 Placement rules

- Ships are placed **horizontally or vertically** (no diagonals).
- Ships must fit entirely on the grid.
- Ships **may not overlap**. Ships may touch each other.
- Placement is secret: the opponent never sees it.

### 4.3 Placement UI

- Player selects a ship, hovers to preview it on the ocean grid, presses **R** (or a Rotate button) to toggle orientation, and clicks to place.
- Invalid placements show a red/invalid preview and cannot be confirmed.
- A **Randomize** button places the whole fleet randomly (valid placement guaranteed).
- A **Reset** button clears the board.
- **Ready** is enabled only when all five ships are placed.
- The computer always places its fleet randomly.

## 5. Turns and shooting

### 5.1 Turn order

- The human shoots first.
- **A turn is exactly one shot, whether it hits or misses.** Then the turn passes to the opponent.
- A player cannot shoot a cell they have already shot. Clicking it does nothing and does not use the turn.

### 5.2 Shot results

| Result | Announcement | Shooter's target grid | Defender's ocean grid |
|---|---|---|---|
| **Miss** | "Miss" | White peg on that cell | White peg on that cell |
| **Hit** | "Hit — *ship name*" (e.g. "Hit — Cruiser") | Red peg on that cell | Red peg on the ship's hole |
| **Sunk** | "You sank my *ship name*!" | Red pegs; the sunk ship's outline is revealed | Ship is marked as sunk |

- A ship is **sunk** when every one of its cells has a red peg. The owner announces it (shown as a message to both players).
- The announcement is shown in a status/message area and stays visible until the next shot.

### 5.3 Win condition

- When all five of a player's ships are sunk, the opponent wins immediately.
- The game-over screen shows the winner and simple stats: shots taken, hits, and accuracy (`hits / shots`), echoing the original prototype's accuracy rating.
- Options: **Play again** (same mode) or **Main menu**.

## 6. Computer opponent

- v1 uses a simple **hunt / target** strategy:
  - **Hunt:** fire at a random cell not yet shot.
  - **Target:** after a hit on a ship that isn't sunk, try orthogonal neighbours of the hit cells until the ship is sunk, then go back to hunting.
- The computer never shoots the same cell twice and never peeks at the human's fleet.
- A short delay (~600 ms) before the computer fires, so the human can follow the play.
- The AI must be a pure function of (its own shot history, results) plus an injectable random source, so it can be unit-tested deterministically.

## 7. Screens / flow

1. **Main menu** — title, a *vs Computer* button that starts Placement, and a disabled *vs Player — Coming soon* option (see §2).
2. **Placement** — the human places their fleet; the computer places its fleet randomly.
3. **Battle** — target grid on top, ocean grid below, status message area, whose-turn indicator.
4. **Game over** — winner, stats, Play again / Main menu.

## 8. Visuals and theming

v1 visuals are deliberately minimal: flat coloured rectangles for cells and ships, circles for pegs, system font for text. No art assets are required.

To keep restyling cheap later:

- **All colours, sizes, fonts, spacing, and timings live in one theme file** (e.g. `src/theme.ts`). No hard-coded colours or pixel sizes in scenes or game logic.
- Rendering goes through small view helpers (e.g. `drawCell`, `drawPeg`, `drawShip`) so swapping rectangles for sprites later touches only those helpers.
- Board layout (cell size, grid offsets) is computed from theme values, so changing cell size reflows the layout.
- Game logic never imports Phaser. Scenes read state and render it; they don't own the rules.

Default v1 palette (placeholder, to be replaced):

| Token | Use |
|---|---|
| `water` | empty cell |
| `gridLine` | cell borders |
| `ship` | own ship cells |
| `shipSunk` | sunk ship cells / outline |
| `pegHit` | red peg |
| `pegMiss` | white peg |
| `previewValid` / `previewInvalid` | placement preview |

## 9. Architecture (summary)

- **`src/game/`** — pure TypeScript game logic, no Phaser: board model, placement validation, shot resolution, sunk/win detection, AI.
- **`src/schemas/`** — Zod schemas for core data (coordinate, ship, placement, shot, game state). Used to validate state at boundaries (e.g. loading saved state, debug input).
- **`src/scenes/`** — Phaser scenes: `Menu`, `Placement`, `Battle`, `GameOver`.
- **`src/theme.ts`** — visual tokens (§8).
- **`src/view/`** — the only code that draws: `drawGrid`, `drawCell`, `drawShip`, `drawPeg`, `drawButton`. `boardLayout.ts` computes all positions (grid origins, cell ↔ pixel) from theme tokens.
- **Board views** — `oceanBoard(view)` and `targetBoard(view)` in `src/game/boardCells.ts` turn a player's view into per-cell state and ship shapes; the target grid only ever includes sunk enemy ships.
- State changes go through pure functions like `placeShip(board, ship) → board | error` and `fireShot(state, coord) → { state, result }`.

### 9.1 Online-ready state

v1 is vs Computer only, but the state model must let online vs Player (§2) reuse `src/game/` unchanged:

- **Per-player state.** Each player's fleet and shots live in a separate `PlayerState`, not in one shared board.
- **Per-player view.** A pure `viewFor(state, player)` returns only what that player may see: their own fleet, their own shots, hits and misses against them, and enemy ships once sunk. Scenes render this view, never the raw game state.
- **Moves as actions.** Player moves are serializable actions defined as Zod schemas (`placeFleet`, `fire`) and applied by one pure `applyAction(state, action) → { state, result } | error`. The computer opponent submits its moves through the same path as the human.

## 10. Tech stack

| Purpose | Choice |
|---|---|
| Language | TypeScript (strict) |
| Game framework | Phaser |
| Build / dev server | Vite |
| Schemas / validation | Zod |
| Unit tests | Vitest |
| Hosting | Vercel (static build from `dist/`) |

Anything beyond this list needs a clear reason and approval first (see CLAUDE.md).

## 11. Testing requirements

- Unit tests for every Zod schema (valid and invalid examples).
- Unit tests for every pure helper in `src/game/`, at minimum:
  - placement: in-bounds, overlap, orientation, random fleet is always valid
  - shooting: miss, hit (names ship), sunk, repeat shot rejected
  - turn passing after every shot
  - win detection
  - AI: never repeats a cell; targets neighbours after a hit (seeded random)
  - `viewFor`: never exposes enemy ship positions until that ship is sunk
  - `applyAction`: rejects a shot out of turn, a repeat shot, and any action after game over
- Action schemas (`placeFleet`, `fire`): valid and invalid examples.
- Phaser scenes are not unit-tested in v1; check them by playing.

## 12. Out of scope for v1

Online multiplayer (planned after v1, see §2), hot-seat / same-device two-player, accounts, sound/music, animations beyond simple feedback, custom grid sizes or fleets, "salvo" or other variant rules, mobile-specific layouts (should still be usable with a mouse/touch on a reasonably sized screen), persistence between sessions.

## 13. Open questions

- Should the computer have difficulty levels (e.g. Easy = pure random, Normal = hunt/target)?
- Which transport for online vs Player: a hosted realtime service, peer-to-peer WebRTC, or our own server? Decide before that work starts; it needs approval as a new dependency or service.
- Keyboard-only shooting (type `B7`) in addition to clicking?
