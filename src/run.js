import prompts from "prompts";
import { execa } from "execa";
import { rm } from "fs/promises";
import path from "path";
import process from "process";

export async function run() {
  const { name } = await prompts({
    type: "text",
    name: "name",
    message: "Project name:",
    validate: value => value ? true : "Project name is required"
  });

  if (!name) {
    console.log("Aborted.");
    return;
  }

  await execa(
    "npm",
    ["create", "vite@latest", name],
    { stdio: "inherit" }
  );

  const projectRoot = path.resolve(process.cwd(), name);

  console.log(`Entering ${projectRoot}`);
  
  await cleanupAssets(projectRoot);
}

async function cleanupAssets(projectRoot) {
  const assetsPath = path.join(projectRoot, "src", "assets");

  await rm(assetsPath, {
    recursive: true,
    force: true
  });

  console.log("Removed src/assets");
}