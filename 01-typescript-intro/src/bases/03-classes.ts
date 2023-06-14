import axios from "axios";
import {PokeApiResponse} from "../interfaces/pokeapi-response.interface.ts";

export class Pokemon {

    get imageUrl(): string {
        return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.id}.png`;
    }

    constructor(
        public readonly id: number,
        public name: string,
    ) {
    }

    scream(): void {
        console.log(`${this.name.toUpperCase()}!!!`);
    }

    speak(): void {
        console.log(`${this.name} ${this.name}`);
    }

    async getMoves() {
        const { data } = await axios.get<PokeApiResponse>(`https://pokeapi.co/api/v2/pokemon/${this.id}`);
        console.log(data.moves);
        return data.moves;
    }
}

export const charmander: Pokemon = new Pokemon(4, 'Charmander');

// console.log(charmander);
//
// charmander.scream();
// charmander.speak();

charmander.getMoves();