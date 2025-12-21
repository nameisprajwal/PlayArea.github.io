# React 2048 — Conversion Notes & How to run

This folder contains a functional React port of the original vanilla JS 2048 game in this repository. The implementation focuses on extracting pure logic into a reusable hook and providing responsive UI components.

How to run

1. cd react-2048
2. npm install
3. npm run dev

Files added
- `src/hooks/useGame.js` — game logic, state, input handling (keyboard + touch), generation & moves.
- `src/components/*` — `Board`, `Tile`, `Score` components.
- `src/App.jsx` — top level app wiring and listeners.
- `src/styles.css` — responsive CSS using CSS Grid.

Key refactors and decisions
- State: `useGame` exposes `board`, `score`, `result` and actions (`move`, `restart`). The hook keeps state in React `useState` and manages initialization.
- Pure logic: row-sliding and combine logic isolated in helper `slideAndCombineRow` and used by move functions.
- Input handling: keyboard event is registered in `App` via `useEffect`; touch handlers are attached to the app container for swipe support.
- Rendering: tiles display values and use CSS classes for colors; no inline styles on frequent updates.

Next steps
- Add unit tests for `useGame` logic (Jest/Vitest).
- Improve animations and transitions for tile movement.
- Persist game state to `localStorage`.
