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
    pokemonImage: string;
    pokemonIndex: number;
    pokemonOptions: string[];
}

export type GameResult = {
    pokemonImage: string;
    pokemonName: string;
    result: boolean;
}

export type Result = {
    gameResult: "success" | "fail" | undefined;
    pokemonId: number
}