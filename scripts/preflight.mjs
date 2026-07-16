#!/usr/bin/env node

import { execSync } from "node:child_process";

try {
  execSync("npm run typecheck", { stdio: "inherit" });
  execSync("npm run lint", { stdio: "inherit" });
} catch (error) {
  process.exitCode = 1;
}