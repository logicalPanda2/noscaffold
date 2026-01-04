# noscaffold
noscaffold is an opinionated, post-scaffold CLI automation tool for React + Vite projects.

It speeds up the setup process by:
- Skipping interactive vite prompts (defaults to React + TypeScript)
- Applying tailwind
- Setting up the testing environment with Vitest
- Applying the recommended ESLint rules for TypeScript
- Removing pre-configured files, folders, and programs
- Formatting with Prettier
- Making an initial commit with Git

## Installation
Installation is optional. noscaffold is meant to be run via `npx`. 

### Requirements
- Node.js 18+
- npm 9+

### Command
```
npm install -g noscaffold
```

## Usage
Run the following command inside the directory you want your project to be in:
```
npx noscaffold
```
You will then be prompted for a required project name.

Once provided, the tool will start to scaffold and configure the project.

When all processes are done, you will see:
```
> Setup finished successfully.
```

## Author
Marcelino Romeo @logicalPanda2 (https://github.com/logicalPanda2)

## License
This project is licensed under the <a href="./LICENSE.txt">MIT License</a>.