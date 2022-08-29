const axios = require("axios").default;
const _ = require("lodash");

async function getStats(id) {
	let pokemonInfo = {};

	await axios
		.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
		.then((response) => {
			pokemonInfo = {
				id: response.data.id,
				sprite: response.data.sprites.versions["generation-v"]["black-white"].animated.front_default,
				name: _.startCase(_.toLower(response.data.name)),
				types: response.data.types,
				height: response.data.height,
				weight: response.data.weight,
				stats: response.data.stats,
				ability_1: _.startCase(_.toLower(response.data.abilities[0].ability.name)),
				ability_2: _.startCase(_.toLower(response.data.abilities[1].ability.name)),
			};
		})
		.catch((error) => {
			console.log(error);
		});

	return pokemonInfo;
}

module.exports = { getStats: getStats };
