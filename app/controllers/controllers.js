let ctx = {
	APP_NAME: process.env.APP_NAME,
};

class welcome {
	index(req, res) {
		return res.render("welcome.html", { ctx: ctx });
	}
}

class home {
	async index(req, res) {
		try {
			return res.render("home.html", { ctx: ctx });
		} catch (error) {
			console.log(error);
		}
	}
	async show(req, res) {
		try {
			return res.render("home/show.html");
		} catch (error) {
			console.log(error);
		}
	}
}

class about {
	index(req, res) {
		try {
			return res.render("about.html", { ctx: ctx });
		} catch (error) {
			console.log(error);
		}
	}
}
class contact {
	index(req, res) {
		try {
			return res.render("contact.html", { ctx: ctx });
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = {
	welcome,
	home,
	about,
	contact,
};
