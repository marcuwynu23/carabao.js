<h1 align="center">Carabao.js</h1>

<p align="center">
  <a href="https://github.com/marcuwynu23/carabao.js/blob/main/LICENSE"><img src="https://img.shields.io/github/license/marcuwynu23/carabao.js" alt="License"></a>
  <a href="https://github.com/marcuwynu23/carabao.js/stargazers"><img src="https://img.shields.io/github/stars/marcuwynu23/carabao.js" alt="Stars"></a>
</p>

<p align="center">
  Convention-over-configuration Node.js web framework. TypeScript-first, built on Express.
</p>

## Getting Started

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

Scaffolds a complete project with routes, controllers, middlewares, and configuration — no manual wiring required.

## Usage

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

## Project Structure

```
my-app/
├── index.ts
├── esbuild.config.js
├── tsconfig.json
├── .env
├── app/
│   ├── config/
│   │   └── routes.ts
│   ├── controllers/
│   ├── middlewares/
│   ├── constants/
│   └── database/
└── public/
```

## Installation (Library)

```bash
npm install carabao
```

**CommonJS**
```js
const { Application, createApp } = require("carabao");
const app = new Application({ init: { port: 9000 } });
app.get("/", (req, res) => res.send("Hello"));
app.serve();
```

**ESM / TypeScript**
```ts
import { Application, createApp } from "carabao";
const app = new Application({ init: { port: 9000 } });
app.get("/", (req, res) => res.send("Hello"));
await app.serve();
```

## Development

```bash
npm install
npm run build
npm test
npm start
```

## License

MIT &mdash; see [LICENSE](LICENSE) for details.
