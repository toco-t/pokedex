const axios = require("axios").default;

async function getOptions() {
    let type;
    let region;

    await axios.get("https://pokeapi.co/api/v2/type")
    .then(response => {
        type = response.data.results;
    })
    .catch(error => {
        console.log(error);
    })

    await axios.get("https://pokeapi.co/api/v2/region")
    .then(response => {
        region = response.data.results;
    })
    .catch(error => {
        console.log(error);
    })

    return { type: type, region: region };
}

module.exports = { getOptions: getOptions }