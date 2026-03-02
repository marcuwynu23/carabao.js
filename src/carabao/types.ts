import type { Request, Response, RequestHandler } from "express";

export interface CarabaoInit {
  name?: string;
  address?: string;
  port?: number;
  viewDir?: string;
  staticDir?: string;
}

export interface CarabaoOptions {
  init?: CarabaoInit;
  routes?: Record<string, string>;
  controllers?: Record<string, new () => Controller>;
  middlewares?: RequestHandler[];
  constants?: Record<string, unknown>;
  database?: Record<string, unknown>;
  views?: Record<string, unknown>;
}

export interface Controller {
  index?(req: Request, res: Response): void | Promise<void>;
  show?(req: Request, res: Response): void | Promise<void>;
  create?(req: Request, res: Response): void | Promise<void>;
  store?(req: Request, res: Response): void | Promise<void>;
  edit?(req: Request, res: Response): void | Promise<void>;
  update?(req: Request, res: Response): void | Promise<void>;
  destroy?(req: Request, res: Response): void | Promise<void>;
}

export interface ServeResult {
  name: string;
  address: string;
  port: number;
}

export type { Request, Response, RequestHandler };
