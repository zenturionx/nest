
export const pokemonIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];
/*
export const pokemon = {
    id: 1,
    name: 'Bulbasaur',
}*/

interface Pokemon {
    id: number;
    name: string;
}

export const charmander: Pokemon = {
    id: 4,
    name: 'Charmander',
}

export const bulbasaur: Pokemon = {
    id: 1,
    name: 'Bulbasaur',
}

export const pokemons: Pokemon[] = [];

pokemons.push(charmander);
pokemons.push(bulbasaur);

console.log(pokemons);