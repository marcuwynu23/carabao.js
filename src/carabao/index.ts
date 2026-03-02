import { Application } from "./Application.js";
import { createApp, env } from "./bootstrap.js";

export { Application, createApp, env };
export type { CarabaoOptions, CarabaoInit, Controller, ServeResult, Request, Response, RequestHandler } from "./types.js";

// Backward compatibility alias
export { Application as Carabao };
