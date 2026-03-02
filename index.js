/**
 * Demo app entry (run after: npm run build).
 * app/ is the demo application – createApp() loads routes, controllers, views from app/
 * (same structure as projects created with `carabao create`).
 */
require("dotenv").config();
const path = require("path");
const { createApp } = require("./dist/cjs/carabao/index.js");

const root = __dirname;
const app = createApp({ root });

app.serve().then(
  ({ address, port }) => console.log(`Server running at http://${address}:${port}`),
  (err) => {
    console.error("Server failed:", err.message);
    process.exit(1);
  }
);
