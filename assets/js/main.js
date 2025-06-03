const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const searchInput = document.getElementById('searchInput')

const maxRecords = 151
const limit = 10
let offset = 0;
let allPokemons = [];

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

function renderPokemonList(pokemons) {
    pokemonList.innerHTML = pokemons.map(convertPokemonToLi).join('')
}

function loadPokemonItens(offset, limit, append = true) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        allPokemons = allPokemons.concat(pokemons)
        if (append) {
            pokemonList.innerHTML += pokemons.map(convertPokemonToLi).join('')
        } else {
            renderPokemonList(pokemons)
        }
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)
        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

// Busca Pokémon
searchInput.addEventListener('input', function () {
    const value = this.value.trim().toLowerCase()
    if (!value) {
        renderPokemonList(allPokemons)
        return
    }
    const filtered = allPokemons.filter(p =>
        p.name.toLowerCase().includes(value) ||
        String(p.number) === value
    )
    renderPokemonList(filtered)
})

// Carrega todos os pokémons para busca rápida
pokeApi.getPokemons(0, maxRecords).then((pokemons = []) => {
    allPokemons = pokemons
})