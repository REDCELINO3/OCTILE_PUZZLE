import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Route, c as Pause, i as Shuffle, l as Copy, n as SkipForward, o as RotateCcw, r as SkipBack, s as Play, u as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-0jzg_X_p.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var GOAL = [
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	0
];
var TILE_FROM_BLANK = {
	up: "down",
	down: "up",
	left: "right",
	right: "left"
};
var BLANK_STEP = {
	up: {
		dr: -1,
		dc: 0
	},
	down: {
		dr: 1,
		dc: 0
	},
	left: {
		dr: 0,
		dc: -1
	},
	right: {
		dr: 0,
		dc: 1
	}
};
var SAMPLES = [
	{
		id: "light",
		label: "Light",
		board: [
			1,
			2,
			3,
			4,
			5,
			6,
			0,
			7,
			8
		]
	},
	{
		id: "twist",
		label: "Twist",
		board: [
			1,
			2,
			3,
			5,
			0,
			6,
			4,
			7,
			8
		]
	},
	{
		id: "far",
		label: "Far",
		board: [
			8,
			6,
			7,
			2,
			5,
			4,
			3,
			0,
			1
		]
	}
];
function isGoal(board) {
	for (let i = 0; i < 9; i++) if (board[i] !== GOAL[i]) return false;
	return true;
}
function inversions(board) {
	const tiles = board.filter((tile) => tile !== 0);
	let count = 0;
	for (let i = 0; i < tiles.length; i++) for (let j = i + 1; j < tiles.length; j++) if (tiles[i] > tiles[j]) count++;
	return count;
}
/** Odd-width board: solvable iff the permutation of the eight tiles is even. */
function isSolvable(board) {
	return inversions(board) % 2 === 0;
}
function manhattan(board) {
	let distance = 0;
	for (let i = 0; i < 9; i++) {
		const tile = board[i];
		if (tile === 0) continue;
		const goal = tile - 1;
		distance += Math.abs((i / 3 | 0) - (goal / 3 | 0)) + Math.abs(i % 3 - goal % 3);
	}
	return distance;
}
function slideBlank(board, dir) {
	const blank = board.indexOf(0);
	const row = blank / 3 | 0;
	const col = blank % 3;
	const { dr, dc } = BLANK_STEP[dir];
	const nextRow = row + dr;
	const nextCol = col + dc;
	if (nextRow < 0 || nextRow > 2 || nextCol < 0 || nextCol > 2) return null;
	const into = nextRow * 3 + nextCol;
	const next = board.slice();
	next[blank] = next[into];
	next[into] = 0;
	return next;
}
function slideTile(board, index) {
	const blank = board.indexOf(0);
	if (index === blank) return null;
	const row = index / 3 | 0;
	const col = index % 3;
	const blankRow = blank / 3 | 0;
	const blankCol = blank % 3;
	if (Math.abs(row - blankRow) + Math.abs(col - blankCol) !== 1) return null;
	const next = board.slice();
	next[blank] = next[index];
	next[index] = 0;
	return next;
}
function swapTiles(board, i, j) {
	const next = board.slice();
	const a = next[i];
	next[i] = next[j];
	next[j] = a;
	return next;
}
function scramble(turns, random = Math.random) {
	let board = GOAL.slice();
	let previousBlank = -1;
	const dirs = [
		"up",
		"down",
		"left",
		"right"
	];
	for (let turn = 0; turn < turns; turn++) {
		const blank = board.indexOf(0);
		const options = dirs.filter((dir) => {
			const moved = slideBlank(board, dir);
			return moved !== null && moved.indexOf(0) !== previousBlank;
		});
		const pool = options.length > 0 ? options : dirs.filter((dir) => slideBlank(board, dir));
		const dir = pool[Math.floor(random() * pool.length)];
		const moved = slideBlank(board, dir);
		if (!moved) continue;
		previousBlank = blank;
		board = moved;
	}
	return board;
}
var MinHeap = class {
	nodes = [];
	get size() {
		return this.nodes.length;
	}
	push(node) {
		const nodes = this.nodes;
		nodes.push(node);
		let index = nodes.length - 1;
		while (index > 0) {
			const parent = index - 1 >> 1;
			if (!outranks(nodes[index], nodes[parent])) break;
			const swap = nodes[index];
			nodes[index] = nodes[parent];
			nodes[parent] = swap;
			index = parent;
		}
	}
	pop() {
		const nodes = this.nodes;
		if (nodes.length === 0) return void 0;
		const top = nodes[0];
		const last = nodes.pop();
		if (nodes.length > 0) {
			nodes[0] = last;
			let index = 0;
			for (;;) {
				const left = index * 2 + 1;
				const right = left + 1;
				let best = index;
				if (left < nodes.length && outranks(nodes[left], nodes[best])) best = left;
				if (right < nodes.length && outranks(nodes[right], nodes[best])) best = right;
				if (best === index) break;
				const swap = nodes[index];
				nodes[index] = nodes[best];
				nodes[best] = swap;
				index = best;
			}
		}
		return top;
	}
};
function outranks(a, b) {
	if (a.f !== b.f) return a.f < b.f;
	if (a.h !== b.h) return a.h < b.h;
	return a.seq < b.seq;
}
function keyOf(board) {
	return board.join("");
}
function boardOf(key) {
	const board = new Array(9);
	for (let i = 0; i < 9; i++) board[i] = Number(key[i]);
	return board;
}
/**
* A* with the Manhattan heuristic. Manhattan is consistent, so the first time
* the goal is dequeued its g-cost is optimal (fewest slides).
*/
function solve(start) {
	const t0 = performance.now();
	const h0 = manhattan(start);
	const inv = inversions(start);
	const base = {
		manhattan: h0,
		inversions: inv,
		boards: [start.slice()],
		moves: [],
		steps: 0,
		expanded: 0,
		generated: 0,
		peakHeap: 0
	};
	if (!isSolvable(start)) return {
		...base,
		solvable: false,
		steps: -1,
		elapsedMs: performance.now() - t0
	};
	const startKey = keyOf(start);
	const goalKey = keyOf(GOAL);
	if (startKey === goalKey) return {
		...base,
		solvable: true,
		elapsedMs: performance.now() - t0
	};
	const gScore = /* @__PURE__ */ new Map([[startKey, 0]]);
	const parent = /* @__PURE__ */ new Map();
	const how = /* @__PURE__ */ new Map();
	const heap = new MinHeap();
	let seq = 0;
	heap.push({
		f: h0,
		h: h0,
		seq: seq++,
		key: startKey
	});
	let peakHeap = 1;
	let expanded = 0;
	let generated = 1;
	const closed = /* @__PURE__ */ new Set();
	while (heap.size > 0) {
		const node = heap.pop();
		const g = node.f - node.h;
		if (gScore.get(node.key) !== g) continue;
		if (closed.has(node.key)) continue;
		if (node.key === goalKey) {
			const keys = [goalKey];
			while (parent.has(keys[keys.length - 1])) keys.push(parent.get(keys[keys.length - 1]));
			keys.reverse();
			const boards = keys.map(boardOf);
			const moves = [];
			for (let i = 1; i < keys.length; i++) moves.push(how.get(keys[i]));
			return {
				solvable: true,
				steps: moves.length,
				moves,
				boards,
				expanded,
				generated,
				peakHeap,
				manhattan: h0,
				inversions: inv,
				elapsedMs: performance.now() - t0
			};
		}
		closed.add(node.key);
		expanded++;
		const board = boardOf(node.key);
		const blank = board.indexOf(0);
		const row = blank / 3 | 0;
		const col = blank % 3;
		for (const dir of [
			"up",
			"down",
			"left",
			"right"
		]) {
			const { dr, dc } = BLANK_STEP[dir];
			const nextRow = row + dr;
			const nextCol = col + dc;
			if (nextRow < 0 || nextRow > 2 || nextCol < 0 || nextCol > 2) continue;
			const into = nextRow * 3 + nextCol;
			const tile = board[into];
			const next = board.slice();
			next[blank] = tile;
			next[into] = 0;
			const nextKey = keyOf(next);
			const nextG = g + 1;
			const previous = gScore.get(nextKey);
			if (previous !== void 0 && nextG >= previous) continue;
			gScore.set(nextKey, nextG);
			parent.set(nextKey, node.key);
			how.set(nextKey, {
				tile,
				dir: TILE_FROM_BLANK[dir]
			});
			const h = manhattan(next);
			heap.push({
				f: nextG + h,
				h,
				seq: seq++,
				key: nextKey
			});
			if (heap.size > peakHeap) peakHeap = heap.size;
			generated++;
		}
	}
	return {
		...base,
		solvable: false,
		steps: -1,
		expanded,
		generated,
		peakHeap,
		elapsedMs: performance.now() - t0
	};
}
/** Python source for the position the player arranged. Same A* the board runs. */
function pythonSource(board) {
	return `"""
8-puzzle — problem formulation and A* search.

State
    A tuple of 9 integers, row by row. 0 is the blank.
Initial state
    The arrangement you set on the board.
Actions
    Slide one tile into the blank: up, down, left, or right.
    Illegal if that slide would leave the 3×3 board.
Transition
    Swap the chosen tile with the blank.
Goal test
    state == (1, 2, 3, 4, 5, 6, 7, 8, 0)
Path cost
    1 per slide. Optimal means the fewest slides, not the fewest seconds.

Heuristic
    h(n) = Manhattan distance of every numbered tile from its goal cell.
    The blank is not counted. h never overestimates, and it is consistent,
    so A* (f = g + h) returns an optimal path the moment the goal is popped.

Solvability
    On a 3×3 board, ignore the blank and count inversions.
    Even parity can reach the goal. Odd parity cannot — half of all
    arrangements are unreachable. 9!/2 = 181,440 solvable states.
"""

from heapq import heappop, heappush
import time

GOAL = (1, 2, 3, 4, 5, 6, 7, 8, 0)
START = (${board.join(", ")})


def manhattan(state: tuple[int, ...]) -> int:
    distance = 0
    for index, tile in enumerate(state):
        if tile == 0:
            continue
        goal = tile - 1
        distance += abs(index // 3 - goal // 3) + abs(index % 3 - goal % 3)
    return distance


def inversions(state: tuple[int, ...]) -> int:
    tiles = [tile for tile in state if tile]
    return sum(
        1
        for i in range(len(tiles))
        for j in range(i + 1, len(tiles))
        if tiles[i] > tiles[j]
    )


def solvable(state: tuple[int, ...]) -> bool:
    return inversions(state) % 2 == 0


def astar(start: tuple[int, ...]):
    """Return (steps, moves, stats), or None when the parity is odd."""
    if not solvable(start):
        return None
    if start == GOAL:
        return 0, [], {"expanded": 0, "generated": 1, "peak_heap": 0}

    g_score = {start: 0}
    parent = {}
    how = {}
    heuristic = manhattan(start)
    heap = [(heuristic, heuristic, 0, start)]  # f, h, seq, state
    seq = 1
    closed = set()
    expanded = 0
    generated = 1
    peak_heap = 1
    blank_steps = {"up": (-1, 0), "down": (1, 0), "left": (0, -1), "right": (0, 1)}
    tile_dir = {"up": "down", "down": "up", "left": "right", "right": "left"}

    while heap:
        peak_heap = max(peak_heap, len(heap))
        f, h, _, state = heappop(heap)
        g = f - h
        if g_score.get(state) != g or state in closed:
            continue
        if state == GOAL:
            moves = []
            cursor = state
            while cursor in parent:
                moves.append(how[cursor])
                cursor = parent[cursor]
            moves.reverse()
            return len(moves), moves, {
                "expanded": expanded,
                "generated": generated,
                "peak_heap": peak_heap,
            }

        closed.add(state)
        expanded += 1
        blank = state.index(0)
        row, col = divmod(blank, 3)
        for direction, (dr, dc) in blank_steps.items():
            next_row, next_col = row + dr, col + dc
            if not (0 <= next_row < 3 and 0 <= next_col < 3):
                continue
            into = next_row * 3 + next_col
            tiles = list(state)
            moved = tiles[into]
            tiles[blank], tiles[into] = moved, 0
            nxt = tuple(tiles)
            next_g = g + 1
            if next_g >= g_score.get(nxt, 10**9):
                continue
            g_score[nxt] = next_g
            parent[nxt] = state
            how[nxt] = (moved, tile_dir[direction])
            next_h = manhattan(nxt)
            heappush(heap, (next_g + next_h, next_h, seq, nxt))
            seq += 1
            generated += 1

    return None


def main() -> None:
    print("Initial state:", START)
    print("Manhattan lower bound:", manhattan(START))
    print("Inversions:", inversions(START), "(even is solvable)" if solvable(START) else "(odd — no solution)")
    started = time.perf_counter()
    result = astar(START)
    elapsed = (time.perf_counter() - started) * 1000
    if result is None:
        print("Unsolvable. A* is not run to the goal — no path exists.")
        return
    steps, moves, stats = result
    print(f"Optimal slides: {steps}")
    for number, (tile, direction) in enumerate(moves, 1):
        print(f"{number:>2}. slide {tile} {direction}")
    print(
        f"Expanded {stats['expanded']} nodes, "
        f"generated {stats['generated']}, "
        f"peak heap {stats['peak_heap']} "
        f"in {elapsed:.1f} ms"
    )


if __name__ == "__main__":
    main()
`;
}
var STEP_MS = 460;
function OctileLab() {
	const [board, setBoard] = (0, import_react.useState)(() => SAMPLES[1].board.slice());
	const [mode, setMode] = (0, import_react.useState)("arrange");
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [userSlides, setUserSlides] = (0, import_react.useState)(0);
	const [setup, setSetup] = (0, import_react.useState)(() => SAMPLES[1].board.slice());
	const [handOptimal, setHandOptimal] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const [frame, setFrame] = (0, import_react.useState)(0);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [searching, setSearching] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [instant, setInstant] = (0, import_react.useState)(false);
	const frameRef = (0, import_react.useRef)(0);
	const resultRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		frameRef.current = frame;
	}, [frame]);
	(0, import_react.useEffect)(() => {
		resultRef.current = result;
	}, [result]);
	(0, import_react.useEffect)(() => {
		if (!playing) return;
		let raf = 0;
		let last = performance.now();
		let acc = 0;
		const tick = (now) => {
			const dt = Math.min(80, now - last);
			last = now;
			acc += dt;
			if (acc >= STEP_MS) {
				acc -= STEP_MS;
				const current = resultRef.current;
				if (!current) {
					setPlaying(false);
					return;
				}
				if (frameRef.current >= current.steps) {
					setPlaying(false);
					return;
				}
				setInstant(false);
				setFrame((value) => Math.min(current.steps, value + 1));
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [playing]);
	const shown = result ? result.boards[frame] ?? board : board;
	const solvableNow = isSolvable(board);
	const bound = manhattan(board);
	const parity = inversions(board);
	function replaceBoard(next) {
		setBoard(next);
		setSetup(next.slice());
		setUserSlides(0);
		setHandOptimal(null);
		setSelected(null);
		setResult(null);
		setPlaying(false);
		setFrame(0);
	}
	function commitSlide(next) {
		if (!next || result || searching) return;
		const slides = userSlides + 1;
		const origin = setup;
		setBoard(next);
		setUserSlides(slides);
		setHandOptimal(null);
		if (isGoal(next)) window.setTimeout(() => {
			const found = solve(origin);
			setHandOptimal(found.solvable ? found.steps : null);
		}, 40);
	}
	function applySlide(dir) {
		commitSlide(slideBlank(board, dir));
	}
	function onTile(index) {
		if (result || searching) return;
		if (mode === "slide") {
			commitSlide(slideTile(board, index));
			return;
		}
		if (selected === null) {
			setSelected(index);
			return;
		}
		if (selected === index) {
			setSelected(null);
			return;
		}
		replaceBoard(swapTiles(board, selected, index));
	}
	function runSolve() {
		if (searching) return;
		const snapshot = board.slice();
		setSearching(true);
		setPlaying(false);
		setSelected(null);
		window.setTimeout(() => {
			const found = solve(snapshot);
			setResult(found);
			setFrame(0);
			setInstant(true);
			setSearching(false);
		}, 40);
	}
	function step(delta) {
		const current = resultRef.current;
		if (!current) return;
		setPlaying(false);
		const value = frameRef.current;
		const next = Math.max(0, Math.min(current.steps, value + delta));
		setInstant(Math.abs(next - value) > 1);
		setFrame(next);
	}
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const target = event.target;
			if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
			const dir = {
				ArrowUp: "up",
				ArrowDown: "down",
				ArrowLeft: "left",
				ArrowRight: "right"
			}[event.key];
			if (!dir) return;
			event.preventDefault();
			if (resultRef.current) {
				if (dir === "right" || dir === "down") step(1);
				if (dir === "left" || dir === "up") step(-1);
				return;
			}
			if (mode !== "slide") return;
			applySlide(dir);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
	async function copyPython() {
		const source = pythonSource(result ? result.boards[0] : board);
		try {
			await navigator.clipboard.writeText(source);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			setCopied(false);
		}
	}
	const moveLabel = result && frame > 0 ? result.moves[frame - 1] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "lab mx-auto w-full max-w-6xl gap-8 px-4 py-6 lg:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-sm tracking-widest text-brass uppercase",
					children: "8-puzzle"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-1 text-4xl leading-none font-medium text-paper",
					children: "Octile"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-sm text-base leading-relaxed text-muted",
					children: "You arrange the numbers. A* answers with the fewest slides."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "desk mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-square w-full",
						role: "group",
						"aria-label": "Eight puzzle",
						children: [Array.from({ length: 9 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "well",
							"data-c": index % 3,
							"data-r": index / 3 | 0,
							"aria-hidden": true
						}, index)), shown.map((tile, index) => tile === 0 ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "tile",
							"data-c": index % 3,
							"data-r": index / 3 | 0,
							"data-selected": selected === index,
							"data-instant": instant,
							disabled: Boolean(result) || searching,
							onClick: () => onTile(index),
							"aria-label": `Tile ${tile}${selected === index ? ", selected" : ""}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tile-face",
								children: tile
							})
						}, tile))]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						"aria-live": "polite",
						children: result ? "Playback is on. Rearrange to edit the numbers." : mode === "arrange" ? "Tap two tiles to swap, including the gap." : "Tap a neighbor of the gap, or use the arrow keys."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalStamp, {})]
				}),
				!result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brass px-4 text-base font-medium text-ink disabled:opacity-60",
					onClick: runSolve,
					disabled: searching,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, {
						className: "size-4",
						"aria-hidden": true
					}), searching ? "Searching…" : solvableNow ? "Solve with A*" : "Explain why it fails"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: [
						"At least ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-paper",
							children: bound
						}),
						" slide",
						bound === 1 ? "" : "s",
						" by Manhattan. Inversions ",
						parity,
						" (",
						parity % 2 === 0 ? "even, solvable" : "odd, impossible",
						")."
					]
				}),
				!solvableNow && !result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm leading-relaxed text-paper",
					children: "Odd parity cannot reach the goal. Swap any two numbered tiles to flip it."
				}),
				mode === "slide" && !result && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					"aria-live": "polite",
					children: [
						"Your slides from this setup: ",
						userSlides,
						".",
						isGoal(board) && userSlides > 0 && handOptimal === null && " Checking the optimal length…",
						isGoal(board) && handOptimal !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							" ",
							"You finished in ",
							userSlides,
							". Optimal is ",
							handOptimal,
							userSlides === handOptimal ? " — that was perfect." : "."
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 rounded-full bg-panel p-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": mode === "arrange",
						className: `min-h-12 rounded-full text-sm font-medium ${mode === "arrange" ? "bg-paper text-ink" : "text-muted"}`,
						onClick: () => {
							setMode("arrange");
							setSelected(null);
						},
						children: "Arrange"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": mode === "slide",
						className: `min-h-12 rounded-full text-sm font-medium ${mode === "slide" ? "bg-paper text-ink" : "text-muted"}`,
						onClick: () => {
							setMode("slide");
							setSelected(null);
							if (!result) {
								setSetup(board.slice());
								setUserSlides(0);
								setHandOptimal(null);
							}
						},
						children: "Slide"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex max-w-full gap-2 overflow-x-auto",
					children: [
						SAMPLES.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-12 shrink-0 rounded-full border border-line px-4 text-sm text-paper",
							onClick: () => replaceBoard(sample.board.slice()),
							children: sample.label
						}, sample.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm text-paper",
							onClick: () => replaceBoard(scramble(30)),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, {
								className: "size-4",
								"aria-hidden": true
							}), "Scramble"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm text-paper",
							onClick: () => replaceBoard(GOAL.slice()),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
								className: "size-4",
								"aria-hidden": true
							}), "Goal"]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Answer, {
					result,
					frame,
					searching,
					moveLabel
				}),
				result && result.solvable && result.steps > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex size-12 items-center justify-center rounded-full border border-line text-paper",
							onClick: () => {
								setPlaying(false);
								setInstant(true);
								setFrame(0);
							},
							"aria-label": "Back to the start of the path",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipBack, {
								className: "size-4",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex size-12 items-center justify-center rounded-full bg-paper text-ink",
							onClick: () => {
								if (frame >= result.steps) {
									setInstant(true);
									setFrame(0);
									setPlaying(true);
									return;
								}
								setPlaying((value) => !value);
							},
							"aria-label": playing ? "Pause" : "Play the path",
							children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
								className: "size-4",
								"aria-hidden": true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
								className: "size-4",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "inline-flex size-12 items-center justify-center rounded-full border border-line text-paper",
							onClick: () => step(1),
							"aria-label": "Next slide",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkipForward, {
								className: "size-4",
								"aria-hidden": true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-1 text-sm text-muted",
							children: [
								"Step ",
								frame,
								" of ",
								result.steps,
								moveLabel ? ` · slide ${moveLabel.tile} ${moveLabel.dir}` : " · start"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ml-auto min-h-12 rounded-full border border-line px-4 text-sm text-paper",
							onClick: () => replaceBoard(result.boards[0].slice()),
							children: "Rearrange"
						})
					]
				}),
				result && result.solvable && result.steps > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-4 flex max-h-40 flex-wrap gap-2 overflow-auto",
					children: result.moves.map((move, index) => {
						const active = index === frame - 1;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: `min-h-10 rounded-full px-3 text-sm ${active ? "bg-brass text-ink" : "bg-panel text-paper"}`,
							onClick: () => {
								setPlaying(false);
								setInstant(Math.abs(index + 1 - frame) > 1);
								setFrame(index + 1);
							},
							children: [
								index + 1,
								". ",
								move.tile,
								" ",
								move.dir
							]
						}) }, `${move.tile}-${index}`);
					})
				}),
				result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-4 min-h-12 rounded-full border border-line px-4 text-sm text-paper",
					onClick: () => replaceBoard(shown.slice()),
					children: "Pose a different board"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Formulation, {
					board: result ? result.boards[0] : board,
					result,
					shown,
					frame
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PythonCard, {
					source: pythonSource(result ? result.boards[0] : board),
					copied,
					onCopy: copyPython
				})
			]
		})]
	});
}
function GoalStamp() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1 text-right text-xs tracking-wide text-muted uppercase",
			children: "Goal"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-3 gap-0.5",
			"aria-hidden": true,
			children: GOAL.map((tile, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `grid size-5 place-items-center rounded-sm text-xs ${tile === 0 ? "bg-walnut text-transparent" : "bg-paper text-ink"}`,
				children: tile === 0 ? "·" : tile
			}, index))
		})]
	});
}
function Answer({ result, frame, searching, moveLabel }) {
	if (searching) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border border-line bg-walnut px-5 py-6",
		"aria-live": "polite",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm tracking-wide text-brass uppercase",
			children: "A* search"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display mt-2 text-3xl text-paper",
			children: "Walking f = g + h…"
		})]
	});
	if (!result) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border border-line bg-walnut px-5 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm tracking-wide text-brass uppercase",
				children: "Waiting on a position"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-2 text-3xl leading-tight text-paper",
				children: "Set the tiles, then ask for the step count."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
				children: "Arrange mode can build any of the 9! layouts, solvable or not. Slide mode only walks legal moves. A* uses Manhattan distance, so the number it returns is the shortest possible path."
			})
		]
	});
	if (!result.solvable) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border border-line bg-walnut px-5 py-6",
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm tracking-wide text-brass uppercase",
				children: "No solution"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-2 text-3xl text-paper",
				children: "Unreachable goal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
				children: [result.inversions, " inversions is odd. Sliding preserves parity, and the goal has zero inversions, so this start is not in the same connected component."]
			})
		]
	});
	const h = manhattan(result.boards[frame] ?? result.boards[0]);
	const g = frame;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-3xl border border-line bg-walnut px-5 py-6",
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm tracking-wide text-brass uppercase",
				children: "Optimal path cost"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display mt-1 text-7xl leading-none text-paper",
				children: result.steps
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-base text-paper",
				children: result.steps === 0 ? "Already the goal." : result.steps === 1 ? "slide" : "slides"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "g along path",
						value: String(g)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "h here",
						value: String(h)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "f = g + h",
						value: String(g + h)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Expanded",
						value: result.expanded.toLocaleString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Generated",
						value: result.generated.toLocaleString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Peak heap",
						value: result.peakHeap.toLocaleString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "h(start)",
						value: String(result.manhattan)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Search",
						value: `${result.elapsedMs < 10 ? result.elapsedMs.toFixed(1) : Math.round(result.elapsedMs)} ms`
					})
				]
			}),
			moveLabel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					"Last action: slide tile ",
					moveLabel.tile,
					" ",
					moveLabel.dir,
					"."
				]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-panel px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs tracking-wide text-muted uppercase",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "mt-1 font-display text-2xl text-paper",
			children: value
		})]
	});
}
function Formulation({ board, shown, result, frame }) {
	const rows = [
		0,
		1,
		2
	].map((row) => board.slice(row * 3, row * 3 + 3).join(" ")).join(" / ");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl text-paper",
			children: "Problem formulation"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
			className: "mt-4 grid gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "State",
					v: "Permutation of {0,1,…,8}. 0 is the blank. Read row by row."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Initial",
					v: rows
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Actions",
					v: "Slide a tile that shares an edge with the blank: up, down, left, or right."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Transition",
					v: "Swap that tile with 0. Cost of every action is 1."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Goal test",
					v: "Board equals 1 2 3 / 4 5 6 / 7 8 0."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "Heuristic",
					v: `h = Manhattan distance over tiles 1–8. At the start, h = ${manhattan(board)}. It is admissible, so A* will not stop early on a longer path.`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "A*",
					v: "Order the frontier by f(n) = g(n) + h(n). g is slides from your initial state. Ties break toward a smaller h. Because h is consistent, the first time the goal leaves the heap, g is optimal."
				}),
				result?.solvable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
					k: "On this path",
					v: `Frame ${frame}: g = ${frame}, h = ${manhattan(shown)}, f = ${frame + manhattan(shown)}. Optimal g* = ${result.steps}.`
				})
			]
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "form-row border-t border-line py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-sm text-brass",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "text-sm leading-relaxed text-paper",
			children: v
		})]
	});
}
function PythonCard({ source, copied, onCopy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl text-paper",
					children: "Same search, in Python"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-4 text-sm text-paper",
					onClick: onCopy,
					children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
						className: "size-4",
						"aria-hidden": true
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
						className: "size-4",
						"aria-hidden": true
					}), copied ? "Copied" : "Copy"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: "The board runs this formulation in the browser, so the step count shows up immediately. START is the position you arranged. Paste it into Python to print the same path."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "code-scroll mt-4 overflow-auto rounded-3xl border border-line bg-walnut p-4 text-xs leading-relaxed text-paper-deep sm:text-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: source })
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctileLab, {});
}
//#endregion
export { Home as component };
