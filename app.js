require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const { v4: uuid } = require("uuid");
const session = require("express-session");
const bcrypt = require("bcrypt");
const saltRound = 10;

const app = express();

app.use(
	session({
		secret: process.env.SECRET,
		name: "session",
		resave: false,
		saveUninitialized: false,
	})
);

const { getRandomPokemon } = require("./source/js/landing.js");
const { getStats } = require("./source/js/card.js");
const { getOptions } = require("./source/js/search.js");
const { uniqueId } = require("lodash");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.locals._ = _;

mongoose.connect(
	`mongodb+srv://Toco:${process.env.PASSWORD}@cluster0.f0pqe.mongodb.net/usersDB`
);

const userSchema = new mongoose.Schema({
	user_id: String,
	trainer_no: Number,
	username: String,
	email: String,
	password: String,
	favourites: [Object],
});

const User = mongoose.model("User", userSchema);

function authenticate(req, res, next) {
	req.session.authenticated ? next() : res.redirect("/login");
}

app.get("/", (req, res) => {
	getRandomPokemon()
		.then((value) => {
			value != undefined
				? res.render("landing", { pokeList: value })
				: res.render("error");
		})
		.catch((error) => {
			console.log(error);
			res.render("error");
		});
});

/********** cards route **********/

app
	.route("/cards")

	.post((req, res) => {
		getStats(_.lowerCase(req.body.id))
			.then((value) => {
				value != undefined
					? res.render("card", { info: value })
					: res.render("error");
			})
			.catch((error) => {
				console.log(error);
				res.render("error");
			});
	});

app
	.route("/cards/:id")

	.get((req, res) => {
		getStats(req.params.id)
			.then((value) => {
				value != undefined
					? res.render("card", { info: value })
					: res.render("error");
			})
			.catch((error) => {
				console.log(error);
				res.render("error");
			});
	});

/********** search route **********/

app
	.route("/search")

	.get((req, res) => {
		getOptions()
			.then((value) => {
				value != undefined
					? res.render("search", { type: value.type, region: value.region })
					: res.render("error");
			})
			.catch((error) => {
				console.log(error);
			});
	});

/********** signup route **********/

app
	.route("/signup")

	.post((req, res) => {
		User.findOne(
			{
				email: req.body.email,
			},
			(err, user) => {
				if (!user) {
					bcrypt.hash(req.body.password, saltRound, (err, hash) => {
						User.create(
							{
								user_id: uuid(),
								trainer_no: Math.floor(Math.random() * 1000000),
								username: req.body.username,
								email: req.body.email,
								password: hash,
								favourites: [],
							},
							(err, users) => {
								if (!err) res.send("REGISTRATION SUCCESSFUL...");
							}
						);
					});
				} else if (user) {
					res.send("THE USER ALREADY EXISTS...");
				} else {
					res.send("SOMETHING WENT WRONG...");
				}
			}
		);
	});

/********** login route **********/

app
	.route("/login")

	.get((req, res) => {
		res.render("login");
	})

	.post((req, res) => {
		User.findOne(
			{
				username: req.body.username,
			},
			(err, account) => {
				if (account) {
					bcrypt.compare(req.body.password, account.password, (err, result) => {
						if (result === true) {
							req.session.user = account.username;
							req.session.user_id = account.user_id;
							req.session.authenticated = true;
							res.send("");
						}
					});
				} else {
					res.send("NO ACCOUNT FOUND WITH THE EMAIL/PASSWORD...");
				}
			}
		);
	});

/********** account route **********/

app
	.route("/account")

	.get(authenticate, (req, res) => {
		User.findOne(
			{
				username: req.session.user,
			},
			(err, account) => {
				if (account)
					res.render("account", {
						id: account.trainer_no,
						name: account.username,
					});
			}
		);
	});

/********** logout route **********/

app
	.route("/logout")

	.get((req, res, next) => {
		req.session.user = null;

		req.session.save((err) => {
			if (err) next(err);

			req.session.regenerate((err) => {
				if (err) next(err);
				res.redirect("/");
			});
		});
	});

app.listen(3000, (error) => {
	error ? console.log(error) : console.log("Server is running on port 3000...");
});
