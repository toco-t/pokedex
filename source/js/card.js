const axios = require("axios").default;

async function getStats(id) {
	let pokemonInfo;

	await axios
		.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
		.then((response) => {
			pokemonInfo = {
				id: response.data.id,
				sprite: response.data.sprites.versions["generation-v"]["black-white"].animated.front_default,
				name: response.data.name,
				types: response.data.types,
				height: response.data.height,
				weight: response.data.weight,
				stats: response.data.stats,
				abilities: response.data.abilities
			};
		})
		.catch((error) => {
			console.log(error);
		});

	return pokemonInfo;
}

module.exports = { getStats: getStats };
