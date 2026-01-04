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
  
  await cleanup(projectRoot);
}

async function cleanup(projectRoot) {
  const assetsPath = path.join(projectRoot, "src", "assets");

  await rm(assetsPath, {
    recursive: true,
    force: true
  });

  console.log("Removed src/assets");

  const publicPath = path.join(projectRoot, "public");

  await rm(publicPath, {
    recursive: true,
    force: true
  })

  console.log("Removed public");

  const readmePath = path.join(projectRoot, "README.md");

  await rm(readmePath, {
    recursive: true,
    force: true
  })

  console.log("Removed README");

  const AppCSSPath = path.join(projectRoot, "src", "App.css");

  await rm(AppCSSPath, {
    recursive: true,
    force: true
  })

  console.log("Removed src/App.css");
}