export type Dir = "up" | "down" | "left" | "right";

export type Move = {
  tile: number;
  dir: Dir;
};

export type SolveResult = {
  solvable: boolean;
  steps: number;
  moves: Move[];
  boards: number[][];
  expanded: number;
  generated: number;
  peakHeap: number;
  manhattan: number;
  inversions: number;
  elapsedMs: number;
};

export const GOAL: readonly number[] = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const TILE_FROM_BLANK: Record<Dir, Dir> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

const BLANK_STEP: Record<Dir, { dr: number; dc: number }> = {
  up: { dr: -1, dc: 0 },
  down: { dr: 1, dc: 0 },
  left: { dr: 0, dc: -1 },
  right: { dr: 0, dc: 1 },
};

export const SAMPLES: { id: string; label: string; board: number[] }[] = [
  { id: "light", label: "Light", board: [1, 2, 3, 4, 5, 6, 0, 7, 8] },
  { id: "twist", label: "Twist", board: [1, 2, 3, 5, 0, 6, 4, 7, 8] },
  { id: "far", label: "Far", board: [8, 6, 7, 2, 5, 4, 3, 0, 1] },
];

export function isGoal(board: readonly number[]): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[i] !== GOAL[i]) return false;
  }
  return true;
}

export function inversions(board: readonly number[]): number {
  const tiles = board.filter((tile) => tile !== 0);
  let count = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i]! > tiles[j]!) count++;
    }
  }
  return count;
}

/** Odd-width board: solvable iff the permutation of the eight tiles is even. */
export function isSolvable(board: readonly number[]): boolean {
  return inversions(board) % 2 === 0;
}

export function manhattan(board: readonly number[]): number {
  let distance = 0;
  for (let i = 0; i < 9; i++) {
    const tile = board[i]!;
    if (tile === 0) continue;
    const goal = tile - 1;
    distance += Math.abs(((i / 3) | 0) - ((goal / 3) | 0)) + Math.abs((i % 3) - (goal % 3));
  }
  return distance;
}

export function slideBlank(board: readonly number[], dir: Dir): number[] | null {
  const blank = board.indexOf(0);
  const row = (blank / 3) | 0;
  const col = blank % 3;
  const { dr, dc } = BLANK_STEP[dir];
  const nextRow = row + dr;
  const nextCol = col + dc;
  if (nextRow < 0 || nextRow > 2 || nextCol < 0 || nextCol > 2) return null;
  const into = nextRow * 3 + nextCol;
  const next = board.slice();
  next[blank] = next[into]!;
  next[into] = 0;
  return next;
}

export function slideTile(board: readonly number[], index: number): number[] | null {
  const blank = board.indexOf(0);
  if (index === blank) return null;
  const row = (index / 3) | 0;
  const col = index % 3;
  const blankRow = (blank / 3) | 0;
  const blankCol = blank % 3;
  if (Math.abs(row - blankRow) + Math.abs(col - blankCol) !== 1) return null;
  const next = board.slice();
  next[blank] = next[index]!;
  next[index] = 0;
  return next;
}

export function swapTiles(board: readonly number[], i: number, j: number): number[] {
  const next = board.slice();
  const a = next[i]!;
  next[i] = next[j]!;
  next[j] = a;
  return next;
}

export function scramble(turns: number, random: () => number = Math.random): number[] {
  let board = GOAL.slice();
  let previousBlank = -1;
  const dirs: Dir[] = ["up", "down", "left", "right"];
  for (let turn = 0; turn < turns; turn++) {
    const blank = board.indexOf(0);
    const options = dirs.filter((dir) => {
      const moved = slideBlank(board, dir);
      return moved !== null && moved.indexOf(0) !== previousBlank;
    });
    const pool = options.length > 0 ? options : dirs.filter((dir) => slideBlank(board, dir));
    const dir = pool[Math.floor(random() * pool.length)]!;
    const moved = slideBlank(board, dir);
    if (!moved) continue;
    previousBlank = blank;
    board = moved;
  }
  return board;
}

type HeapNode = { f: number; h: number; seq: number; key: string };

class MinHeap {
  private nodes: HeapNode[] = [];

  get size(): number {
    return this.nodes.length;
  }

