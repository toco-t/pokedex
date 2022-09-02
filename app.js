require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

const { getRandomPokemon } = require("./source/js/landing.js");
const { getStats } = require("./source/js/card.js");
const { getOptions } = require("./source/js/search.js");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.locals._ = _;

mongoose.connect(`mongodb+srv://Toco:${process.env.PASSWORD}@cluster0.f0pqe.mongodb.net/?retryWrites=true&w=majority`);

const userSchema = new mongoose.Schema({
	_id: Number,
	name: String,
	email: String,
	password: String,
	favourites: [Object]
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
	getRandomPokemon().then((value) => {
		value != undefined ? res.render("landing", { pokeList: value }) : res.render("error");
	}).catch(error => {
		console.log(error);
		res.render("error");
	});
});

app.route("/cards")

	.post((req, res) => {
		getStats(_.lowerCase(req.body.id)).then((value) => {
			value != undefined ? res.render("card", { info: value }) : res.render("error");
		}).catch(error => {
			console.log(error);
			res.render("error");
		});
	});

app.route("/cards/:id")

	.get((req, res) => {
		getStats(req.params.id).then((value) => {
			value != undefined ? res.render("card", { info: value }) : res.render("error");
		}).catch(error => {
			console.log(error);
			res.render("error");
		});
	});

app.route("/search")

	.get((req, res) => {
		getOptions().then(value => {
			value != undefined ? res.render("search", { type: value.type, region: value.region }) : res.render("error");
		}).catch(error => {
			console.log(error);
		});
	});

app.listen(3000, () => {
	console.log("Server is running on port 3000...");
});
