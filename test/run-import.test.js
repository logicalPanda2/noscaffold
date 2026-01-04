import { test } from "node:test";
import assert from "node:assert";

test("run() can be imported", async () => {
    const mod = await import("../src/run.js");
    assert.equal(typeof mod.run, "function");
});