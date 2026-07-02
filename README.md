<h1 align="center">Carabao.js</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/carabao"><img src="https://img.shields.io/npm/v/carabao" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/carabao"><img src="https://img.shields.io/npm/dm/carabao" alt="npm downloads"></a>
  <a href="https://github.com/marcuwynu23/carabao.js/blob/main/LICENSE"><img src="https://img.shields.io/github/license/marcuwynu23/carabao.js?logo=github" alt="License"></a>
  <a href="https://github.com/marcuwynu23/carabao.js/stargazers"><img src="https://img.shields.io/github/stars/marcuwynu23/carabao.js?style=flat-square&logo=github" alt="Stars"></a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" alt="Node version">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" alt="TypeScript">
</p>

<p align="center">
  <strong>MVC Node.js web framework.</strong> TypeScript-first, built on Express. Scaffold full projects with a single command.
</p>

---

## Features

- **CLI scaffolding** — `npx carabao create` generates a complete MVC project
- **TypeScript-first** — full type safety from request to response
- **Express-based** — familiar API, battle-tested foundation
- **Auto-wired routing** — controllers and routes wired automatically
- **Flexible module system** — supports both CommonJS and ESM
- **Zero-config** — sensible defaults, easy to override

---

## Getting Started

Scaffold a new project:

```bash
npx carabao create my-app
cd my-app
npm install
npm run build
npm start
```

Specify a package manager:

```bash
npx carabao create my-app --pm pnpm
npx carabao create my-app --pm yarn
```

The CLI generates a complete project skeleton with routes, controllers, middlewares, and environment configuration — no manual wiring required.

---

## Usage

### Application

```ts
import "dotenv/config";
import path from "path";
import { createApp } from "carabao";
import routes from "./app/config/routes";
import controllers from "./app/controllers/controllers";

const root = path.basename(__dirname) === "dist" ? path.resolve(__dirname, "..") : __dirname;
const app = createApp({ root, routes, controllers });

(async () => {
  const { address, port } = await app.serve();
  console.log(`Server at http://${address}:${port}`);
})();
```

### Route Definition

```ts
// app/config/routes.ts
import { controllers } from "../controllers/controllers";

export default [
  { method: "get", path: "/users", handler: controllers.getUsers },
  { method: "get", path: "/users/:id", handler: controllers.getUser },
  { method: "post", path: "/users", handler: controllers.createUser },
];
```

### Controller

```ts
// app/controllers/users.controller.ts
import { Request, Response } from "express";

export function getUsers(req: Request, res: Response) {
  res.json([{ id: 1, name: "Alice" }]);
}

export function getUser(req: Request, res: Response) {
  res.json({ id: req.params.id, name: "Alice" });
}

export function createUser(req: Request, res: Response) {
  res.status(201).json(req.body);
}
```

---

## Project Structure

```
my-app/
├── index.ts              # Entry point
├── esbuild.config.js     # Build configuration
├── tsconfig.json         # TypeScript config
├── .env                  # Environment variables
├── app/
│   ├── config/
│   │   └── routes.ts     # Route definitions
│   ├── controllers/      # Request handlers
│   ├── middlewares/       # Express middlewares
│   ├── constants/        # App constants
│   └── database/         # Database setup / models
└── public/               # Static assets
```

---

## Installation (as a library)

```bash
npm install carabao
```

### CommonJS

```js
const { Application, createApp } = require("carabao");
const app = new Application({ init: { port: 9000 } });
app.get("/", (req, res) => res.send("Hello"));
app.serve();
```

### ESM / TypeScript

```ts
import { Application, createApp } from "carabao";
const app = new Application({ init: { port: 9000 } });
app.get("/", (req, res) => res.send("Hello"));
await app.serve();
```

---

## API Reference

### `createApp(options)`

| Option        | Type      | Default          | Description                    |
| ------------- | --------- | ---------------- | ------------------------------ |
| `root`        | `string`  | `__dirname`      | Project root directory         |
| `routes`      | `Route[]` | `[]`             | Array of route definitions     |
| `controllers` | `object`  | `{}`             | Controller map for auto-wiring |
| `init`        | `object`  | `{ port: 9000 }` | Server configuration           |

### `Application`

| Method     | Description             |
| ---------- | ----------------------- |
| `get()`    | Register a GET route    |
| `post()`   | Register a POST route   |
| `put()`    | Register a PUT route    |
| `delete()` | Register a DELETE route |
| `use()`    | Mount middleware        |
| `serve()`  | Start the HTTP server   |

---

## Development

```bash
npm install
npm run build      # Compile TypeScript → JS
npm test          # Run test suite (Jest)
npm start         # Start the server
```

---

## Requirements

- **Node.js** >= 18
- **npm**, **yarn**, or **pnpm**

---

## License

MIT &mdash; see [LICENSE](LICENSE) for details.
