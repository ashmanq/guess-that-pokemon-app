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