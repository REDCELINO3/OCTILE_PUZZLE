/** Python source for the position the player arranged. Same A* the board runs. */
export function pythonSource(board: readonly number[]): string {
  const start = board.join(", ");
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
START = (${start})


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
