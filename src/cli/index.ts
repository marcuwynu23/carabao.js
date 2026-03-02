#!/usr/bin/env node

import { runCreate } from "./create.js";

const args = process.argv.slice(2);
const cmd = args[0];
const projectName = args[1];

if (cmd === "create") {
  if (!projectName) {
    console.error("Usage: carabao create <project-name>");
    process.exit(1);
  }
  try {
    runCreate(projectName, process.cwd());
    console.log(`Created project "${projectName}". Next steps:`);
    console.log(`  cd ${projectName}`);
    console.log("  npm install");
    console.log("  npm run build");
    console.log("  npm start");
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
} else if (cmd === "--help" || cmd === "-h" || !cmd) {
  console.log("Carabao – Laravel-like Node.js framework");
  console.log("");
  console.log("Usage:");
  console.log("  carabao create <project-name>   Create a new project");
  console.log("  carabao --help                  Show this help");
} else {
  console.error(`Unknown command: ${cmd}`);
  process.exit(1);
}
