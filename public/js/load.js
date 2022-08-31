async function searchByType(event) {
    // clear table before populating it
    $(".filtered").empty();

    let pokeArray;

    await $.get(`https://pokeapi.co/api/v2/type/${event.target.dataset.type}`)
    .then(response => {
        pokeArray = response.pokemon;
    })
    .catch(error => {
        console.log(error);
    })

    pokeArray.forEach(async pokemon => {
        await $.get(pokemon.pokemon.url)
        .then(response => {
            if (response.id > 905) return;
            if (response.sprites.versions['generation-viii'].icons.front_default == null) return;

            $(".filtered").append(
                `<tr>
                    <td class="id"><a href="/cards/${response.id}">No.${response.id}</a></td>
                    <td><a href="/cards/${response.id}"><img src="${response.sprites.versions['generation-viii'].icons.front_default}"/></a></td>
                    <td><a href="/cards/${response.id}">${response.name}</a></td>
                </tr>`
            );
        })
        .catch(error => {
            console.log(error);
        }); 
    });

    
}