import express from "express";
import nunjucks from "nunjucks";
import path from "path";
import type { RequestHandler } from "express";
import type { CarabaoOptions, ServeResult, Controller } from "./types.js";

type ControllerClass = new () => Controller;

/**
 * Carabao Application – Laravel-like Express framework.
 * Technical details hidden; configure via env and app/ structure.
 */
export class Application {
  public readonly app: express.Express;
  public readonly init: Required<CarabaoOptions["init"]> & {
    viewDir: string;
    staticDir: string;
  };
  private _routeNames: string[] = [];
  private _controllerNames: string[] = [];

  constructor(options: CarabaoOptions = {}) {
    const {
      init = {},
      database = {},
      controllers = {},
      routes = {},
      views = {},
      middlewares = [],
      constants = {},
    } = options;

    this.init = {
      name: init.name ?? "Carabao",
      address: init.address ?? "0.0.0.0",
      port: init.port != null ? Number(init.port) : 9000,
      viewDir: init.viewDir ?? path.join(process.cwd(), "views"),
      staticDir: init.staticDir ?? path.join(process.cwd(), "public"),
    };

    (this as unknown as Record<string, unknown>).database = database;
    (this as unknown as Record<string, unknown>).controllers = controllers;
    (this as unknown as Record<string, unknown>).routes = routes;
    (this as unknown as Record<string, unknown>).views = views;
    (this as unknown as Record<string, unknown>).constants = constants;
    (this as unknown as Record<string, unknown>).middlewares = Array.isArray(middlewares)
      ? middlewares
      : [];

    this.app = express();
    this.setup();
  }

  private setup(): void {
    this.appSetup();
    this.middlewareSetup();
    this.routesSetup();
    this.controllersSetup();
    this.routeAndControllerSetup();
    this.viewsSetup();
    this.databaseSetup();
  }

  private appSetup(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    try {
      this.app.use(express.static(this.init.staticDir));
    } catch {
      // ignore missing static dir
    }

    nunjucks.configure(this.init.viewDir, {
      express: this.app,
      autoescape: true,
      noCache: process.env.NODE_ENV === "development",
      watch: process.env.NODE_ENV === "development",
    });
  }

  private databaseSetup(): void {}

  private middlewareSetup(): void {
    const mw = (this as unknown as { middlewares: RequestHandler[] }).middlewares;
    mw.forEach((m) => this.app.use(m));
  }

  private routesSetup(): void {
    const routes = (this as unknown as { routes: Record<string, string> }).routes;
    this._routeNames = Object.keys(routes ?? {});
  }

  private controllersSetup(): void {
    const controllers = (this as unknown as { controllers: Record<string, ControllerClass> }).controllers;
    this._controllerNames = Object.keys(controllers ?? {});
  }

  private routeAndControllerSetup(): void {
    const routes = (this as unknown as { routes: Record<string, string> }).routes;
    const controllers = (this as unknown as { controllers: Record<string, ControllerClass> }).controllers;
    if (this._routeNames.length === 0 || this._controllerNames.length === 0) return;

    const routerMap: [string, string, string][] = [
      ["index", "get", "/"],
      ["show", "get", "/show/:id"],
      ["create", "get", "/create"],
      ["store", "post", "/store"],
      ["edit", "get", "/edit/:id"],
      ["update", "get", "/update/:id"],
      ["destroy", "get", "/destroy/:id"],
    ];

    for (const routeName of this._routeNames) {
      for (const controllerName of this._controllerNames) {
        if (routeName !== controllerName) continue;
        const router = express.Router();
        const ControllerClass = controllers![controllerName];
        const controller = new ControllerClass();
        for (const [method, verb, routePath] of routerMap) {
          const fn = (controller as Record<string, unknown>)[method];
          if (typeof fn === "function") {
            const r = router as unknown as Record<string, (p: string, h: RequestHandler) => void>;
            r[verb](routePath, (fn as RequestHandler).bind(controller));
          }
        }
        this.app.use(routes![routeName], router);
      }
    }
  }

  private viewsSetup(): void {}

  get(path: string, ...handlers: RequestHandler[]): this {
    this.app.get(path, ...handlers);
    return this;
  }

  post(path: string, ...handlers: RequestHandler[]): this {
    this.app.post(path, ...handlers);
    return this;
  }

  put(path: string, ...handlers: RequestHandler[]): this {
    this.app.put(path, ...handlers);
    return this;
  }

  patch(path: string, ...handlers: RequestHandler[]): this {
    this.app.patch(path, ...handlers);
    return this;
  }

  delete(path: string, ...handlers: RequestHandler[]): this {
    this.app.delete(path, ...handlers);
    return this;
  }

  use(...args: Parameters<express.Express["use"]>): this {
    this.app.use(...args);
    return this;
  }

  private _server: ReturnType<express.Express["listen"]> | null = null;

  serve(): Promise<ServeResult> {
    return new Promise((resolve, reject) => {
      this._server = this.app.listen(this.init.port, this.init.address, () => {
        const actualPort = (this._server?.address() as { port: number })?.port ?? this.init.port;
        resolve({
          name: this.init.name,
          address: this.init.address,
          port: actualPort,
        });
      });
      this._server.on("error", reject);
    });
  }

  close(): Promise<void> {
    return new Promise((resolve) => {
      if (this._server) {
        this._server.close(() => {
          this._server = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
