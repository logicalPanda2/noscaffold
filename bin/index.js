#!/usr/bin/env node

import { run } from "../src/run.js";

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
