# noscaffold

noscaffold is an opinionated, CLI automation tool for scaffolding various kinds of React projects, such as:

1. React + Vite
2. React + Next
3. React + Express (Coming soon)

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
3. [1.0.3 Release Notes](#103-release-notes)
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

## 1.0.3 Release Notes

noscaffold 1.0.3 has been officially released on npm!

Changes:

1. **New option to scaffold Next.js project**
2. Code migrated to TypeScript
3. Use Bun as main package manager
4. Better TS config rules for React + Vite projects
5. Clearer and more descriptive messages

## License

This project is licensed under the <a href="./LICENSE.txt">MIT License</a>.
