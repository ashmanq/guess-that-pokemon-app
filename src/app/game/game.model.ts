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

export type ResultCheck = "success" | "fail" | undefined;

export type Result = {
    gameResult: ResultCheck;
    pokemonId: number;
}
