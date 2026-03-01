import { execa } from "execa";
import prompts from "prompts";
import { readFile, writeFile } from "fs/promises";
import { rm } from "fs/promises";
import path from "path";
import process from "process";

export default async function run(): Promise<void> {
	await createReactViteProject();
}

async function createReactViteProject(): Promise<void> {
    const { name }: { name: string } = await prompts({
		type: "text",
		name: "name",
		message: "Project name:",
		validate: (str: string) => !str.trim() ? "Value cannot be empty" : true,
	});

	await initializeReactWithVite(name);

	const rootPath = path.resolve(process.cwd(), name);
	logMessage(`Project location: ${rootPath}`);

	await installMainDependencies(rootPath);
    logMessage("Installed main dependencies");

	await deletePremadeReactViteFiles(rootPath);
    logMessage("Deleted pre-configured files and folders");

	await setupPrettier(rootPath);
    logMessage("Configured Prettier settings");

    await setupESLintForPrettier(rootPath);
    logMessage("Configured ESLint for Prettier");

    await installAdditionalReactViteDependencies(rootPath);
    logMessage("Installed additional dev dependencies");

	await setupTailwindImports(rootPath);
    logMessage("Changed tailwind imports on index.css");

	await setupHTML(rootPath, name);
    logMessage("Changed index.html file");

	await setupApp(rootPath);
    logMessage("Cleaned up App.tsx");

	await setupTests(rootPath);
    logMessage("Set up testing environment");

	await setupVitePlugins(rootPath);
    logMessage("Configured vite plugins");

	await setupTsConfig(rootPath);
    logMessage("Configured TypeScript config rules");

	await setupESLintConfig(rootPath);
    logMessage("Configured ESLint lint rules");

	await addScripts(rootPath);
    logMessage("Added format and test to package.json scripts");

	await formatAllFiles(rootPath);
    logMessage("Formatted all files");

    await initializeGitRepoAndCommit(rootPath);
	logMessage("Scaffolding process finished successfully.");
}

function logMessage(message: string): void {
	console.log(`> ${message}`);
}

async function initializeReactWithVite(projectName: string): Promise<void> {
    await execa(
		"bun",
		["create", "vite@latest", projectName, "--template", "react-ts"],
		{
			input: "n\n",
			stdio: ["pipe", "inherit", "inherit"],
		},
	);
}

async function installMainDependencies(rootPath: string): Promise<void> {
    await execa("bun", ["install"], {
	    cwd: rootPath,
	    stdio: "inherit",
	});
}

async function formatAllFiles(rootPath: string): Promise<void> {
    await execa("bun", ["format"], {
	    cwd: rootPath,
	    stdio: "inherit",
	});
}

async function initializeGitRepoAndCommit(rootPath: string): Promise<void> {
    await execa("git", ["init"], {
        cwd: rootPath,
        stdio: "inherit",
    });

    await execa("git", ["add", "."], {
        cwd: rootPath,
        stdio: "inherit",
    });

    await execa("git", ["commit", "-m", "Initial commit"], {
        cwd: rootPath,
        stdio: "inherit",
    });
}

async function deletePremadeReactViteFiles(rootPath: string): Promise<void> {
	const publicPath = path.join(rootPath, "public");
	await rm(publicPath, {
		recursive: true,
		force: true,
	});

	const readmePath = path.join(rootPath, "README.md");
	await rm(readmePath, {
		recursive: true,
		force: true,
	});

	const assetsPath = path.join(rootPath, "src", "assets");
	await rm(assetsPath, {
		recursive: true,
		force: true,
	});

	const AppCssPath = path.join(rootPath, "src", "App.css");
	await rm(AppCssPath, {
		recursive: true,
		force: true,
	});
}

async function setupPrettier(rootPath: string): Promise<void> {
	const prettierConfigPath = path.join(rootPath, ".prettierrc.json");
	const prettierConfig = {
		useTabs: true,
		tabWidth: 4,
	};

	await writeFile(prettierConfigPath, JSON.stringify(prettierConfig));
}

async function setupESLintForPrettier(rootPath: string): Promise<void> {
    const eslintConfigPath = path.join(rootPath, ".eslintrc.json");
    const eslintConfig = {
		extends: ["prettier"],
	};

    await writeFile(eslintConfigPath, JSON.stringify(eslintConfig));
}

async function installAdditionalReactViteDependencies(rootPath: string): Promise<void> {
	await execa(
		"bun",
		[
			"add",
			"--dev",
			"@tailwindcss/vite",
			"prettier",
			"eslint-config-prettier",
			"eslint-plugin-react-x",
			"eslint-plugin-react-dom",
			"vitest",
			"jsdom",
			"@testing-library/react",
			"@testing-library/jest-dom",
			"@testing-library/user-event",
		],
		{
			cwd: rootPath,
			stdio: "inherit",
		},
	);
}

async function setupTailwindImports(rootPath: string): Promise<void> {
	const indexCssPath = path.join(rootPath, "src", "index.css");

	await writeFile(indexCssPath, '@import "tailwindcss";');
}

