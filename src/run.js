import prompts from "prompts";
import { readFile, writeFile } from "fs/promises";
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
  await setupDefaults(projectRoot, name);
  await setupScripts(projectRoot);

  await execa(
    "npm",
    ["run", "format"],
    {
        cwd: projectRoot,
        stdio: "inherit"
    }
  )

  await execa(
    "git",
    ["init"],
    {
        cwd: projectRoot,
        stdio: "inherit"
    }
  )

  await execa(
    "git",
    ["add", "."],
    {
        cwd: projectRoot,
        stdio: "inherit"
    }
  )
  await execa(
    "git",
    ["commit", "-m", "Initial commit"],
    {
        cwd: projectRoot,
        stdio: "inherit"
    }
  )
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

async function setupDefaults(projectRoot, projectName) {
    // remove html icon
    console.log("Removing HTML icon and configuring HTML title..");

    const indexHTMLPath = path.join(projectRoot, "index.html");

    await writeFile(
        indexHTMLPath,
        `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${projectName}</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`
    );

    // remove everything from App.tsx
    // make this acommodate other language options later on
    console.log("Cleaning up pre-configured src/App.tsx program..");

    const AppPath = path.join(projectRoot, "src", "App.tsx");

    await writeFile(
        AppPath,
        'export default function App() {return (<></>);}'
    );

    // bonus: remove non-null operator in main.tsx
    console.log("Fixing lint error from non-null operator in main.tsx..");

    const mainPath = path.join(projectRoot, "src", "main.tsx");

    await writeFile(
        mainPath,
        'import { StrictMode } from "react";import { createRoot } from "react-dom/client";import "./index.css";import App from "./App.tsx";const root = document.getElementById("root");if(!root) {throw new Error("root element not found");}createRoot(root).render(<StrictMode><App /></StrictMode>,);'
    );

    // setuptests
    const setupTestsPath = path.join(projectRoot, "src", "setupTests.ts");

    await writeFile(
        setupTestsPath,
        'import "@testing-library/jest-dom/vitest";'        
    );


    // import plugins
    const viteConfigPath = path.join(projectRoot, "vite.config.ts");

    await writeFile(
        viteConfigPath,
        'import { defineConfig } from "vitest/config";import react from "@vitejs/plugin-react";import tailwindcss from "@tailwindcss/vite";export default defineConfig({plugins: [react(), tailwindcss()], test: {environment: "jsdom", setupFiles: "./src/setupTests.ts", globals: true,}, });'
    );

    // adding vitest/globals to tsconfig
    const appTsConfig = path.join(projectRoot, "tsconfig.app.json");

    await writeFile(
        appTsConfig,
        '{"compilerOptions": {"tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo","target": "ES2022","useDefineForClassFields": true,"lib": ["ES2022", "DOM", "DOM.Iterable"],"module": "ESNext","types": ["vite/client", "vitest/globals"],"skipLibCheck": true,/* Bundler mode */"moduleResolution": "bundler","allowImportingTsExtensions": true,"verbatimModuleSyntax": true,"moduleDetection": "force","noEmit": true,"jsx": "react-jsx",/* Linting */"strict": true,"noUnusedLocals": true,"noUnusedParameters": true,"erasableSyntaxOnly": true,"noFallthroughCasesInSwitch": true,"noUncheckedSideEffectImports": true},"include": ["src"]}'
    );

    const eslintConfigPath = path.join(projectRoot, "eslint.config.js");

    await writeFile(
        eslintConfigPath,
        "import js from '@eslint/js';import globals from 'globals';import reactHooks from 'eslint-plugin-react-hooks';import reactRefresh from 'eslint-plugin-react-refresh';import tseslint from 'typescript-eslint';import { defineConfig, globalIgnores } from 'eslint/config';import reactX from 'eslint-plugin-react-x';import reactDom from 'eslint-plugin-react-dom';export default defineConfig([globalIgnores(['dist']),{files: ['**/*.{ts,tsx}'],extends: [js.configs.recommended,tseslint.configs.recommended,tseslint.configs.strictTypeChecked,tseslint.configs.stylisticTypeChecked,reactHooks.configs.flat.recommended,reactRefresh.configs.vite,reactX.configs['recommended-typescript'],reactDom.configs.recommended,],languageOptions: {parserOptions: {project: ['./tsconfig.node.json', './tsconfig.app.json'],tsconfigRootDir: import.meta.dirname,},ecmaVersion: 2020,globals: globals.browser,},},])"
    );
}

async function setupScripts(projectRoot) {
    console.log("Configuring package.json scripts...");

    const packageJsonPath = path.join(projectRoot, "package.json");

    const raw = await readFile(packageJsonPath, "utf-8");
    const pkg = JSON.parse(raw);

    pkg.scripts ??= {};

    // Add or override only what we care about
    pkg.scripts.format = "prettier . --write";
    pkg.scripts.test = "vitest";

    await writeFile(
        packageJsonPath,
        JSON.stringify(pkg, null, 2) + "\n"
    );

    console.log("package.json scripts updated");
}