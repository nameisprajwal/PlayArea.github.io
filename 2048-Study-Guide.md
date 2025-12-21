**2048 Project — Study Guide & Patterns**

This document collects the concepts, patterns, and practical advice discussed while improving and refactoring the 2048 implementation in this repository. Use it as study material or a migration checklist when converting the game to frameworks (React / Angular) or improving plain JS code.

**Overview**
- Goal: make the game robust, maintainable, testable, and mobile-friendly.
- Focus areas: input handling (keyboard + touch), state management, scoping & strict mode, DOM updates, responsive styling, modularization, and performance.

**1) JavaScript strict mode & scope**
- Strict mode: enable with `"use strict"` at file or function top. It prevents accidental globals, disallows duplicate params, changes `this` behavior, and makes many silent failures throw.
- Declarations: always use `const` / `let` / `var` intentionally. Assigning to an undeclared name creates an implicit global in non-strict mode (risky).
- Scope rules: `let`/`const` are block-scoped; `function` declarations are function-scoped and hoisted. Calling a function before its declaration is okay (declaration hoisting), but calling it before dependent `const` or `let` values are created will fail.

Example problem and fix:
```
// BAD (creates global `randomNumber` in non-strict mode)
function generate(){
  randomNumber = Math.floor(Math.random()*squares.length)
}

// GOOD
function generate(){
  const randomNumber = Math.floor(Math.random()*squares.length)
}
```

**2) Event listeners, handlers, and additional parameters**
- Browsers call listener with the event object as the first argument. `addEventListener('keyup', control)` means `control(event)`.
- To pass extra params, wrap or bind the handler and keep a reference to the wrapper so `removeEventListener` can remove it later.

Patterns:
- Wrapper (recommended):
```
const handler = e => control(e, extra1, extra2)
document.addEventListener('keyup', handler)
// remove with same handler reference
document.removeEventListener('keyup', handler)
```
- Bind (prepends args):
```
const bound = control.bind(null, extra1, extra2)
// control signature must expect (extra1, extra2, event)
document.addEventListener('keyup', bound)
```

Avoid passing arbitrary extra arguments directly into `addEventListener` — the third arg is `options` (capture/passive/once).

**3) Touch & swipe support (mobile)**
- Listen for `touchstart`, `touchmove`, `touchend` on `document` or game container. Compute delta between start and end points, apply a threshold, and map longest axis to a move (left/right/up/down).
- Use `e.preventDefault()` in `touchmove` if you want to stop page scrolling while swiping on the game area, but set `{ passive: false }` on the listener.
- Add `touch-action: none` via CSS on the relevant container (or `document.body.style.touchAction = 'none'`) so the browser doesn't intercept gestures.

Simple swipe detection:
```
let startX, startY, endX, endY
document.addEventListener('touchstart', e => { const t = e.changedTouches[0]; startX=t.clientX; startY=t.clientY }, {passive:true})
document.addEventListener('touchend', () => { /* compute dx/dy, threshold, decide */ })
```

**4) State management: primitives vs objects**
- Primitives (numbers/strings) are passed by value. If you pass `let score = 0` into functions, updates to that parameter won't persist outside the function.
- Use a shared mutable object for state (e.g., `const state = { score: 0 }`) or manage state in a class/service so all functions update the same object reference.

Example fix (score persisted):
```
const state = { score: 0 }
function combineRow(..., state){ state.score += combinedTotal }
```

**5) Extracting logic: pure functions & modularization**
- Separate pure game logic (array transforms, move/merge/generate checks) from DOM rendering and event wiring.
- Pure functions are much easier to unit-test. Example: implement `moveLeft(boardArray, size)` returning a new board state or mutating a passed array.
- Packaging options:
  - ES modules: `export` logic from `gameLogic.js`, import in UI file.
  - Class/service: create `class Game { constructor(size){...} moveLeft(){...} }` and expose a minimal public API (`start`, `stop`, `reset`).

Example module pattern:
```
// gameLogic.js
export function createEmptyBoard(size){ return Array(size*size).fill(0) }
export function moveLeft(board,size){ /* pure */ }

// main.js
import { createEmptyBoard, moveLeft } from './gameLogic.js'
```

