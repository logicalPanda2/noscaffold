# noscaffold

noscaffold is an opinionated, CLI automation tool for scaffolding various kinds of React projects, such as:

1. React + Vite
2. Next.js
3. React + Express
4. Bonus: Express only

It speeds up the setup process by:

- Defaulting to TypeScript, Tailwind, and Postgres
- Skipping interactive prompts (if any)
- Setting up tailwind
- Setting up the testing environment
- Setting up ESLint and Prettier
- Removing pre-configured files, folders, and programs (if any)
- Applying recommended TypeScript rules
- Making an initial commit with Git

**noscaffold uses Bun by default.**

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [1.1.0 Release Notes](#110-release-notes)
4. [License](#license)

## Installation

Installation is optional. noscaffold is meant to be run via `npx`/`bunx`:

```
npx noscaffold || bunx noscaffold
```

### Requirements

- Node.js 18+
- npm 9+

### Command

```
npm install -g noscaffold
```

## Usage

```
npx noscaffold || bunx noscaffold
```

Choose one out of the provided options.

Wait until the scaffolding process has finished, indicated by the following message:

```
> Scaffolding process finished successfully.
```

## 1.1.0 Release Notes

Changes:

1. **New option to scaffold React + Express projects**
2. Overall DX improvement
3. Interface rework
4. Bonus: New option to scaffold Express projects

### Note on older versions

**Do not use versions before 1.0.4, as there are unfixed bugs. The functionality on 1.0.4 is the same as on any other version(s).**

## License

This project is licensed under the <a href="./LICENSE.txt">MIT License</a>.
