import { env } from "./bootstrap";

describe("env()", () => {
  const orig = process.env;

  beforeEach(() => {
    process.env = { ...orig };
  });

  afterEach(() => {
    process.env = orig;
  });

  it("returns value when set", () => {
    process.env.FOO = "bar";
    expect(env("FOO")).toBe("bar");
  });

  it("returns default when unset", () => {
    delete process.env.MISSING;
    expect(env("MISSING", "default")).toBe("default");
  });

  it("returns empty string when unset and no default", () => {
    delete process.env.MISSING;
    expect(env("MISSING")).toBe("");
  });
});