async function setupHTML(rootPath: string, projectName: string): Promise<void> {
	const indexHTMLPath = path.join(rootPath, "index.html");

	await writeFile(
		indexHTMLPath,
		`<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>${
                    projectName.split(/[\-_ ]/)
                    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
                    .join(" ")
                }</title>
            </head>
            <body>
                <div id="root"></div>
                <script type="module" src="./src/main.tsx"></script>
            </body>
        </html>`,
	);
}

async function setupApp(rootPath: string): Promise<void> {
	const AppPath = path.join(rootPath, "src", "App.tsx");

	await writeFile(
		AppPath,
		`export default function App(): Promise<void> {
            return <></>;
        }`,
	);

	const mainPath = path.join(rootPath, "src", "main.tsx");

	await writeFile(
		mainPath,
		`import { StrictMode } from "react";
        import { createRoot } from "react-dom/client";
        import "./index.css";
        import App from "./App.tsx";
        
        const root = document.getElementById("root");
        
        if(!root) {
            throw new Error("Root element not found");
        }
        
        createRoot(root).render(
            <StrictMode>
                <App />
            </StrictMode>,
        );`,
	);
}

async function setupTests(rootPath: string): Promise<void> {
	const setupTestsPath = path.join(rootPath, "src", "setupTests.ts");

	await writeFile(
		setupTestsPath,
		'import "@testing-library/jest-dom/vitest";',
	);
}

async function setupVitePlugins(rootPath: string): Promise<void> {
	const viteConfigPath = path.join(rootPath, "vite.config.ts");

	await writeFile(
		viteConfigPath,
		`import { defineConfig } from "vitest/config";
        import react from "@vitejs/plugin-react";
        import tailwindcss from "@tailwindcss/vite";
        
        export default defineConfig({
            plugins: [react(), tailwindcss()],
            test: {
                environment: "jsdom", 
                setupFiles: "./src/setupTests.ts", 
                globals: true,
            }, 
        });`,
	);
}

async function setupTsConfig(rootPath: string): Promise<void> {
	const appTsConfig = path.join(rootPath, "tsconfig.app.json");

	await writeFile(
		appTsConfig,
		`{
            "compilerOptions": {
                // vite
                "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
                "target": "ES2022",
                "useDefineForClassFields": true,
                "lib": ["ES2022", "DOM", "DOM.Iterable"],
                "module": "ESNext",
                "types": ["vite/client", "vitest/globals"],
                "moduleResolution": "bundler",
                "allowImportingTsExtensions": true,
                "noEmit": true,        
                "erasableSyntaxOnly": true,

                // type checking
                "allowUnreachableCode": false,
                "allowUnusedLabels": false,
                "exactOptionalPropertyTypes": true,
                "noFallthroughCasesInSwitch": true,
                "noImplicitReturns": true,
                "noImplicitOverride": true,
                "noPropertyAccessFromIndexSignature": false,
                "noUncheckedIndexedAccess": false,
                "noUnusedLocals": true,
                "noUnusedParameters": true,
                "strict": true,

                // dirs
                "rootDir": "./src",
                "outDir": "./dist",

                // modules
                "noUncheckedSideEffectImports": true,
                "esModuleInterop": true,
                "allowSyntheticDefaultImports": true,

                // emit
                "declaration": true,
                "declarationMap": true,
                "sourceMap": true,

                // other options
                "jsx": "react-jsx",
                "verbatimModuleSyntax": true,
                "isolatedModules": true,
                "moduleDetection": "force",
                "skipLibCheck": true
            },
            "include": ["src"],
            "exclude": ["node_modules"]
        }`,
	);
}

async function setupESLintConfig(rootPath: string): Promise<void> {
	const eslintConfigPath = path.join(rootPath, "eslint.config.js");

	await writeFile(
		eslintConfigPath,
		`import js from '@eslint/js';
        import globals from 'globals';
        import reactHooks from 'eslint-plugin-react-hooks';
        import reactRefresh from 'eslint-plugin-react-refresh';
        import tseslint from 'typescript-eslint';
        import reactX from 'eslint-plugin-react-x';
        import reactDom from 'eslint-plugin-react-dom';
        import { defineConfig, globalIgnores } from 'eslint/config';
        
        export default defineConfig([
            globalIgnores(['dist']),
            {   
                files: ['**/*.{ts,tsx}'],
                extends: [
                    js.configs.recommended,
                    tseslint.configs.recommended,
                    tseslint.configs.strictTypeChecked,
                    tseslint.configs.stylisticTypeChecked,
                    reactHooks.configs.flat.recommended,
                    reactRefresh.configs.vite,
                    reactX.configs['recommended-typescript'],
                    reactDom.configs.recommended,
                ],
                languageOptions: {
                    parserOptions: {
                        project: ['./tsconfig.node.json', './tsconfig.app.json'],
                        tsconfigRootDir: import.meta.dirname,
                    },
                    ecmaVersion: 2020,
                    globals: globals.browser,
                },
            },
        ])`,
	);
}

async function addScripts(rootPath: string): Promise<void> {
	const packageJsonPath = path.join(rootPath, "package.json");

	const packageStr = await readFile(packageJsonPath, "utf-8");
	const packageJson = JSON.parse(packageStr);

	packageJson.scripts ??= {};

	packageJson.scripts.format = "prettier . --write";
	packageJson.scripts.test = "vitest";

	await writeFile(packageJsonPath, JSON.stringify(packageJson) + "\n");
}
