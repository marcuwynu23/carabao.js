#!/usr/bin/env node

import { runCreate } from "./create.js";

const args = process.argv.slice(2);
const cmd = args[0];
let projectName = args[1];
let packageManager = "npm";

// Parse --pm or -p flag
const pmIdx = args.indexOf("--pm");
if (pmIdx === -1) {
  const pIdx = args.indexOf("-p");
  if (pIdx !== -1 && args[pIdx + 1]) {
    packageManager = args[pIdx + 1];
    projectName = args[1] === args[pIdx] ? args[2] : args[1];
  }
} else if (args[pmIdx + 1]) {
  packageManager = args[pmIdx + 1];
  projectName = args[1] === args[pmIdx] ? args[2] : args[1];
}

if (cmd === "create") {
  if (!projectName) {
    console.error("Usage: carabao create <project-name> [--pm <npm|pnpm|yarn>]");
    process.exit(1);
  }
  try {
    runCreate(projectName, process.cwd(), packageManager);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
} else if (cmd === "--help" || cmd === "-h" || !cmd) {
  console.log("Carabao – Node.js web framework");
  console.log("");
  console.log("Usage:");
  console.log("  carabao create <project-name>             Create a new project (default: npm)");
  console.log("  carabao create <project-name> --pm pnpm   Use pnpm");
  console.log("  carabao create <project-name> --pm yarn   Use yarn");
  console.log("  carabao --help                            Show this help");
} else {
  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}
