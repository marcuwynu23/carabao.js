require("dotenv").config();
const path = require("path");
const { Carabao } = require("./carabao");
const constants = require("./app/constants/constants");
const routes = require("./app/config/routes");
const controllers = require("./app/controllers/controllers");
const views = require("./app/config/views");
const middlewares = require("./app/middlewares/middlewares");
const database = require("./app/database/database");

const app = new Carabao({
	init: {
		name: process.env.APP_NAME,
		address: process.env.ADDR,
		port: process.env.PORT,
		viewDir: path.resolve(__dirname, "app/views"),
	},
	middlewares: middlewares,
	constants: constants,
	database: database,
	routes: routes,
	controllers: controllers,
	views: views,
});

(async () => {
	try {
		let init = await app.serve();
		console.log(`Server running on: http://${init.address}:${init.port}`);
	} catch (error) {}
})();
