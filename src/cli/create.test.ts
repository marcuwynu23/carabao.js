import fs from "fs";
import path from "path";
import os from "os";
import { runCreate } from "./create";

describe("CLI create", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "carabao-create-"));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true });
    } catch {
      // ignore
    }
  });

  it("creates project directory and files", () => {
    runCreate("my-app", tmpDir);
    const root = path.join(tmpDir, "my-app");
    expect(fs.existsSync(root)).toBe(true);
    expect(fs.existsSync(path.join(root, "index.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "esbuild.config.js"))).toBe(true);
    expect(fs.existsSync(path.join(root, "tsconfig.json"))).toBe(true);
    expect(fs.existsSync(path.join(root, "package.json"))).toBe(true);
    expect(fs.existsSync(path.join(root, ".env.example"))).toBe(true);
  });

  it("creates app structure", () => {
    runCreate("my-app", tmpDir);
    const root = path.join(tmpDir, "my-app");
    expect(fs.existsSync(path.join(root, "app", "config", "routes.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "app", "controllers", "controllers.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "app", "middlewares", "middlewares.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "app", "constants", "constants.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "app", "database", "database.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "public"))).toBe(true);
  });

  it("package.json has correct scripts and dependencies", () => {
    runCreate("hello-world", tmpDir);
    const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, "hello-world", "package.json"), "utf8"));
    expect(pkg.name).toBe("hello-world");
    expect(pkg.scripts.build).toBe("node esbuild.config.js");
    expect(pkg.scripts.start).toBe("node dist/index.js");
    expect(pkg.scripts.dev).toBe("tsx watch index.ts");
    expect(pkg.devDependencies.tsx).toBeDefined();
  });

  it("index.ts imports app modules directly", () => {
    runCreate("my-app", tmpDir);
    const content = fs.readFileSync(path.join(tmpDir, "my-app", "index.ts"), "utf8");
    expect(content).toContain('import routes from "./app/config/routes"');
    expect(content).toContain('import controllers from "./app/controllers/controllers"');
    expect(content).toContain('import middlewares from "./app/middlewares/middlewares"');
    expect(content).toContain("createApp({ root, routes, controllers, middlewares, constants, database })");
  });

  it("routes.ts exports route map", () => {
    runCreate("my-app", tmpDir);
    const content = fs.readFileSync(path.join(tmpDir, "my-app", "app", "config", "routes.ts"), "utf8");
    expect(content).toContain("home: \"/\"");
    expect(content).toContain("about: \"/about\"");
    expect(content).toContain("welcome: \"/welcome\"");
  });

  it("controllers.ts exports controller classes", () => {
    runCreate("my-app", tmpDir);
    const content = fs.readFileSync(path.join(tmpDir, "my-app", "app", "controllers", "controllers.ts"), "utf8");
    expect(content).toContain("export class welcome");
    expect(content).toContain("export class home");
    expect(content).toContain("export class about");
    expect(content).toContain("res.json");
    expect(content).toContain("export default { welcome, home, about }");
  });

  it("esbuild.config.js bundles single entry", () => {
    runCreate("my-app", tmpDir);
    const content = fs.readFileSync(path.join(tmpDir, "my-app", "esbuild.config.js"), "utf8");
    expect(content).toContain("entryPoints: [\"index.ts\"]");
    expect(content).toContain("bundle: true");
    expect(content).toContain("outfile: \"dist/index.js\"");
  });

  it("throws if directory exists", () => {
    runCreate("my-app", tmpDir);
    expect(() => runCreate("my-app", tmpDir)).toThrow("already exists");
  });
});
