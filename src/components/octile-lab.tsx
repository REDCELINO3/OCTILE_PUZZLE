import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Pause,
  Play,
  RotateCcw,
  Route,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import {
  GOAL,
  SAMPLES,
  inversions,
  isGoal,
  isSolvable,
  manhattan,
  scramble,
  slideBlank,
  slideTile,
  solve,
  swapTiles,
  type Dir,
  type SolveResult,
} from "@/lib/eight/engine";
import { pythonSource } from "@/lib/eight/python";

type Mode = "arrange" | "slide";

const STEP_MS = 460;

export function OctileLab() {
  const [board, setBoard] = useState<number[]>(() => SAMPLES[1]!.board.slice());
  const [mode, setMode] = useState<Mode>("arrange");
  const [selected, setSelected] = useState<number | null>(null);
  const [userSlides, setUserSlides] = useState(0);
  const [setup, setSetup] = useState<number[]>(() => SAMPLES[1]!.board.slice());
  const [handOptimal, setHandOptimal] = useState<number | null>(null);
  const [result, setResult] = useState<SolveResult | null>(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [searching, setSearching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [instant, setInstant] = useState(false);
  const frameRef = useRef(0);
  const resultRef = useRef<SolveResult | null>(null);

  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
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

  const shown = result ? (result.boards[frame] ?? board) : board;
  const solvableNow = isSolvable(board);
  const bound = manhattan(board);
  const parity = inversions(board);

  function replaceBoard(next: number[]) {
    setBoard(next);
    setSetup(next.slice());
    setUserSlides(0);
    setHandOptimal(null);
    setSelected(null);
    setResult(null);
    setPlaying(false);
    setFrame(0);
  }

  function commitSlide(next: number[] | null) {
    if (!next || result || searching) return;
    const slides = userSlides + 1;
    const origin = setup;
    setBoard(next);
    setUserSlides(slides);
    setHandOptimal(null);
    if (isGoal(next)) {
      window.setTimeout(() => {
        const found = solve(origin);
        setHandOptimal(found.solvable ? found.steps : null);
      }, 40);
    }
  }

  function applySlide(dir: Dir) {
    commitSlide(slideBlank(board, dir));
  }

  function onTile(index: number) {
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

  function step(delta: number) {
    const current = resultRef.current;
    if (!current) return;
    setPlaying(false);
    const value = frameRef.current;
    const next = Math.max(0, Math.min(current.steps, value + delta));
    setInstant(Math.abs(next - value) > 1);
    setFrame(next);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        return;
      }
      const arrows: Record<string, Dir> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };
      const dir = arrows[event.key];
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
    const source = pythonSource(result ? result.boards[0]! : board);
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const moveLabel =
    result && frame > 0 ? result.moves[frame - 1] : null;

  return (
    <main className="lab mx-auto w-full max-w-6xl gap-8 px-4 py-6 lg:px-6">
      <section className="min-w-0">
        <p className="font-display text-sm tracking-widest text-brass uppercase">8-puzzle</p>
        <h1 className="font-display mt-1 text-4xl leading-none font-medium text-paper">Octile</h1>
        <p className="mt-3 max-w-sm text-base leading-relaxed text-muted">
          You arrange the numbers. A* answers with the fewest slides.
        </p>

        <div className="desk mt-5">
          <div
            className="relative aspect-square w-full"
            role="group"
            aria-label="Eight puzzle"
          >
            {Array.from({ length: 9 }, (_, index) => (
              <span
                key={index}
                className="well"
                data-c={index % 3}
                data-r={(index / 3) | 0}
                aria-hidden
              />
            ))}
            {shown.map((tile, index) =>
              tile === 0 ? null : (
                <button
                  key={tile}
                  type="button"
                  className="tile"
                  data-c={index % 3}
                  data-r={(index / 3) | 0}
                  data-selected={selected === index}
                  data-instant={instant}
                  disabled={Boolean(result) || searching}
                  onClick={() => onTile(index)}
                  aria-label={`Tile ${tile}${selected === index ? ", selected" : ""}`}
                >
                  <span className="tile-face">{tile}</span>
                </button>
              ),
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            {result
              ? "Playback is on. Rearrange to edit the numbers."
              : mode === "arrange"
                ? "Tap two tiles to swap, including the gap."
                : "Tap a neighbor of the gap, or use the arrow keys."}
          </p>
          <GoalStamp />
        </div>

        {!result && (
          <button
            type="button"
            className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brass px-4 text-base font-medium text-ink disabled:opacity-60"
            onClick={runSolve}
            disabled={searching}
          >
            <Route className="size-4" aria-hidden />
            {searching ? "Searching…" : solvableNow ? "Solve with A*" : "Explain why it fails"}
          </button>
        )}

        <p className="mt-3 text-sm text-muted">
          At least <span className="text-paper">{bound}</span> slide{bound === 1 ? "" : "s"} by Manhattan.
          Inversions {parity} ({parity % 2 === 0 ? "even, solvable" : "odd, impossible"}).
        </p>

        {!solvableNow && !result && (
          <p className="mt-2 text-sm leading-relaxed text-paper">
            Odd parity cannot reach the goal. Swap any two numbered tiles to flip it.
          </p>
        )}

        {mode === "slide" && !result && (
          <p className="mt-2 text-sm text-muted" aria-live="polite">
            Your slides from this setup: {userSlides}.
            {isGoal(board) && userSlides > 0 && handOptimal === null && " Checking the optimal length…"}
            {isGoal(board) && handOptimal !== null && (
              <>
                {" "}
                You finished in {userSlides}. Optimal is {handOptimal}
                {userSlides === handOptimal ? " — that was perfect." : "."}
              </>
            )}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 rounded-full bg-panel p-1">
          <button
            type="button"
            aria-pressed={mode === "arrange"}
            className={`min-h-12 rounded-full text-sm font-medium ${mode === "arrange" ? "bg-paper text-ink" : "text-muted"}`}
            onClick={() => {
              setMode("arrange");
              setSelected(null);
            }}
          >
            Arrange
          </button>
          <button
            type="button"
            aria-pressed={mode === "slide"}
            className={`min-h-12 rounded-full text-sm font-medium ${mode === "slide" ? "bg-paper text-ink" : "text-muted"}`}
            onClick={() => {
              setMode("slide");
              setSelected(null);
              if (!result) {
                setSetup(board.slice());
                setUserSlides(0);
                setHandOptimal(null);
              }
            }}
          >
            Slide
          </button>
        </div>

        <div className="mt-3 flex max-w-full gap-2 overflow-x-auto">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              className="min-h-12 shrink-0 rounded-full border border-line px-4 text-sm text-paper"
              onClick={() => replaceBoard(sample.board.slice())}
            >
              {sample.label}
            </button>
          ))}
          <button
            type="button"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm text-paper"
            onClick={() => replaceBoard(scramble(30))}
          >
            <Shuffle className="size-4" aria-hidden />
            Scramble
          </button>
          <button
            type="button"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm text-paper"
            onClick={() => replaceBoard(GOAL.slice())}
          >
            <RotateCcw className="size-4" aria-hidden />
            Goal
          </button>
        </div>
      </section>

      <section className="min-w-0">
        <Answer result={result} frame={frame} searching={searching} moveLabel={moveLabel} />

        {result && result.solvable && result.steps > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex size-12 items-center justify-center rounded-full border border-line text-paper"
              onClick={() => {
                setPlaying(false);
                setInstant(true);
                setFrame(0);
              }}
              aria-label="Back to the start of the path"
            >
              <SkipBack className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              className="inline-flex size-12 items-center justify-center rounded-full bg-paper text-ink"
              onClick={() => {
                if (frame >= result.steps) {
                  setInstant(true);
                  setFrame(0);
                  setPlaying(true);
                  return;
                }
                setPlaying((value) => !value);
              }}
              aria-label={playing ? "Pause" : "Play the path"}
            >
              {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
            </button>
            <button
              type="button"
              className="inline-flex size-12 items-center justify-center rounded-full border border-line text-paper"
              onClick={() => step(1)}
              aria-label="Next slide"
            >
              <SkipForward className="size-4" aria-hidden />
            </button>
            <span className="ml-1 text-sm text-muted">
              Step {frame} of {result.steps}
              {moveLabel ? ` · slide ${moveLabel.tile} ${moveLabel.dir}` : " · start"}
            </span>
            <button
              type="button"
              className="ml-auto min-h-12 rounded-full border border-line px-4 text-sm text-paper"
              onClick={() => replaceBoard(result.boards[0]!.slice())}
            >
              Rearrange
            </button>
          </div>
        )}

        {result && result.solvable && result.steps > 0 && (
          <ol className="mt-4 flex max-h-40 flex-wrap gap-2 overflow-auto">
            {result.moves.map((move, index) => {
              const active = index === frame - 1;
              return (
                <li key={`${move.tile}-${index}`}>
                  <button
                    type="button"
                    className={`min-h-10 rounded-full px-3 text-sm ${active ? "bg-brass text-ink" : "bg-panel text-paper"}`}
                    onClick={() => {
                      setPlaying(false);
                      setInstant(Math.abs(index + 1 - frame) > 1);
                      setFrame(index + 1);
                    }}
                  >
                    {index + 1}. {move.tile} {move.dir}
                  </button>
                </li>
              );
            })}
          </ol>
        )}

        {result && (
          <button
            type="button"
            className="mt-4 min-h-12 rounded-full border border-line px-4 text-sm text-paper"
            onClick={() => replaceBoard(shown.slice())}
          >
            Pose a different board
          </button>
        )}

        <Formulation board={result ? result.boards[0]! : board} result={result} shown={shown} frame={frame} />
        <PythonCard source={pythonSource(result ? result.boards[0]! : board)} copied={copied} onCopy={copyPython} />
      </section>
    </main>
  );
}

function GoalStamp() {
  return (
    <div className="shrink-0">
      <p className="mb-1 text-right text-xs tracking-wide text-muted uppercase">Goal</p>
      <div className="grid grid-cols-3 gap-0.5" aria-hidden>
        {GOAL.map((tile, index) => (
          <span
            key={index}
            className={`grid size-5 place-items-center rounded-sm text-xs ${tile === 0 ? "bg-walnut text-transparent" : "bg-paper text-ink"}`}
          >
            {tile === 0 ? "·" : tile}
          </span>
        ))}
      </div>
    </div>
  );
}

function Answer({
  result,
  frame,
  searching,
  moveLabel,
}: {
  result: SolveResult | null;
  frame: number;
  searching: boolean;
  moveLabel: { tile: number; dir: Dir } | null;
}) {
  if (searching) {
    return (
      <div className="rounded-3xl border border-line bg-walnut px-5 py-6" aria-live="polite">
        <p className="text-sm tracking-wide text-brass uppercase">A* search</p>
        <p className="font-display mt-2 text-3xl text-paper">Walking f = g + h…</p>
      </div>
    );
  }
  if (!result) {
    return (
      <div className="rounded-3xl border border-line bg-walnut px-5 py-6">
        <p className="text-sm tracking-wide text-brass uppercase">Waiting on a position</p>
        <p className="font-display mt-2 text-3xl leading-tight text-paper">
          Set the tiles, then ask for the step count.
        </p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Arrange mode can build any of the 9! layouts, solvable or not. Slide mode only
          walks legal moves. A* uses Manhattan distance, so the number it returns is the
          shortest possible path.
        </p>
      </div>
    );
  }
  if (!result.solvable) {
    return (
      <div className="rounded-3xl border border-line bg-walnut px-5 py-6" aria-live="polite">
        <p className="text-sm tracking-wide text-brass uppercase">No solution</p>
        <p className="font-display mt-2 text-3xl text-paper">Unreachable goal</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          {result.inversions} inversions is odd. Sliding preserves parity, and the goal has
          zero inversions, so this start is not in the same connected component.
        </p>
      </div>
    );
  }
  const h = manhattan(result.boards[frame] ?? result.boards[0]!);
  const g = frame;
  return (
    <div className="rounded-3xl border border-line bg-walnut px-5 py-6" aria-live="polite">
      <p className="text-sm tracking-wide text-brass uppercase">Optimal path cost</p>
      <p className="font-display mt-1 text-7xl leading-none text-paper">{result.steps}</p>
      <p className="mt-2 text-base text-paper">
        {result.steps === 0 ? "Already the goal." : result.steps === 1 ? "slide" : "slides"}
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="g along path" value={String(g)} />
        <Stat label="h here" value={String(h)} />
        <Stat label="f = g + h" value={String(g + h)} />
        <Stat label="Expanded" value={result.expanded.toLocaleString()} />
        <Stat label="Generated" value={result.generated.toLocaleString()} />
        <Stat label="Peak heap" value={result.peakHeap.toLocaleString()} />
        <Stat label="h(start)" value={String(result.manhattan)} />
        <Stat label="Search" value={`${result.elapsedMs < 10 ? result.elapsedMs.toFixed(1) : Math.round(result.elapsedMs)} ms`} />
      </dl>
      {moveLabel && (
        <p className="mt-4 text-sm text-muted">
          Last action: slide tile {moveLabel.tile} {moveLabel.dir}.
        </p>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-panel px-3 py-2">
      <dt className="text-xs tracking-wide text-muted uppercase">{label}</dt>
      <dd className="mt-1 font-display text-2xl text-paper">{value}</dd>
    </div>
  );
}

function Formulation({
  board,
  shown,
  result,
  frame,
}: {
  board: readonly number[];
  shown: readonly number[];
  result: SolveResult | null;
  frame: number;
}) {
  const rows = [0, 1, 2].map((row) => board.slice(row * 3, row * 3 + 3).join(" ")).join(" / ");
  return (
    <div className="mt-8">
      <h2 className="font-display text-2xl text-paper">Problem formulation</h2>
      <dl className="mt-4 grid gap-3">
        <Row k="State" v="Permutation of {0,1,…,8}. 0 is the blank. Read row by row." />
        <Row k="Initial" v={rows} />
        <Row
          k="Actions"
          v="Slide a tile that shares an edge with the blank: up, down, left, or right."
        />
        <Row k="Transition" v="Swap that tile with 0. Cost of every action is 1." />
        <Row k="Goal test" v="Board equals 1 2 3 / 4 5 6 / 7 8 0." />
        <Row
          k="Heuristic"
          v={`h = Manhattan distance over tiles 1–8. At the start, h = ${manhattan(board)}. It is admissible, so A* will not stop early on a longer path.`}
        />
        <Row
          k="A*"
          v="Order the frontier by f(n) = g(n) + h(n). g is slides from your initial state. Ties break toward a smaller h. Because h is consistent, the first time the goal leaves the heap, g is optimal."
        />
        {result?.solvable && (
          <Row
            k="On this path"
            v={`Frame ${frame}: g = ${frame}, h = ${manhattan(shown)}, f = ${frame + manhattan(shown)}. Optimal g* = ${result.steps}.`}
          />
        )}
      </dl>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="form-row border-t border-line py-3">
      <dt className="text-sm text-brass">{k}</dt>
      <dd className="text-sm leading-relaxed text-paper">{v}</dd>
    </div>
  );
}

function PythonCard({
  source,
  copied,
  onCopy,
}: {
  source: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-end justify-between gap-3">
        <h2 className="font-display text-2xl text-paper">Same search, in Python</h2>
        <button
          type="button"
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-4 text-sm text-paper"
          onClick={onCopy}
        >
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        The board runs this formulation in the browser, so the step count shows up immediately.
        START is the position you arranged. Paste it into Python to print the same path.
      </p>
      <pre className="code-scroll mt-4 overflow-auto rounded-3xl border border-line bg-walnut p-4 text-xs leading-relaxed text-paper-deep sm:text-sm">
        <code>{source}</code>
      </pre>
    </div>
  );
}
