const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

const { getRandomPokemon } = require("./source/js/landing.js");
const { getStats } = require("./source/js/card.js");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	getRandomPokemon().then((value) => {
		res.render("landing", { pokeList: value });
	});
});

app.get("/cards/:id", (req, res) => {
	getStats(req.params.id).then((value) => {
		console.log(value);
		res.render("card", { stats: value });
	});
});

app.listen(3000, () => {
	console.log("Server is running on port 3000...");
});
