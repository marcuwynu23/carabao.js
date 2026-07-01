import http from "http";
import { Application } from "./Application";
import type { Request, Response } from "express";

function get(url: string): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (ch) => (data += ch));
      res.on("end", () => resolve({ status: res.statusCode ?? 0, body: data }));
    }).on("error", reject);
  });
}

async function withApp(app: Application, fn: (port: number) => Promise<void>): Promise<void> {
  const { port } = await app.serve();
  try {
    await fn(port);
  } finally {
    await app.close();
  }
}

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

  it("registers get route", async () => {
    const app = new Application({ init: { port: 0 } });
    app.get("/ping", (_req: Request, res: Response) => {
      res.json({ pong: true });
    });
    await withApp(app, async (port) => {
      const { body } = await get(`http://127.0.0.1:${port}/ping`);
      expect(JSON.parse(body)).toEqual({ pong: true });
    });
  });

  it("registers post route", async () => {
    const app = new Application({ init: { port: 0 } });
    app.post("/echo", (req: Request, res: Response) => {
      res.json(req.body);
    });
    await withApp(app, async (port) => {
      const payload = JSON.stringify({ foo: "bar" });
      const res = await new Promise<{ status: number; body: string }>((resolve, reject) => {
        const req = http.request(
          { host: "127.0.0.1", port, path: "/echo", method: "POST", headers: { "Content-Length": Buffer.byteLength(payload), "Content-Type": "application/json" } },
          (res) => {
            let data = "";
            res.on("data", (ch) => (data += ch));
            res.on("end", () => resolve({ status: res.statusCode ?? 0, body: data }));
          }
        );
        req.on("error", reject);
        req.write(payload);
        req.end();
      });
      expect(JSON.parse(res.body)).toEqual({ foo: "bar" });
    });
  });

  it("chains route registration", () => {
    const app = new Application();
    app.get("/a", () => {}).post("/b", () => {});
    expect(app).toBeDefined();
  });

  it("wires route to matching controller at GET /", async () => {
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
    await withApp(app, async (port) => {
      const { body } = await get(`http://127.0.0.1:${port}/`);
      expect(body).toBe("home");
    });
  });

  it("wires multiple routes to matching controllers", async () => {
    class HomeController {
      index(_req: Request, res: Response) {
        res.send("home");
      }
    }
    class AboutController {
      index(_req: Request, res: Response) {
        res.send("about");
      }
    }
    const app = new Application({
      init: { port: 0 },
      routes: { home: "/", about: "/about" },
      controllers: { home: HomeController, about: AboutController },
    });
    await withApp(app, async (port) => {
      const home = await get(`http://127.0.0.1:${port}/`);
      expect(home.body).toBe("home");
      const about = await get(`http://127.0.0.1:${port}/about`);
      expect(about.body).toBe("about");
    });
  });

  it("returns 404 for route without matching controller", async () => {
    class HomeController {
      index(_req: Request, res: Response) {
        res.send("home");
      }
    }
    const app = new Application({
      init: { port: 0 },
      routes: { home: "/", orphan: "/orphan" },
      controllers: { home: HomeController },
    });
    await withApp(app, async (port) => {
      const home = await get(`http://127.0.0.1:${port}/`);
      expect(home.body).toBe("home");
      const orphan = await get(`http://127.0.0.1:${port}/orphan`);
      expect(orphan.status).toBe(404);
    });
  });

  it("returns 404 when no routes or controllers given", async () => {
    const app = new Application({ init: { port: 0 } });
    await withApp(app, async (port) => {
      const { status } = await get(`http://127.0.0.1:${port}/`);
      expect(status).toBe(404);
    });
  });

  it("routes controller methods beyond index", async () => {
    class PageController {
      index(_req: Request, res: Response) {
        res.send("index");
      }
      create(_req: Request, res: Response) {
        res.send("create");
      }
    }
    const app = new Application({
      init: { port: 0 },
      routes: { page: "/page" },
      controllers: { page: PageController },
    });
    await withApp(app, async (port) => {
      expect((await get(`http://127.0.0.1:${port}/page`)).body).toBe("index");
      expect((await get(`http://127.0.0.1:${port}/page/create`)).body).toBe("create");
      expect((await get(`http://127.0.0.1:${port}/page/nonexistent`)).status).toBe(404);
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