  push(node: HeapNode): void {
    const nodes = this.nodes;
    nodes.push(node);
    let index = nodes.length - 1;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      if (!outranks(nodes[index]!, nodes[parent]!)) break;
      const swap = nodes[index]!;
      nodes[index] = nodes[parent]!;
      nodes[parent] = swap;
      index = parent;
    }
  }

  pop(): HeapNode | undefined {
    const nodes = this.nodes;
    if (nodes.length === 0) return undefined;
    const top = nodes[0]!;
    const last = nodes.pop()!;
    if (nodes.length > 0) {
      nodes[0] = last;
      let index = 0;
      for (;;) {
        const left = index * 2 + 1;
        const right = left + 1;
        let best = index;
        if (left < nodes.length && outranks(nodes[left]!, nodes[best]!)) best = left;
        if (right < nodes.length && outranks(nodes[right]!, nodes[best]!)) best = right;
        if (best === index) break;
        const swap = nodes[index]!;
        nodes[index] = nodes[best]!;
        nodes[best] = swap;
        index = best;
      }
    }
    return top;
  }
}

function outranks(a: HeapNode, b: HeapNode): boolean {
  if (a.f !== b.f) return a.f < b.f;
  if (a.h !== b.h) return a.h < b.h;
  return a.seq < b.seq;
}

function keyOf(board: readonly number[]): string {
  return board.join("");
}

function boardOf(key: string): number[] {
  const board = new Array<number>(9);
  for (let i = 0; i < 9; i++) board[i] = Number(key[i]);
  return board;
}

/**
 * A* with the Manhattan heuristic. Manhattan is consistent, so the first time
 * the goal is dequeued its g-cost is optimal (fewest slides).
 */
export function solve(start: readonly number[]): SolveResult {
  const t0 = performance.now();
  const h0 = manhattan(start);
  const inv = inversions(start);
  const base = {
    manhattan: h0,
    inversions: inv,
    boards: [start.slice()],
    moves: [] as Move[],
    steps: 0,
    expanded: 0,
    generated: 0,
    peakHeap: 0,
  };

  if (!isSolvable(start)) {
    return { ...base, solvable: false, steps: -1, elapsedMs: performance.now() - t0 };
  }

  const startKey = keyOf(start);
  const goalKey = keyOf(GOAL);
  if (startKey === goalKey) {
    return { ...base, solvable: true, elapsedMs: performance.now() - t0 };
  }

  const gScore = new Map<string, number>([[startKey, 0]]);
  const parent = new Map<string, string>();
  const how = new Map<string, Move>();
  const heap = new MinHeap();
  let seq = 0;
  heap.push({ f: h0, h: h0, seq: seq++, key: startKey });
  let peakHeap = 1;
  let expanded = 0;
  let generated = 1;
  const closed = new Set<string>();

  while (heap.size > 0) {
    const node = heap.pop()!;
    const g = node.f - node.h;
    if (gScore.get(node.key) !== g) continue;
    if (closed.has(node.key)) continue;

    if (node.key === goalKey) {
      const keys: string[] = [goalKey];
      while (parent.has(keys[keys.length - 1]!)) {
        keys.push(parent.get(keys[keys.length - 1]!)!);
      }
      keys.reverse();
      const boards = keys.map(boardOf);
      const moves: Move[] = [];
      for (let i = 1; i < keys.length; i++) moves.push(how.get(keys[i]!)!);
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
        elapsedMs: performance.now() - t0,
      };
    }

    closed.add(node.key);
    expanded++;
    const board = boardOf(node.key);
    const blank = board.indexOf(0);
    const row = (blank / 3) | 0;
    const col = blank % 3;

    for (const dir of ["up", "down", "left", "right"] as const) {
      const { dr, dc } = BLANK_STEP[dir];
      const nextRow = row + dr;
      const nextCol = col + dc;
      if (nextRow < 0 || nextRow > 2 || nextCol < 0 || nextCol > 2) continue;
      const into = nextRow * 3 + nextCol;
      const tile = board[into]!;
      const next = board.slice();
      next[blank] = tile;
      next[into] = 0;
      const nextKey = keyOf(next);
      const nextG = g + 1;
      const previous = gScore.get(nextKey);
      if (previous !== undefined && nextG >= previous) continue;
      gScore.set(nextKey, nextG);
      parent.set(nextKey, node.key);
      how.set(nextKey, { tile, dir: TILE_FROM_BLANK[dir] });
      const h = manhattan(next);
      heap.push({ f: nextG + h, h, seq: seq++, key: nextKey });
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
    elapsedMs: performance.now() - t0,
  };
}
