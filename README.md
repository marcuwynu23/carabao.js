<h1 align="center">Carabao.js</h1>

<p align="center">
  <a href="https://github.com/marcuwynu23/carabao.js/blob/main/LICENSE"><img src="https://img.shields.io/github/license/marcuwynu23/carabao.js" alt="GitHub license"></a>
  <a href="https://github.com/marcuwynu23/carabao.js/stargazers"><img src="https://img.shields.io/github/stars/marcuwynu23/carabao.js" alt="GitHub stars"></a>
</p>

A **Laravel-like** Node.js web framework. TypeScript-first, built on Express. Convention over configuration—most wiring is hidden so you focus on routes and controllers.

---

## Create a new project (CLI)

```bash
npx carabao create my-app
cd my-app
npm install
npm run build
npm start
```

This scaffolds:

- `index.ts` – app entry (calls `createApp`, no manual wiring)
- `app/` – config, routes, controllers, middlewares, constants, database, views
- `esbuild.config.js` – build script (outputs to `dist/`)
- `tsconfig.json`, `package.json`, `.env.example`

---

## Quick start (Laravel-style)

After **create**, your `index.ts` is:

```ts
import "dotenv/config";
import path from "path";
import { createApp } from "carabao";

const root = path.join(__dirname, "..");
const app = createApp({ root });

(async () => {
  const { address, port } = await app.serve();
  console.log(`Server at http://${address}:${port}`);
})();
```

No need to require routes/controllers yourself—the framework loads them from `app/` (or `dist/app/` when built).

---

## Using as a library (CommonJS or ESM)

**CommonJS**

```js
const { Application, createApp, env } = require("carabao");

// Minimal
const app = new Application({ init: { port: 9000 } });
app.get("/", (req, res) => res.send("Hello"));
app.serve();
```

**TypeScript / ESM**

```ts
import { Application, createApp, env } from "carabao";

const app = new Application({ init: { port: 9000 } });
app.get("/", (req, res) => res.send("Hello"));
await app.serve();
```

- `main` → CommonJS build
- `module` → ESM build
- `types` → TypeScript declarations

---

## App structure (convention)

```
my-app/
├── index.ts              # Entry – createApp({ root }).serve()
├── esbuild.config.js     # Build → dist/
├── tsconfig.json
├── .env
├── app/
│   ├── config/
│   │   ├── routes.ts     # { home: "/", about: "/about" }
│   │   └── views.ts
│   ├── controllers/
│   │   └── controllers.ts
│   ├── middlewares/
│   │   └── middlewares.ts
│   ├── constants/
│   │   └── constants.ts
│   ├── database/
│   │   └── database.ts
│   └── views/            # Nunjucks templates
└── public/
```

`createApp({ root })` loads from `root/dist/app` (after build) or `root/app` (dev).

---

## Convention-based controllers

In `app/config/routes.ts`: route name → path. In `app/controllers/controllers.ts`: same-name classes with methods:

| Method   | HTTP   | Path           |
|--------|--------|----------------|
| `index`  | GET    | `/`            |
| `show`   | GET    | `/show/:id`    |
| `create` | GET    | `/create`      |
| `store`  | POST   | `/store`       |
| `edit`   | GET    | `/edit/:id`    |
| `update` | GET    | `/update/:id`  |
| `destroy`| GET    | `/destroy/:id` |

---

## Helpers

- **`env(key, default?)`** – Laravel-style env helper (from `carabao`).

---

## Development / Local usage (without publishing)

Test the framework locally before publishing to npm:

### 1. Link globally (npm link)

```bash
# In carabao.js repo root
npm link

# Then in your project directory
npm link carabao
npx carabao create my-app
```

### 2. Install from local path

```bash
# In your project directory (adjust path to carabao.js repo)
npm install /path/to/carabao.js
npx carabao create my-app
```

### 3. Pack as tarball

```bash
# In carabao.js repo root
npm pack          # creates carabao-1.0.0.tgz

# Then in your project directory
npm install /path/to/carabao-1.0.0.tgz
npx carabao create my-app
```

---

## Build & run (this repo)

```bash
npm install
npm run build    # TypeScript → dist/cjs + dist/esm
npm test         # Jest
npm start        # Run app (uses app/ and dist/cjs)
```

---

## Tests

- **Application** – create app, default/custom init, get/post routes, route+controller wiring, serve/close
- **bootstrap** – `env()` with value, default, empty
- **createApp** – loads from `app/` when `dist/app` missing, responds on /
- **CLI create** – creates project dir, app structure, package.json, rejects if dir exists

---

## License

MIT © [Mark Wayne Menorca](https://github.com/marcuwynu23)
