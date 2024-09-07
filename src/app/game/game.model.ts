export type PokemonListItem = {
    name: string;
    url: string;
}

export type Pokemon = {
    name: string;
    url: string;
    imageUrl: string;
    sprites: {
        other: {
            "official-artwork": {
                front_default: string;
                front_shiny: string;
            }
        }
    }
}

export type GameRound = {
    pokemonImageUrl: string;
    pokemonUrl: string;
    pokemonName: string;
    pokemonOptions: string[];
    result?: "success" | "fail";
}