// Runs before `npm start`, `npm run dev` and `npm run preview`: checks Node, then installs dependencies when they are
// missing (a fresh clone) or older than the lockfile (after a pull). Up to date, it does nothing and takes a moment.
import { spawnSync } from "node:child_process"
import { existsSync, statSync } from "node:fs"

const need = 24
const major = Number(process.versions.node.split(".")[0])
if (major < need) {
  console.error(
    `Serigraph needs Node.js ${need} or newer; this is ${process.version}.`,
  )
  process.exit(1)
}

// npm writes node_modules/.package-lock.json at the end of every install, so its age says when the last one finished.
const lock = "package-lock.json"
const done = "node_modules/.package-lock.json"
const fresh = !existsSync("node_modules")
const stale =
  fresh || !existsSync(done) || statSync(lock).mtimeMs > statSync(done).mtimeMs
if (!stale) process.exit(0)

// A fresh clone gets the exact tree with `npm ci`; an existing one is brought up to date in place, which leaves files
// that a running server holds open alone where it can.
const command = `npm ${fresh ? "ci" : "install"} --no-audit --no-fund`
console.log(`Installing dependencies (${command})…`)
// One fixed command string through the shell, so npm.cmd resolves on Windows.
const run = spawnSync(command, { stdio: "inherit", shell: true })
if (run.status !== 0) {
  console.error(
    "\nThe install failed. If npm reported EPERM or EBUSY, another Serigraph server (ports 4801–4803) or an editor" +
      "\nstill has a file in node_modules open: stop it (Ctrl+C in its terminal), then run the command again.",
  )
  process.exit(run.status ?? 1)
}
