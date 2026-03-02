import { Application } from "./Application";
import type { Request, Response } from "express";

describe("Application", () => {
  it("creates with default init", () => {
    const app = new Application();
    expect(app.init.port).toBe(9000);
    expect(app.init.address).toBe("0.0.0.0");
    expect(app.init.name).toBe("Carabao");
  });

  it("accepts custom init", () => {
    const app = new Application({
      init: { port: 3000, address: "127.0.0.1", name: "Test" },
    });
    expect(app.init.port).toBe(3000);
    expect(app.init.address).toBe("127.0.0.1");
    expect(app.init.name).toBe("Test");
  });

  it("registers get route", (done) => {
    const app = new Application({ init: { port: 0 } });
    app.get("/ping", (_req: Request, res: Response) => {
      res.json({ pong: true });
    });
    app.serve().then(({ port }) => {
      const base = `http://127.0.0.1:${port}`;
      import("http")
        .then(({ default: http }) => {
          const req = http.get(`${base}/ping`, (res) => {
            let data = "";
            res.on("data", (ch) => (data += ch));
            res.on("end", () => {
              expect(JSON.parse(data)).toEqual({ pong: true });
              app.close().then(() => done());
            });
          });
          req.on("error", done);
        })
        .catch(done);
    });
  });

  it("registers post route", (done) => {
    const app = new Application({ init: { port: 0 } });
    app.post("/echo", (req: Request, res: Response) => {
      res.json(req.body);
    });
    app.serve().then(({ port }) => {
      const payload = JSON.stringify({ foo: "bar" });
      import("http")
        .then(({ default: http }) => {
          const req = http.request(
            { host: "127.0.0.1", port, path: "/echo", method: "POST", headers: { "Content-Length": Buffer.byteLength(payload), "Content-Type": "application/json" } },
            (res) => {
              let data = "";
              res.on("data", (ch) => (data += ch));
              res.on("end", () => {
                expect(JSON.parse(data)).toEqual({ foo: "bar" });
                app.close().then(() => done());
              });
            }
          );
          req.on("error", done);
          req.write(payload);
          req.end();
        })
        .catch(done);
    });
  });

  it("chains route registration", () => {
    const app = new Application();
    app.get("/a", () => {}).post("/b", () => {});
    expect(app).toBeDefined();
  });

  it("uses routes and controllers when provided", (done) => {
    class HomeController {
      index(_req: Request, res: Response) {
        res.send("home");
      }
    }
    const app = new Application({
      init: { port: 0 },
      routes: { home: "/" },
      controllers: { home: HomeController },
    });
    app.serve().then(({ port }) => {
      import("http")
        .then(({ default: http }) => {
          http.get(`http://127.0.0.1:${port}/`, (res) => {
            let data = "";
            res.on("data", (ch) => (data += ch));
            res.on("end", () => {
              expect(data).toBe("home");
              app.close().then(() => done());
            });
          }).on("error", done);
        })
        .catch(done);
    });
  });

  it("serve() resolves with init", async () => {
    const app = new Application({ init: { port: 0 } });
    const result = await app.serve();
    expect(result.port).toBeGreaterThan(0);
    expect(result.address).toBe("0.0.0.0");
    await app.close();
  });
});
