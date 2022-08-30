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

app.get("/", (req, res) => {
	getRandomPokemon().then((value) => {
		res.render("landing", { pokeList: value });
	});
});

app.route("/cards/:id")

	.get((req, res) => {
		getStats(req.params.id).then((value) => {
			res.render("card", { info: value });
		});
	});

app.route("/search")

	.get((req, res) => {
		getOptions().then(response => {
			res.render("search", { type: response.type, region: response.region })
		});
	});

app.listen(3000, () => {
	console.log("Server is running on port 3000...");
});
