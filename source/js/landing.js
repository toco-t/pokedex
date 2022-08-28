const axios = require("axios").default;

async function getRandomPokemon() {
    const numberOfPokemon = 386;
    const pokeList = [];

    for ( let i = 0; i < 9; i++ ) {
        let pokeId = Math.floor(Math.random() * numberOfPokemon) + 1
        await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokeId}`)
        .then((response) => {
            pokeList[i] = {
                _id: pokeId,
                name: response.data.name,
                img: response.data.sprites.versions['generation-iv']['diamond-pearl'].front_default
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    return pokeList;
}

module.exports = { getRandomPokemon: getRandomPokemon }