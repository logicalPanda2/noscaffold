#!/usr/bin/env node
import run from "../run.js";

try {
	run();
} catch (e) {
	console.error(e);
	process.exit(1);
}
