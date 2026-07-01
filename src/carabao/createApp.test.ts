import fs from "fs";
import path from "path";
import os from "os";
import { createApp, resolveFile } from "./bootstrap";

describe("resolveFile", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "carabao-resolve-"));
  });

  afterEach(() => {
    try { fs.rmSync(tmpDir, { recursive: true }); } catch { /* ignore */ }
  });

  it("returns exact path when file exists", () => {
    const file = path.join(tmpDir, "test.js");
    fs.writeFileSync(file, "", "utf8");
    expect(resolveFile(file)).toBe(file);
  });

  it("finds .ts when .js path given", () => {
    const ts = path.join(tmpDir, "routes.ts");
    fs.writeFileSync(ts, "", "utf8");
    const js = path.join(tmpDir, "routes.js");
    expect(resolveFile(js)).toBe(ts);
  });

  it("finds .js when .ts path given", () => {
    const js = path.join(tmpDir, "routes.js");
    fs.writeFileSync(js, "", "utf8");
    const ts = path.join(tmpDir, "routes.ts");
    expect(resolveFile(ts)).toBe(js);
  });

  it("returns undefined when no file found", () => {
    expect(resolveFile(path.join(tmpDir, "nonexistent.js"))).toBeUndefined();
  });
});

describe("createApp", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "carabao-createApp-"));
  });

  afterEach(() => {
    try { fs.rmSync(tmpDir, { recursive: true }); } catch { /* ignore */ }
  });

  it("loads app from app/ when dist/app does not exist", async () => {
    const appDir = path.join(tmpDir, "app");
    const configDir = path.join(appDir, "config");
    fs.mkdirSync(configDir, { recursive: true });
    fs.mkdirSync(path.join(appDir, "controllers"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "middlewares"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "constants"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "database"), { recursive: true });

    fs.writeFileSync(
      path.join(configDir, "routes.js"),
      "module.exports = { home: '/' };",
      "utf8"
    );
    fs.writeFileSync(
      path.join(appDir, "controllers", "controllers.js"),
      "class Home { index(_req, res) { res.send('ok'); } } module.exports = { home: Home };",
      "utf8"
    );
    fs.writeFileSync(path.join(appDir, "middlewares", "middlewares.js"), "module.exports = [];", "utf8");
    fs.writeFileSync(path.join(appDir, "constants", "constants.js"), "module.exports = {};", "utf8");
    fs.writeFileSync(path.join(appDir, "database", "database.js"), "module.exports = {};", "utf8");

    const app = createApp({ root: tmpDir, init: { port: 0 } });
    const { port } = await app.serve();

    const res = await new Promise<{ body: string }>((resolve, reject) => {
      import("http")
        .then(({ default: http }) => {
          http.get(`http://127.0.0.1:${port}/`, (res) => {
            let data = "";
            res.on("data", (ch) => (data += ch));
            res.on("end", () => resolve({ body: data }));
          }).on("error", reject);
        })
        .catch(reject);
    });

    await app.close();
    expect(res.body).toBe("ok");
  });

  it("loads .ts files when dist/app is missing", async () => {
    const appDir = path.join(tmpDir, "app");
    const configDir = path.join(appDir, "config");
    fs.mkdirSync(configDir, { recursive: true });
    fs.mkdirSync(path.join(appDir, "controllers"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "middlewares"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "constants"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "database"), { recursive: true });

    fs.writeFileSync(
      path.join(configDir, "routes.ts"),
      'export default { home: "/" };',
      "utf8"
    );
    fs.writeFileSync(
      path.join(appDir, "controllers", "controllers.ts"),
      "class Home { index(_req: any, res: any) { res.send('ok'); } } export default { home: Home };",
      "utf8"
    );
    fs.writeFileSync(path.join(appDir, "middlewares", "middlewares.ts"), "export default [];", "utf8");
    fs.writeFileSync(path.join(appDir, "constants", "constants.ts"), "export default {};", "utf8");
    fs.writeFileSync(path.join(appDir, "database", "database.ts"), "export default {};", "utf8");

    const app = createApp({ root: tmpDir, init: { port: 0 } });
    const { port } = await app.serve();

    const res = await new Promise<{ body: string }>((resolve, reject) => {
      import("http")
        .then(({ default: http }) => {
          http.get(`http://127.0.0.1:${port}/`, (res) => {
            let data = "";
            res.on("data", (ch) => (data += ch));
            res.on("end", () => resolve({ body: data }));
          }).on("error", reject);
        })
        .catch(reject);
    });

    await app.close();
    expect(res.body).toBe("ok");
  });

  it("returns 404 for unregistered route", async () => {
    const appDir = path.join(tmpDir, "app");
    const configDir = path.join(appDir, "config");
    fs.mkdirSync(configDir, { recursive: true });
    fs.mkdirSync(path.join(appDir, "controllers"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "middlewares"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "constants"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "database"), { recursive: true });

    fs.writeFileSync(path.join(configDir, "routes.js"), "module.exports = {};", "utf8");
    fs.writeFileSync(path.join(appDir, "controllers", "controllers.js"), "module.exports = {};", "utf8");
    fs.writeFileSync(path.join(appDir, "middlewares", "middlewares.js"), "module.exports = [];", "utf8");
    fs.writeFileSync(path.join(appDir, "constants", "constants.js"), "module.exports = {};", "utf8");
    fs.writeFileSync(path.join(appDir, "database", "database.js"), "module.exports = {};", "utf8");

    const app = createApp({ root: tmpDir, init: { port: 0 } });
    const { port } = await app.serve();

    const status = await new Promise<number>((resolve, reject) => {
      import("http")
        .then(({ default: http }) => {
          http.get(`http://127.0.0.1:${port}/`, (res) => {
            resolve(res.statusCode ?? 0);
          }).on("error", reject);
        })
        .catch(reject);
    });

    await app.close();
    expect(status).toBe(404);
  });

  it("loads from dist/app/ when it exists", async () => {
    const appDir = path.join(tmpDir, "dist", "app");
    const configDir = path.join(appDir, "config");
    fs.mkdirSync(configDir, { recursive: true });
    fs.mkdirSync(path.join(appDir, "controllers"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "middlewares"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "constants"), { recursive: true });
    fs.mkdirSync(path.join(appDir, "database"), { recursive: true });

    fs.writeFileSync(
      path.join(configDir, "routes.js"),
      "module.exports = { home: '/' };",
      "utf8"
    );
    fs.writeFileSync(
      path.join(appDir, "controllers", "controllers.js"),
      "class Home { index(_req, res) { res.send('dist'); } } module.exports = { home: Home };",
      "utf8"
    );
    fs.writeFileSync(path.join(appDir, "middlewares", "middlewares.js"), "module.exports = [];", "utf8");
    fs.writeFileSync(path.join(appDir, "constants", "constants.js"), "module.exports = {};", "utf8");
    fs.writeFileSync(path.join(appDir, "database", "database.js"), "module.exports = {};", "utf8");

    const app = createApp({ root: tmpDir, init: { port: 0 } });
    const { port } = await app.serve();

    const res = await new Promise<{ body: string }>((resolve, reject) => {
      import("http")
        .then(({ default: http }) => {
          http.get(`http://127.0.0.1:${port}/`, (res) => {
            let data = "";
            res.on("data", (ch) => (data += ch));
            res.on("end", () => resolve({ body: data }));
          }).on("error", reject);
        })
        .catch(reject);
    });

    await app.close();
    expect(res.body).toBe("dist");
  });
});
