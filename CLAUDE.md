# CLAUDE.md

Guidance for Claude (and humans) working in this repo.

## Project

Browser Battleship game. Web-first, built with **TypeScript + Phaser**, hosted on **Vercel**.

## Source of truth

- **`SPEC.md` is the source of truth for features and rules.** Read it before starting any feature.
- If a request conflicts with `SPEC.md`, point it out and ask before proceeding.
- When a feature changes, update `SPEC.md` in the same change as the code.
- Don't build features that aren't in `SPEC.md` (see its "Out of scope" section).

## Stack

The approved stack is listed in `SPEC.md` §10:

- TypeScript (strict mode)
- Phaser (game framework / rendering)
- Vite (dev server and build)
- Zod (schemas and validation)
- Vitest (unit tests)
- Vercel (hosting, static deploy of `dist/`)

### Dependencies rule

**Don't add packages beyond the stack in `SPEC.md` without a clear reason and asking first.** When asking, say what the package does, why the existing stack can't reasonably do it, and its size/maintenance status. This applies to dev dependencies too.

## Commands

<!-- Fill in once the project is scaffolded. Suggested: -->

```bash
npm install          # install dependencies
npm run dev          # start Vite dev server
npm run build        # type-check and build to dist/
npm run preview      # serve the production build locally
npm test             # run Vitest once
npm run test:watch   # run Vitest in watch mode
npm run typecheck    # tsc --noEmit
```

## Project structure

```
src/
  main.ts          # Phaser game config and boot
  theme.ts         # ALL colours, sizes, fonts, spacing, timings
  game/            # pure game logic — NO Phaser imports
  schemas/         # Zod schemas + inferred types
  scenes/          # Phaser scenes (Menu, Placement, PassDevice, Battle, GameOver)
  view/            # small render helpers (drawCell, drawPeg, drawShip, ...)
tests/             # or co-located *.test.ts next to the code
public/            # static assets (none required for v1)
```

## Architecture rules

- **Keep game logic pure.** Everything in `src/game/` is plain TypeScript: no Phaser, no DOM, no globals, no `Math.random()` called directly (inject a random source so tests can seed it).
- Functions return new state rather than mutating, e.g. `fireShot(state, coord) → { state, result }`.
- **Scenes render state; they don't own rules.** A scene calls game functions and draws the result.
- **Zod schemas are the single definition of core data shapes.** Derive TypeScript types with `z.infer<>` instead of writing parallel interfaces.
- Validate with Zod at boundaries (loading state, external/debug input), not on every internal call.

## Visuals

- v1 visuals are intentionally simple (flat shapes, no art assets). The goal is easy restyling later.
- **No hard-coded colours, sizes, or fonts outside `src/theme.ts`.**
- Drawing goes through `src/view/` helpers so shapes can later be swapped for sprites in one place.
- Layout is derived from theme values (cell size, gaps), not magic numbers.

## Testing

- **Unit-test every Zod schema** with valid and invalid examples.
- **Unit-test every pure helper** in `src/game/` (placement, shooting, sunk/win detection, turn passing, AI). See `SPEC.md` §11 for the minimum cases.
- Use seeded/injected randomness for anything random.
- Phaser scenes aren't unit-tested; verify them by running the game.
- Run `npm test` and `npm run typecheck` before considering a change done.

## Code style

- TypeScript `strict: true`; avoid `any` (use `unknown` + Zod parsing if needed).
- Small, focused modules; named exports.
- Prefer clear names over comments; comment the *why*, not the *what*.

## Deployment (Vercel)

- Framework preset: **Vite**. Build command `npm run build`, output directory `dist`.
- No server code or environment variables are needed for v1.
- Every push to a branch gets a preview deploy; `main` deploys to production.

## Working agreements

- Keep changes small and focused on one feature or fix.
- Ask before adding dependencies, changing the stack, or deviating from `SPEC.md`.
- Don't commit build output (`dist/`) or `node_modules/`.
