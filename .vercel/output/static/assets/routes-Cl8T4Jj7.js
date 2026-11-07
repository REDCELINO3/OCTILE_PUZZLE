import{i as e,n as t,r as n,t as r}from"./index-D-aVuZl2.js";var i=r(`check`,[[`path`,{d:`M20 6 9 17l-5-5`,key:`1gmf2c`}]]),a=r(`copy`,[[`rect`,{width:`14`,height:`14`,x:`8`,y:`8`,rx:`2`,ry:`2`,key:`17jyea`}],[`path`,{d:`M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2`,key:`zix9uf`}]]),o=r(`pause`,[[`rect`,{x:`14`,y:`4`,width:`4`,height:`16`,rx:`1`,key:`zuxfzm`}],[`rect`,{x:`6`,y:`4`,width:`4`,height:`16`,rx:`1`,key:`1okwgv`}]]),s=r(`play`,[[`polygon`,{points:`6 3 20 12 6 21 6 3`,key:`1oa8hb`}]]),c=r(`rotate-ccw`,[[`path`,{d:`M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`,key:`1357e3`}],[`path`,{d:`M3 3v5h5`,key:`1xhq8a`}]]),l=r(`route`,[[`circle`,{cx:`6`,cy:`19`,r:`3`,key:`1kj8tv`}],[`path`,{d:`M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15`,key:`1d8sl`}],[`circle`,{cx:`18`,cy:`5`,r:`3`,key:`gq8acd`}]]),u=r(`shuffle`,[[`path`,{d:`m18 14 4 4-4 4`,key:`10pe0f`}],[`path`,{d:`m18 2 4 4-4 4`,key:`pucp1d`}],[`path`,{d:`M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22`,key:`1ailkh`}],[`path`,{d:`M2 6h1.972a4 4 0 0 1 3.6 2.2`,key:`km57vx`}],[`path`,{d:`M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45`,key:`os18l9`}]]),d=r(`skip-back`,[[`polygon`,{points:`19 20 9 12 19 4 19 20`,key:`o2sva`}],[`line`,{x1:`5`,x2:`5`,y1:`19`,y2:`5`,key:`1ocqjk`}]]),f=r(`skip-forward`,[[`polygon`,{points:`5 4 15 12 5 20 5 4`,key:`16p6eg`}],[`line`,{x1:`19`,x2:`19`,y1:`5`,y2:`19`,key:`futhcm`}]]),p=e(n(),1),m=[1,2,3,4,5,6,7,8,0],h={up:`down`,down:`up`,left:`right`,right:`left`},g={up:{dr:-1,dc:0},down:{dr:1,dc:0},left:{dr:0,dc:-1},right:{dr:0,dc:1}},_=[{id:`light`,label:`Light`,board:[1,2,3,4,5,6,0,7,8]},{id:`twist`,label:`Twist`,board:[1,2,3,5,0,6,4,7,8]},{id:`far`,label:`Far`,board:[8,6,7,2,5,4,3,0,1]}];function v(e){for(let t=0;t<9;t++)if(e[t]!==m[t])return!1;return!0}function y(e){let t=e.filter(e=>e!==0),n=0;for(let e=0;e<t.length;e++)for(let r=e+1;r<t.length;r++)t[e]>t[r]&&n++;return n}function b(e){return y(e)%2==0}function x(e){let t=0;for(let n=0;n<9;n++){let r=e[n];if(r===0)continue;let i=r-1;t+=Math.abs((n/3|0)-(i/3|0))+Math.abs(n%3-i%3)}return t}function S(e,t){let n=e.indexOf(0),r=n/3|0,i=n%3,{dr:a,dc:o}=g[t],s=r+a,c=i+o;if(s<0||s>2||c<0||c>2)return null;let l=s*3+c,u=e.slice();return u[n]=u[l],u[l]=0,u}function C(e,t){let n=e.indexOf(0);if(t===n)return null;let r=t/3|0,i=t%3,a=n/3|0,o=n%3;if(Math.abs(r-a)+Math.abs(i-o)!==1)return null;let s=e.slice();return s[n]=s[t],s[t]=0,s}function w(e,t,n){let r=e.slice(),i=r[t];return r[t]=r[n],r[n]=i,r}function T(e,t=Math.random){let n=m.slice(),r=-1,i=[`up`,`down`,`left`,`right`];for(let a=0;a<e;a++){let e=n.indexOf(0),a=i.filter(e=>{let t=S(n,e);return t!==null&&t.indexOf(0)!==r}),o=a.length>0?a:i.filter(e=>S(n,e)),s=o[Math.floor(t()*o.length)],c=S(n,s);c&&(r=e,n=c)}return n}var E=class{nodes=[];get size(){return this.nodes.length}push(e){let t=this.nodes;t.push(e);let n=t.length-1;for(;n>0;){let e=n-1>>1;if(!D(t[n],t[e]))break;let r=t[n];t[n]=t[e],t[e]=r,n=e}}pop(){let e=this.nodes;if(e.length===0)return;let t=e[0],n=e.pop();if(e.length>0){e[0]=n;let t=0;for(;;){let n=t*2+1,r=n+1,i=t;if(n<e.length&&D(e[n],e[i])&&(i=n),r<e.length&&D(e[r],e[i])&&(i=r),i===t)break;let a=e[t];e[t]=e[i],e[i]=a,t=i}}return t}};function D(e,t){return e.f===t.f?e.h===t.h?e.seq<t.seq:e.h<t.h:e.f<t.f}function O(e){return e.join(``)}function k(e){let t=Array(9);for(let n=0;n<9;n++)t[n]=Number(e[n]);return t}function A(e){let t=performance.now(),n=x(e),r=y(e),i={manhattan:n,inversions:r,boards:[e.slice()],moves:[],steps:0,expanded:0,generated:0,peakHeap:0};if(!b(e))return{...i,solvable:!1,steps:-1,elapsedMs:performance.now()-t};let a=O(e),o=O(m);if(a===o)return{...i,solvable:!0,elapsedMs:performance.now()-t};let s=new Map([[a,0]]),c=new Map,l=new Map,u=new E,d=0;u.push({f:n,h:n,seq:d++,key:a});let f=1,p=0,_=1,v=new Set;for(;u.size>0;){let e=u.pop(),i=e.f-e.h;if(s.get(e.key)!==i||v.has(e.key))continue;if(e.key===o){let e=[o];for(;c.has(e[e.length-1]);)e.push(c.get(e[e.length-1]));e.reverse();let i=e.map(k),a=[];for(let t=1;t<e.length;t++)a.push(l.get(e[t]));return{solvable:!0,steps:a.length,moves:a,boards:i,expanded:p,generated:_,peakHeap:f,manhattan:n,inversions:r,elapsedMs:performance.now()-t}}v.add(e.key),p++;let a=k(e.key),m=a.indexOf(0),y=m/3|0,b=m%3;for(let t of[`up`,`down`,`left`,`right`]){let{dr:n,dc:r}=g[t],o=y+n,p=b+r;if(o<0||o>2||p<0||p>2)continue;let v=o*3+p,S=a[v],C=a.slice();C[m]=S,C[v]=0;let w=O(C),T=i+1,E=s.get(w);if(E!==void 0&&T>=E)continue;s.set(w,T),c.set(w,e.key),l.set(w,{tile:S,dir:h[t]});let D=x(C);u.push({f:T+D,h:D,seq:d++,key:w}),u.size>f&&(f=u.size),_++}}return{...i,solvable:!1,steps:-1,expanded:p,generated:_,peakHeap:f,elapsedMs:performance.now()-t}}function j(e){return`"""
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
START = (${e.join(`, `)})


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
`}var M=t(),N=460;function P(){let[e,t]=(0,p.useState)(()=>_[1].board.slice()),[n,r]=(0,p.useState)(`arrange`),[i,a]=(0,p.useState)(null),[h,g]=(0,p.useState)(0),[E,D]=(0,p.useState)(()=>_[1].board.slice()),[O,k]=(0,p.useState)(null),[P,F]=(0,p.useState)(null),[I,L]=(0,p.useState)(0),[R,z]=(0,p.useState)(!1),[B,V]=(0,p.useState)(!1),[ie,H]=(0,p.useState)(!1),[ae,U]=(0,p.useState)(!1),W=(0,p.useRef)(0),G=(0,p.useRef)(null);(0,p.useEffect)(()=>{W.current=I},[I]),(0,p.useEffect)(()=>{G.current=P},[P]),(0,p.useEffect)(()=>{if(!R)return;let e=0,t=performance.now(),n=0,r=i=>{let a=Math.min(80,i-t);if(t=i,n+=a,n>=N){n-=N;let e=G.current;if(!e||W.current>=e.steps){z(!1);return}U(!1),L(t=>Math.min(e.steps,t+1))}e=requestAnimationFrame(r)};return e=requestAnimationFrame(r),()=>cancelAnimationFrame(e)},[R]);let K=P?P.boards[I]??e:e,q=b(e),J=x(e),Y=y(e);function X(e){t(e),D(e.slice()),g(0),k(null),a(null),F(null),z(!1),L(0)}function Z(e){if(!e||P||B)return;let n=h+1,r=E;t(e),g(n),k(null),v(e)&&window.setTimeout(()=>{let e=A(r);k(e.solvable?e.steps:null)},40)}function oe(t){Z(S(e,t))}function se(t){P||B||(n===`slide`?Z(C(e,t)):i===null?a(t):i===t?a(null):X(w(e,i,t)))}function ce(){if(B)return;let t=e.slice();V(!0),z(!1),a(null),window.setTimeout(()=>{let e=A(t);F(e),L(0),U(!0),V(!1)},40)}function Q(e){let t=G.current;if(!t)return;z(!1);let n=W.current,r=Math.max(0,Math.min(t.steps,n+e));U(Math.abs(r-n)>1),L(r)}(0,p.useEffect)(()=>{let e=e=>{let t=e.target;if(t instanceof HTMLElement&&(t.tagName===`INPUT`||t.tagName===`TEXTAREA`))return;let r={ArrowUp:`up`,ArrowDown:`down`,ArrowLeft:`left`,ArrowRight:`right`}[e.key];r&&(e.preventDefault(),G.current?((r===`right`||r===`down`)&&Q(1),(r===`left`||r===`up`)&&Q(-1)):n===`slide`&&oe(r))};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)});async function le(){let t=j(P?P.boards[0]:e);try{await navigator.clipboard.writeText(t),H(!0),window.setTimeout(()=>H(!1),1600)}catch{H(!1)}}let $=P&&I>0?P.moves[I-1]:null;return(0,M.jsxs)(`main`,{className:`lab mx-auto w-full max-w-6xl gap-8 px-4 py-6 lg:px-6`,children:[(0,M.jsxs)(`section`,{className:`min-w-0`,children:[(0,M.jsx)(`p`,{className:`font-display text-sm tracking-widest text-brass uppercase`,children:`8-puzzle`}),(0,M.jsx)(`h1`,{className:`font-display mt-1 text-4xl leading-none font-medium text-paper`,children:`Octile`}),(0,M.jsx)(`p`,{className:`mt-3 max-w-sm text-base leading-relaxed text-muted`,children:`You arrange the numbers. A* answers with the fewest slides.`}),(0,M.jsx)(`div`,{className:`desk mt-5`,children:(0,M.jsxs)(`div`,{className:`relative aspect-square w-full`,role:`group`,"aria-label":`Eight puzzle`,children:[Array.from({length:9},(e,t)=>(0,M.jsx)(`span`,{className:`well`,"data-c":t%3,"data-r":t/3|0,"aria-hidden":!0},t)),K.map((e,t)=>e===0?null:(0,M.jsx)(`button`,{type:`button`,className:`tile`,"data-c":t%3,"data-r":t/3|0,"data-selected":i===t,"data-instant":ae,disabled:!!P||B,onClick:()=>se(t),"aria-label":`Tile ${e}${i===t?`, selected`:``}`,children:(0,M.jsx)(`span`,{className:`tile-face`,children:e})},e))]})}),(0,M.jsxs)(`div`,{className:`mt-3 flex items-center justify-between gap-3`,children:[(0,M.jsx)(`p`,{className:`text-sm text-muted`,"aria-live":`polite`,children:P?`Playback is on. Rearrange to edit the numbers.`:n===`arrange`?`Tap two tiles to swap, including the gap.`:`Tap a neighbor of the gap, or use the arrow keys.`}),(0,M.jsx)(ee,{})]}),!P&&(0,M.jsxs)(`button`,{type:`button`,className:`mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brass px-4 text-base font-medium text-ink disabled:opacity-60`,onClick:ce,disabled:B,children:[(0,M.jsx)(l,{className:`size-4`,"aria-hidden":!0}),B?`Searching…`:q?`Solve with A*`:`Explain why it fails`]}),(0,M.jsxs)(`p`,{className:`mt-3 text-sm text-muted`,children:[`At least `,(0,M.jsx)(`span`,{className:`text-paper`,children:J}),` slide`,J===1?``:`s`,` by Manhattan. Inversions `,Y,` (`,Y%2==0?`even, solvable`:`odd, impossible`,`).`]}),!q&&!P&&(0,M.jsx)(`p`,{className:`mt-2 text-sm leading-relaxed text-paper`,children:`Odd parity cannot reach the goal. Swap any two numbered tiles to flip it.`}),n===`slide`&&!P&&(0,M.jsxs)(`p`,{className:`mt-2 text-sm text-muted`,"aria-live":`polite`,children:[`Your slides from this setup: `,h,`.`,v(e)&&h>0&&O===null&&` Checking the optimal length…`,v(e)&&O!==null&&(0,M.jsxs)(M.Fragment,{children:[` `,`You finished in `,h,`. Optimal is `,O,h===O?` — that was perfect.`:`.`]})]}),(0,M.jsxs)(`div`,{className:`mt-4 grid grid-cols-2 rounded-full bg-panel p-1`,children:[(0,M.jsx)(`button`,{type:`button`,"aria-pressed":n===`arrange`,className:`min-h-12 rounded-full text-sm font-medium ${n===`arrange`?`bg-paper text-ink`:`text-muted`}`,onClick:()=>{r(`arrange`),a(null)},children:`Arrange`}),(0,M.jsx)(`button`,{type:`button`,"aria-pressed":n===`slide`,className:`min-h-12 rounded-full text-sm font-medium ${n===`slide`?`bg-paper text-ink`:`text-muted`}`,onClick:()=>{r(`slide`),a(null),P||(D(e.slice()),g(0),k(null))},children:`Slide`})]}),(0,M.jsxs)(`div`,{className:`mt-3 flex max-w-full gap-2 overflow-x-auto`,children:[_.map(e=>(0,M.jsx)(`button`,{type:`button`,className:`min-h-12 shrink-0 rounded-full border border-line px-4 text-sm text-paper`,onClick:()=>X(e.board.slice()),children:e.label},e.id)),(0,M.jsxs)(`button`,{type:`button`,className:`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm text-paper`,onClick:()=>X(T(30)),children:[(0,M.jsx)(u,{className:`size-4`,"aria-hidden":!0}),`Scramble`]}),(0,M.jsxs)(`button`,{type:`button`,className:`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full border border-line px-4 text-sm text-paper`,onClick:()=>X(m.slice()),children:[(0,M.jsx)(c,{className:`size-4`,"aria-hidden":!0}),`Goal`]})]})]}),(0,M.jsxs)(`section`,{className:`min-w-0`,children:[(0,M.jsx)(te,{result:P,frame:I,searching:B,moveLabel:$}),P&&P.solvable&&P.steps>0&&(0,M.jsxs)(`div`,{className:`mt-4 flex flex-wrap items-center gap-2`,children:[(0,M.jsx)(`button`,{type:`button`,className:`inline-flex size-12 items-center justify-center rounded-full border border-line text-paper`,onClick:()=>{z(!1),U(!0),L(0)},"aria-label":`Back to the start of the path`,children:(0,M.jsx)(d,{className:`size-4`,"aria-hidden":!0})}),(0,M.jsx)(`button`,{type:`button`,className:`inline-flex size-12 items-center justify-center rounded-full bg-paper text-ink`,onClick:()=>{I>=P.steps?(U(!0),L(0),z(!0)):z(e=>!e)},"aria-label":R?`Pause`:`Play the path`,children:R?(0,M.jsx)(o,{className:`size-4`,"aria-hidden":!0}):(0,M.jsx)(s,{className:`size-4`,"aria-hidden":!0})}),(0,M.jsx)(`button`,{type:`button`,className:`inline-flex size-12 items-center justify-center rounded-full border border-line text-paper`,onClick:()=>Q(1),"aria-label":`Next slide`,children:(0,M.jsx)(f,{className:`size-4`,"aria-hidden":!0})}),(0,M.jsxs)(`span`,{className:`ml-1 text-sm text-muted`,children:[`Step `,I,` of `,P.steps,$?` · slide ${$.tile} ${$.dir}`:` · start`]}),(0,M.jsx)(`button`,{type:`button`,className:`ml-auto min-h-12 rounded-full border border-line px-4 text-sm text-paper`,onClick:()=>X(P.boards[0].slice()),children:`Rearrange`})]}),P&&P.solvable&&P.steps>0&&(0,M.jsx)(`ol`,{className:`mt-4 flex max-h-40 flex-wrap gap-2 overflow-auto`,children:P.moves.map((e,t)=>{let n=t===I-1;return(0,M.jsx)(`li`,{children:(0,M.jsxs)(`button`,{type:`button`,className:`min-h-10 rounded-full px-3 text-sm ${n?`bg-brass text-ink`:`bg-panel text-paper`}`,onClick:()=>{z(!1),U(Math.abs(t+1-I)>1),L(t+1)},children:[t+1,`. `,e.tile,` `,e.dir]})},`${e.tile}-${t}`)})}),P&&(0,M.jsx)(`button`,{type:`button`,className:`mt-4 min-h-12 rounded-full border border-line px-4 text-sm text-paper`,onClick:()=>X(K.slice()),children:`Pose a different board`}),(0,M.jsx)(ne,{board:P?P.boards[0]:e,result:P,shown:K,frame:I}),(0,M.jsx)(re,{source:j(P?P.boards[0]:e),copied:ie,onCopy:le})]})]})}function ee(){return(0,M.jsxs)(`div`,{className:`shrink-0`,children:[(0,M.jsx)(`p`,{className:`mb-1 text-right text-xs tracking-wide text-muted uppercase`,children:`Goal`}),(0,M.jsx)(`div`,{className:`grid grid-cols-3 gap-0.5`,"aria-hidden":!0,children:m.map((e,t)=>(0,M.jsx)(`span`,{className:`grid size-5 place-items-center rounded-sm text-xs ${e===0?`bg-walnut text-transparent`:`bg-paper text-ink`}`,children:e===0?`·`:e},t))})]})}function te({result:e,frame:t,searching:n,moveLabel:r}){if(n)return(0,M.jsxs)(`div`,{className:`rounded-3xl border border-line bg-walnut px-5 py-6`,"aria-live":`polite`,children:[(0,M.jsx)(`p`,{className:`text-sm tracking-wide text-brass uppercase`,children:`A* search`}),(0,M.jsx)(`p`,{className:`font-display mt-2 text-3xl text-paper`,children:`Walking f = g + h…`})]});if(!e)return(0,M.jsxs)(`div`,{className:`rounded-3xl border border-line bg-walnut px-5 py-6`,children:[(0,M.jsx)(`p`,{className:`text-sm tracking-wide text-brass uppercase`,children:`Waiting on a position`}),(0,M.jsx)(`p`,{className:`font-display mt-2 text-3xl leading-tight text-paper`,children:`Set the tiles, then ask for the step count.`}),(0,M.jsx)(`p`,{className:`mt-3 max-w-xl text-sm leading-relaxed text-muted`,children:`Arrange mode can build any of the 9! layouts, solvable or not. Slide mode only walks legal moves. A* uses Manhattan distance, so the number it returns is the shortest possible path.`})]});if(!e.solvable)return(0,M.jsxs)(`div`,{className:`rounded-3xl border border-line bg-walnut px-5 py-6`,"aria-live":`polite`,children:[(0,M.jsx)(`p`,{className:`text-sm tracking-wide text-brass uppercase`,children:`No solution`}),(0,M.jsx)(`p`,{className:`font-display mt-2 text-3xl text-paper`,children:`Unreachable goal`}),(0,M.jsxs)(`p`,{className:`mt-3 max-w-xl text-sm leading-relaxed text-muted`,children:[e.inversions,` inversions is odd. Sliding preserves parity, and the goal has zero inversions, so this start is not in the same connected component.`]})]});let i=x(e.boards[t]??e.boards[0]),a=t;return(0,M.jsxs)(`div`,{className:`rounded-3xl border border-line bg-walnut px-5 py-6`,"aria-live":`polite`,children:[(0,M.jsx)(`p`,{className:`text-sm tracking-wide text-brass uppercase`,children:`Optimal path cost`}),(0,M.jsx)(`p`,{className:`font-display mt-1 text-7xl leading-none text-paper`,children:e.steps}),(0,M.jsx)(`p`,{className:`mt-2 text-base text-paper`,children:e.steps===0?`Already the goal.`:e.steps===1?`slide`:`slides`}),(0,M.jsxs)(`dl`,{className:`mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4`,children:[(0,M.jsx)(F,{label:`g along path`,value:String(a)}),(0,M.jsx)(F,{label:`h here`,value:String(i)}),(0,M.jsx)(F,{label:`f = g + h`,value:String(a+i)}),(0,M.jsx)(F,{label:`Expanded`,value:e.expanded.toLocaleString()}),(0,M.jsx)(F,{label:`Generated`,value:e.generated.toLocaleString()}),(0,M.jsx)(F,{label:`Peak heap`,value:e.peakHeap.toLocaleString()}),(0,M.jsx)(F,{label:`h(start)`,value:String(e.manhattan)}),(0,M.jsx)(F,{label:`Search`,value:`${e.elapsedMs<10?e.elapsedMs.toFixed(1):Math.round(e.elapsedMs)} ms`})]}),r&&(0,M.jsxs)(`p`,{className:`mt-4 text-sm text-muted`,children:[`Last action: slide tile `,r.tile,` `,r.dir,`.`]})]})}function F({label:e,value:t}){return(0,M.jsxs)(`div`,{className:`rounded-2xl bg-panel px-3 py-2`,children:[(0,M.jsx)(`dt`,{className:`text-xs tracking-wide text-muted uppercase`,children:e}),(0,M.jsx)(`dd`,{className:`mt-1 font-display text-2xl text-paper`,children:t})]})}function ne({board:e,shown:t,result:n,frame:r}){let i=[0,1,2].map(t=>e.slice(t*3,t*3+3).join(` `)).join(` / `);return(0,M.jsxs)(`div`,{className:`mt-8`,children:[(0,M.jsx)(`h2`,{className:`font-display text-2xl text-paper`,children:`Problem formulation`}),(0,M.jsxs)(`dl`,{className:`mt-4 grid gap-3`,children:[(0,M.jsx)(I,{k:`State`,v:`Permutation of {0,1,…,8}. 0 is the blank. Read row by row.`}),(0,M.jsx)(I,{k:`Initial`,v:i}),(0,M.jsx)(I,{k:`Actions`,v:`Slide a tile that shares an edge with the blank: up, down, left, or right.`}),(0,M.jsx)(I,{k:`Transition`,v:`Swap that tile with 0. Cost of every action is 1.`}),(0,M.jsx)(I,{k:`Goal test`,v:`Board equals 1 2 3 / 4 5 6 / 7 8 0.`}),(0,M.jsx)(I,{k:`Heuristic`,v:`h = Manhattan distance over tiles 1–8. At the start, h = ${x(e)}. It is admissible, so A* will not stop early on a longer path.`}),(0,M.jsx)(I,{k:`A*`,v:`Order the frontier by f(n) = g(n) + h(n). g is slides from your initial state. Ties break toward a smaller h. Because h is consistent, the first time the goal leaves the heap, g is optimal.`}),n?.solvable&&(0,M.jsx)(I,{k:`On this path`,v:`Frame ${r}: g = ${r}, h = ${x(t)}, f = ${r+x(t)}. Optimal g* = ${n.steps}.`})]})]})}function I({k:e,v:t}){return(0,M.jsxs)(`div`,{className:`form-row border-t border-line py-3`,children:[(0,M.jsx)(`dt`,{className:`text-sm text-brass`,children:e}),(0,M.jsx)(`dd`,{className:`text-sm leading-relaxed text-paper`,children:t})]})}function re({source:e,copied:t,onCopy:n}){return(0,M.jsxs)(`div`,{className:`mt-8`,children:[(0,M.jsxs)(`div`,{className:`flex items-end justify-between gap-3`,children:[(0,M.jsx)(`h2`,{className:`font-display text-2xl text-paper`,children:`Same search, in Python`}),(0,M.jsxs)(`button`,{type:`button`,className:`inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-4 text-sm text-paper`,onClick:n,children:[t?(0,M.jsx)(i,{className:`size-4`,"aria-hidden":!0}):(0,M.jsx)(a,{className:`size-4`,"aria-hidden":!0}),t?`Copied`:`Copy`]})]}),(0,M.jsx)(`p`,{className:`mt-2 text-sm leading-relaxed text-muted`,children:`The board runs this formulation in the browser, so the step count shows up immediately. START is the position you arranged. Paste it into Python to print the same path.`}),(0,M.jsx)(`pre`,{className:`code-scroll mt-4 overflow-auto rounded-3xl border border-line bg-walnut p-4 text-xs leading-relaxed text-paper-deep sm:text-sm`,children:(0,M.jsx)(`code`,{children:e})})]})}function L(){return(0,M.jsx)(P,{})}export{L as component};