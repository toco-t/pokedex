const axios = require("axios").default;

async function getStats(id) {
	let pokemonStats = {};

	await axios
		.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
		.then((response) => {
			pokemonStats = {
				id: response.data.id,
				sprite:
					response.data.sprites.versions["generation-v"]["black-white"].animated
						.front_default,
				name: response.data.name,
				type: response.data.types,
				height: response.data.height,
				weight: response.data.weight,
				hp: response.data.stats[0].base_stat,
				attack: response.data.stats[1].base_stat,
				defense: response.data.stats[2].base_stat,
				specialAttack: response.data.stats[3].base_stat,
				specialDefense: response.data.stats[4].base_stat,
				speed: response.data.stats[5].base_stat,
				ability_1: response.data.abilities[0].ability.name,
				ability_2: response.data.abilities[1].ability.name,
			};
		})
		.catch((error) => {
			console.log(error);
		});

	return pokemonStats;
}

module.exports = { getStats: getStats };
