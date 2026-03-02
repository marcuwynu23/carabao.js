import path from "path";
import { Application } from "./Application.js";
import type { CarabaoOptions, RequestHandler } from "./types.js";

/** Get env var (Laravel-style helper). */
export function env(key: string, defaultValue?: string): string {
  const v = process.env[key];
  if (v !== undefined && v !== "") return v;
  return defaultValue ?? "";
}

function loadModule<T>(...paths: string[]): T | undefined {
  for (const p of paths) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const loaded = require(p) as T | { default?: T };
      return (loaded && (loaded as { default?: T }).default !== undefined)
        ? (loaded as { default: T }).default
        : (loaded as T);
    } catch {
      // try next path
    }
  }
  return undefined;
}

/**
 * Create app from conventional app/ layout (Laravel-like).
 * Loads routes, controllers, middlewares from root/dist/app or root/app.
 */
export function createApp(options: { root: string } & Partial<CarabaoOptions>): Application {
  const root = path.resolve(options.root);
  const distApp = path.join(root, "dist", "app");
  const appDir = path.join(root, "app");

  const routes =
    loadModule<CarabaoOptions["routes"]>(
      path.join(distApp, "config", "routes.js"),
      path.join(appDir, "config", "routes.js")
    ) ?? {};

  const controllers =
    loadModule<CarabaoOptions["controllers"]>(
      path.join(distApp, "controllers", "controllers.js"),
      path.join(appDir, "controllers", "controllers.js")
    ) ?? {};

  const middlewares =
    loadModule<RequestHandler[]>(
      path.join(distApp, "middlewares", "middlewares.js"),
      path.join(appDir, "middlewares", "middlewares.js")
    ) ?? [];

  const constants =
    loadModule<CarabaoOptions["constants"]>(
      path.join(distApp, "constants", "constants.js"),
      path.join(appDir, "constants", "constants.js")
    ) ?? {};

  const database =
    loadModule<CarabaoOptions["database"]>(
      path.join(distApp, "database", "database.js"),
      path.join(appDir, "database", "database.js")
    ) ?? {};

  const views =
    loadModule<CarabaoOptions["views"]>(
      path.join(distApp, "config", "views.js"),
      path.join(appDir, "config", "views.js")
    ) ?? {};

  const viewDir = path.join(root, "app", "views");
  const staticDir = path.join(root, "public");

  return new Application({
    ...options,
    init: {
      name: process.env.APP_NAME ?? "Carabao",
      address: process.env.ADDR ?? "0.0.0.0",
      port: process.env.PORT != null ? Number(process.env.PORT) : 9000,
      viewDir,
      staticDir,
      ...options.init,
    },
    routes,
    controllers,
    middlewares: Array.isArray(middlewares) ? middlewares : [],
    constants,
    database,
    views,
  });
}
