import fs from "fs";
import path from "path";
import os from "os";
import { createApp } from "./bootstrap";

describe("createApp", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "carabao-createApp-"));
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpDir, { recursive: true });
    } catch {
      // ignore
    }
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
    fs.writeFileSync(path.join(configDir, "views.js"), "module.exports = {};", "utf8");

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
});
