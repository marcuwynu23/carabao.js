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
    expect(fs.existsSync(path.join(root, "app", "config", "views.ts"))).toBe(true);
    expect(fs.existsSync(path.join(root, "app", "views", "welcome.html"))).toBe(true);
    expect(fs.existsSync(path.join(root, "public"))).toBe(true);
  });

  it("package.json has project name", () => {
    runCreate("hello-world", tmpDir);
    const pkg = JSON.parse(fs.readFileSync(path.join(tmpDir, "hello-world", "package.json"), "utf8"));
    expect(pkg.name).toBe("hello-world");
    expect(pkg.scripts.build).toBeDefined();
    expect(pkg.scripts.start).toBeDefined();
  });

  it("throws if directory exists", () => {
    runCreate("my-app", tmpDir);
    expect(() => runCreate("my-app", tmpDir)).toThrow("already exists");
  });
});
