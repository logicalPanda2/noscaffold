import prompts from "prompts";
import { writeFile } from "fs/promises";
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
  await installDeps(projectRoot);
  await setupFormatting(projectRoot);
  await setupTailwind(projectRoot);
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

async function installDeps(projectRoot) {
  console.log("Installing dev dependencies...");

  await execa(
    "npm",
    [
      "install",
      "--save-dev",
      "@tailwindcss/vite",
      "prettier",
      "eslint-plugin-prettier",
      "eslint-config-prettier",
      "eslint-plugin-react-x",
      "eslint-plugin-react-dom",
      "vitest",
      "jsdom",
      "@testing-library/react",
      "@testing-library/jest-dom",
      "@testing-library/user-event"
    ],
    {
      cwd: projectRoot,
      stdio: "inherit"
    }
  );
}

async function setupFormatting(projectRoot) {
  console.log("Setting up Prettier and ESLint formatting...");

  const prettierConfigPath = path.join(projectRoot, ".prettierrc.json");
  const eslintConfigPath = path.join(projectRoot, ".eslintrc.json");

  const prettierConfig = {
    useTabs: true,
    tabWidth: 4
  };

  const eslintConfig = {
    extends: ["prettier"]
  };

  await writeFile(
    prettierConfigPath,
    JSON.stringify(prettierConfig)
  );

  await writeFile(
    eslintConfigPath,
    JSON.stringify(eslintConfig)
  );

  console.log("Formatting configuration written");
}

async function setupTailwind(projectRoot) {
    console.log("Importing tailwind in src/index.css");

    const indexCSSPath = path.join(projectRoot, "src", "index.css");

    await writeFile(
        indexCSSPath,
        '@import "tailwindcss";'
    )
}