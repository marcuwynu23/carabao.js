import fs from "fs";
import path from "path";

const ROUTES_TS = `/** Route name -> path (Laravel-style). */
export default {
  home: "/",
  about: "/about",
  welcome: "/welcome",
};
`;

const CONTROLLERS_TS = `import type { Request, Response } from "carabao";

const ctx = { APP_NAME: process.env.APP_NAME ?? "App" };

export class welcome {
  index(_req: Request, res: Response) {
    return res.render("welcome.html", { ctx });
  }
}

export class home {
  index(_req: Request, res: Response) {
    return res.render("home.html", { ctx });
  }
}

export class about {
  index(_req: Request, res: Response) {
    return res.render("about.html", { ctx });
  }
}

export default { welcome, home, about };
`;

const MIDDLEWARES_TS = `import type { RequestHandler } from "carabao";

/** Add Express middlewares here. */
const middlewares: RequestHandler[] = [];

export default middlewares;
`;

const CONSTANTS_TS = `/** App-wide constants. */
export default {};
`;

const DATABASE_TS = `/** Database config. */
export default {};
`;

const VIEWS_TS = `/** View config (globals, filters). */
export default {};
`;

const INDEX_TS = `import "dotenv/config";
import path from "path";
import { createApp } from "carabao";

const root = path.join(__dirname, "..");
const app = createApp({ root });

(async () => {
  try {
    const { address, port } = await app.serve();
    console.log(\`Server running at http://\${address}:\${port}\`);
  } catch (err) {
    console.error("Server failed:", (err as Error).message);
    process.exit(1);
  }
})();
`;

const ESBUILD_CONFIG_JS = `const esbuild = require("esbuild");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

esbuild
  .build({
    entryPoints: ["index.ts", "app/config/routes.ts", "app/controllers/controllers.ts", "app/middlewares/middlewares.ts", "app/constants/constants.ts", "app/database/database.ts", "app/config/views.ts"],
    bundle: false,
    outdir: "dist",
    outbase: ".",
    platform: "node",
    format: "cjs",
    target: "node18",
    sourcemap: !isProd,
    minify: isProd,
  })
  .catch(() => process.exit(1));
`;

const TSCONFIG_JSON = `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "."
  },
  "include": ["index.ts", "app/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
`;

const PACKAGE_JSON = (name: string) => `{
  "name": "${name}",
  "version": "1.0.0",
  "private": true,
  "type": "commonjs",
  "scripts": {
    "build": "node esbuild.config.js",
    "start": "node dist/index.js",
    "dev": "node --watch dist/index.js"
  },
  "dependencies": {
    "carabao": "latest",
    "dotenv": "^16.0.0",
    "express": "^4.18.0"
  },
  "devDependencies": {
    "esbuild": "^0.19.0",
    "typescript": "^5.0.0"
  }
}
`;

const ENV_EXAMPLE = `NODE_ENV=development
APP_NAME=My App
ADDR=0.0.0.0
PORT=9000
`;

function writeFile(dir: string, file: string, content: string): void {
  const full = path.join(dir, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, "utf8");
}

/**
 * Scaffold a new Carabao project.
 * Creates app/, index.ts, esbuild.config.js, tsconfig, package.json, .env.example.
 */
export function runCreate(projectName: string, targetDir: string): void {
  const root = path.resolve(targetDir, projectName);
  if (fs.existsSync(root)) {
    throw new Error(`Directory already exists: ${root}`);
  }

  const files: [string, string][] = [
    ["index.ts", INDEX_TS],
    ["esbuild.config.js", ESBUILD_CONFIG_JS],
    ["tsconfig.json", TSCONFIG_JSON],
    [".env.example", ENV_EXAMPLE],
    ["app/config/routes.ts", ROUTES_TS],
    ["app/controllers/controllers.ts", CONTROLLERS_TS],
    ["app/middlewares/middlewares.ts", MIDDLEWARES_TS],
    ["app/constants/constants.ts", CONSTANTS_TS],
    ["app/database/database.ts", DATABASE_TS],
    ["app/config/views.ts", VIEWS_TS],
  ];

  fs.mkdirSync(root, { recursive: true });
  fs.mkdirSync(path.join(root, "public"), { recursive: true });
  fs.mkdirSync(path.join(root, "app", "views"), { recursive: true });

  for (const [file, content] of files) {
    writeFile(root, file, content);
  }

  const pkgPath = path.join(root, "package.json");
  fs.writeFileSync(pkgPath, PACKAGE_JSON(projectName), "utf8");

  // Default view
  const viewsDir = path.join(root, "app", "views");
  fs.writeFileSync(
    path.join(viewsDir, "welcome.html"),
    "<!DOCTYPE html><html><head><title>{{ ctx.APP_NAME }}</title></head><body><h1>Welcome</h1></body></html>",
    "utf8"
  );
  fs.writeFileSync(path.join(viewsDir, "home.html"), "<!DOCTYPE html><html><body><h1>Home</h1></body></html>", "utf8");
  fs.writeFileSync(path.join(viewsDir, "about.html"), "<!DOCTYPE html><html><body><h1>About</h1></body></html>", "utf8");
}
