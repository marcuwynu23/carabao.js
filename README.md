<h1 align="center">Carabao.js</h1>

<p align="center">
  <a href="https://github.com/marcuwynu23/carabao.js/blob/main/LICENSE"><img src="https://img.shields.io/github/license/marcuwynu23/carabao.js" alt="GitHub license"></a>
  <a href="https://github.com/marcuwynu23/carabao.js/stargazers"><img src="https://img.shields.io/github/stars/marcuwynu23/carabao.js" alt="GitHub stars"></a>
</p>

<p align="center">
  A Laravel-inspired Node.js web framework. TypeScript-first, convention-over-configuration, built on Express.
</p>

## Getting Started

```bash
npx carabao create my-app
cd my-app
npm install
npm run build
npm start
```

Scaffolds a complete project structure with routes, controllers, middlewares, and views — no manual wiring required.

## Usage

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

The framework auto-discovers routes, controllers, and middlewares from the `app/` directory.

## Project Structure

```
my-app/
├── index.ts
├── esbuild.config.js
├── tsconfig.json
├── .env
├── app/
│   ├── config/
│   │   ├── routes.ts
│   │   └── views.ts
│   ├── controllers/
│   ├── middlewares/
│   ├── constants/
│   ├── database/
│   └── views/
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
npm run build    # Compile TypeScript → dist/cjs + dist/esm
npm test         # Run test suite
npm start        # Launch development server
```

## License

MIT &mdash; see [LICENSE](LICENSE) for details.
