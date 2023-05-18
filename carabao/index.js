const express = require("express");
const nunjucks = require("nunjucks");

class Carabao {
	constructor(
		options = { init: {}, database: {}, controllers: {}, routes: {}, views: {} }
	) {
		this.init = options.init;
		this.init.viewDir = options.init.viewDir || "./res/views";
		this.init.port = options.init.port || 9000;
		this.init.address = options.init.address || "localhost";
		this.init.name = options.init.name || "Carabao Web App";

		this.database = options.database;
		this.controllers = options.controllers;
		this.routes = options.routes;
		this.views = options.views;
		this.setup();
	}
	setup() {
		this.appSetup();
		this.middlewareSetup();
		this.routesSetup();
		this.controllersSetup();
		this.routeAndControllerSetup();
		this.viewsSetup();
		this.databaseSetup();
	}

	appSetup() {
		this.app = express();
		this.app.use(express.static("./res/public"));
		this.viewEnv = nunjucks.configure(this.init.viewDir, {
			express: this.app,
			autoscape: true,
			noCache: false,
			watch: true,
		});
	}

	databaseSetup() {}

	middlewareSetup() {
		//middlewares
	}

	routesSetup() {
		let routeNames = Object.keys(this.routes);
		this._routeNames = routeNames;
	}

	controllersSetup() {
		let controllerNames = Object.keys(this.controllers);
		this._controllerNames = controllerNames;
	}

	routeAndControllerSetup() {
		let newapp = this.app;
		for (let routeName of this._routeNames) {
			for (let controllerName of this._controllerNames) {
				if (routeName === controllerName) {
					let router = express.Router();
					let controller = new this.controllers[controllerName]();
					if (controller.index) {
						router.get("/", controller.index);
					}
					if (controller.show) {
						router.get("/show/:id", controller.show);
					}
					if (controller.create) {
						router.get("/create", controller.create);
					}
					if (controller.store) {
						router.post("/store", controller.store);
					}
					if (controller.edit) {
						router.get("/edit/:id", controller.edit);
					}
					if (controller.update) {
						router.get("/update/:id", controller.update);
					}
					if (controller.destroy) {
						router.get("/destroy/:id", controller.destroy);
					}
					newapp.use(this.routes[routeName], router);
				}
			}
		}
		this.app = newapp;
	}
	viewsSetup() {}

	serve() {
		return new Promise((resolve, reject) => {
			this.app.listen(this.init.port, this.init.address, (err) => {
				if (err) reject(err);
				resolve(this.init);
			});
		});
	}
}

module.exports.Carabao = Carabao;
