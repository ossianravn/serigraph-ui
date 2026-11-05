// The blocks page's frames load one at a time, and none starts while the page is scrolling: each frame loads, lays out
// and hydrates a whole page on the same main thread, which stalls the scroll it starts during. Frames near the window
// go first; the rest follow in idle moments, in page order, so they are ready before the reader reaches them.

interface Entry {
  order: number
  near: boolean
  started: boolean
  start: () => void
}

const QUIET = 200
const entries: Entry[] = []
let busy = false
let lastScroll = 0
let timer: ReturnType<typeof setTimeout> | undefined
let release: ReturnType<typeof setTimeout> | undefined
let listening = false

const idle = (run: () => void) =>
  "requestIdleCallback" in window
    ? window.requestIdleCallback(run, { timeout: 3000 })
    : setTimeout(run, 300)

function schedule(delay = QUIET) {
  clearTimeout(timer)
  timer = setTimeout(run, delay)
}

function run() {
  if (busy) return
  const quiet = performance.now() - lastScroll
  if (quiet < QUIET) return schedule(QUIET - quiet)
  const next = entries
    .filter((e) => !e.started)
    .sort((a, b) => Number(b.near) - Number(a.near) || a.order - b.order)[0]
  if (!next) return
  const go = () => {
    if (busy || next.started) return
    if (performance.now() - lastScroll < QUIET) return schedule()
    busy = true
    next.started = true
    next.start()
    // A frame that never reports its load still lets the next one go.
    release = setTimeout(loaded, 8000)
  }
  if (next.near) go()
  else idle(go)
}

/** Called when a queued frame has loaded: the next one may start. */
export function loaded() {
  clearTimeout(release)
  if (!busy) return
  busy = false
  schedule(0)
}

/** Adds a frame to the queue; `start` gives it its page. Returns a setter for whether it is near the window. */
export function enqueue(start: () => void) {
  if (!listening) {
    listening = true
    addEventListener("scroll", () => (lastScroll = performance.now()), {
      passive: true,
    })
  }
  const entry: Entry = {
    order: entries.length,
    near: false,
    started: false,
    start,
  }
  entries.push(entry)
  schedule()
  return {
    near() {
      entry.near = true
      schedule(0)
    },
    remove() {
      entries.splice(entries.indexOf(entry), 1)
    },
  }
}