**6) Returning values vs side effects**
- Prefer returning boolean / result values from logic functions and perform DOM side-effects at call-site. Example: `isGameOver(board)` should return `true|false`. The caller decides how to show the message and clean up listeners.
- This separation makes logic testable and UI code responsible for rendering.

Refactor example:
```
function checkForGameOver(board, size){
  // return true if no moves left
}

if (checkForGameOver(board, size)) {
  resultDisplay.textContent = 'You LOSE'
  removeListeners()
}
```

**7) Rendering & performance**
- Avoid updating DOM on a tight `setInterval` (e.g., every 50ms) unless necessary. Instead, update colors / classes only when board state changes (after moves or tile generation).
- Prefer toggling CSS classes or data attributes instead of writing inline styles for each tile on every frame.
- Batch DOM writes and reads to avoid layout thrashing; prefer computing new values in JS then apply them in one pass or use `requestAnimationFrame` for visual updates.

Color mapping refactor:
```
const tileColors = { 0: 'empty', 2: 't2', 4: 't4', 8: 't8', ... }
tiles.forEach((tile,i) => {
  const val = parseInt(tile.textContent)
  tile.className = 'tile ' + tileColors[val]
})
```

**8) Layout & responsive CSS**
- Original approach used fixed container `width:456px` and `tile:100px + 7px margin` math to fill the grid. This is brittle for mobile.
- Use CSS Grid with `grid-template-columns: repeat(4, 1fr); gap: 7px; width: min(92vw, 456px)` and `aspect-ratio: 1 / 1` on tiles for responsive scaling.

Responsive sample:
```
.grid{ display:grid; grid-template-columns:repeat(4,1fr); gap:7px; width:min(92vw,456px) }
.grid div{ aspect-ratio:1/1; font-size:calc(5vw + 8px) }
```

**9) Refactor checklist when migrating to frameworks**
- Extract pure logic into `gameLogic.js` (functions: `createBoard`, `generate`, `moveLeft`, `moveRight`, `moveUp`, `moveDown`, `combineRow`, `combineColumn`, `checkForWin`, `checkForGameOver`). Unit-test these functions.
- Create UI components: `Board`, `Tile`, `Score`, `Controls` (React) or Angular equivalents.
- Centralize state: React `useState`/`useReducer` or Angular `GameService` with `BehaviorSubject`.
- Move event handling to top-level component and ensure touch handling is global or delegated.

**10) Testing & deployment**
- Unit test pure game logic with Jest or similar. Test edge cases: full board, merge chains, multiple merges in a move, generation randomness.
- For deployment choose static hosting: GitHub Pages, Netlify, Vercel.

**11) Practical tips & gotchas**
- Keep a single authoritative `width` / `size` variable and avoid hard-coded `4`/`16` in multiple places.
- When removing listeners, ensure you call `removeEventListener` with the same function reference passed to `addEventListener`.
- Use `textContent` instead of `innerHTML` for plain text to avoid parsing overhead and XSS vectors.
- Prefer `===` for comparisons and use `parseInt` only when you expect strings containing numbers.
- Avoid `setInterval(addColours, 50)` — instead call `updateUI()` after any state change.

**12) Example small refactor summary (implemented earlier in repo)**
- Replaced accidental implicit globals (`square`, `randomNumber`) with local declarations.
- Enabled strict mode at top of file.
- Introduced `state = { score: 0 }` and passed it to functions that update score so the score persists across calls.
- Moved touch listeners to document-level and used wrapper handler so swipes anywhere work.

**Next steps & exercises**
- Refactor `move*` and `combine*` functions into pure functions that accept and return board arrays. Unit test them.
- Replace inline style color mapping with CSS classes and remove the `setInterval` polling.
- Convert to ES modules and split logic (`gameLogic.js`) from UI (`app.js`). Then scaffold React/Vite or Angular project and move logic into a service/class.

References & further reading
- MDN: addEventListener / Touch events / CSS Grid
- Clean Code & refactoring resources for JS patterns


