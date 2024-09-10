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
    pokemonImage: HTMLImageElement;
    pokemonIndex: number;
    pokemonOptions: string[];
}

export type GameResult = {
    pokemonImageUrl: string;
    pokemonName: string;
    result: Result;
}

export type Result = "success" | "fail" | undefined;