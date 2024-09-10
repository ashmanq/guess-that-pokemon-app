import { Injectable, signal } from "@angular/core";
import { GameResult, GameRound, Pokemon, PokemonListItem, Result } from "./game.model";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, lastValueFrom } from "rxjs";

const POKEMON_API_URL = `http://localhost:8000`;
const NO_OF_ROUNDS = 5;
const NO_OF_OPTIONS = 4;
const SCORE_PER_ROUND = 1;


@Injectable({ providedIn: 'root' })
export class GameService {
    private receivedResultSignal = signal<string | undefined>(undefined);
    private noOfRounds = NO_OF_ROUNDS;
    private noOfOptions = NO_OF_OPTIONS;
    private scorePerRound = SCORE_PER_ROUND;
    // private roundImage: HTMLImageElement = new Image();
    // private gameRounds: GameRound[] = [];
    private gameRound: GameRound | null = null;
    private results: Result[] = [];

    private score: number = 0;
    private currentRound = 0;

    // BehaviorSubject to hold the current Pokémon name
    private currentRoundPokemonNameSubject = new BehaviorSubject<string | number | undefined>(undefined);
    public currentRoundPokemonNameObservable = this.currentRoundPokemonNameSubject.asObservable();


    constructor(private http: HttpClient) {
        // This service can now make HTTP requests via `this.http`.
        this.initialiseFromLocalStorage()
    }

    async fetchGameResult(pokemonId: number, selectedName: string): Promise<null | GameResult> {
        try {
            const url = `${POKEMON_API_URL}/pokemon/verify?id=${pokemonId}&name=${selectedName}`;
            const observable = this.http.get<any>(url);
            const result = await lastValueFrom(observable);
            return result as GameResult;
        } catch (error) {
            console.error("Error checking game result!");
            console.error(error);
            return null;
        }
    }

     async fetchGameRound(): Promise<any> {
        try {
            const url = `${POKEMON_API_URL}/pokemon/random/`;
            const observable = this.http.get<any>(url);
            const result = await lastValueFrom(observable);
            
            const imageBase64Data = result?.pokemonImage;
            const options = result?.pokemonOptions;
            const selectedPokemonIndex = result?.selectedPokemonIndex;
            let imageData = new Image();
            
            if (imageBase64Data) imageData.src = 'data:image/png;base64,' + imageBase64Data;

            const newRound: GameRound = {
                pokemonImage: imageData,
                pokemonOptions: options || [],
                pokemonIndex: selectedPokemonIndex,
            }

            this.gameRound = newRound;

            console.log("Result: ", result)
            return false;
    
        } catch (error) {
            console.error("Error getting game round!");
            console.error(error);
            return false;
        }
    
    }


    getScore() {
        return this.score;
    }

    getCurrentRound() {
        return this.currentRound + 1;
    }


    getCurrentGameRound() {
        return this.gameRound;
    }

    getCurrentRoundButtonOptions() {
        return this.gameRound?.pokemonOptions;
    }

    getMaxRounds() {
        return this.noOfRounds;
    }

    getMaxScore() {
        return this.noOfRounds * this.scorePerRound;
    }

    getCurrentRoundResult() {
        return this.results[this.currentRound];
    }

    getAllResults() {
        return this.results;
    }

    getResultsSignal() {
        return this.receivedResultSignal;
    }

    isFinalRound() {
        return (this.currentRound + 1) >= this.noOfRounds;
    }

    async checkResult(selection: string) {
        const currentPokemonIndex = this.gameRound?.pokemonIndex;
        if (this.currentRound >= 0 && this.currentRound < this.noOfRounds && currentPokemonIndex) {
            let currentResult = this.results[this.currentRound];
            // Store previous value
            const prevGameRoundResult = this.results[this.currentRound];

            const gameResult = await this.fetchGameResult(currentPokemonIndex, selection)
            if(!gameResult) return null;
            this.results[this.currentRound] = gameResult.result;

            if (prevGameRoundResult !== currentResult) {
                this.currentRoundPokemonNameSubject.next(this.results[this.currentRound])
                this.receivedResultSignal.set(this.results[this.currentRound])
            }

            this.saveResultsToLocalStorage();
            return gameResult;
        }
        return null;
    }

    incrementRound() {
        this.currentRound = this.currentRound + 1;
        this.currentRoundPokemonNameSubject.next(this.results[this.currentRound]);
        this.receivedResultSignal.set(this.results[this.currentRound]);
        this.saveResultsToLocalStorage();
    }

    restart() {
        this.score = 0;
        this.currentRound = 0;
        this.results = [];
        this.currentRoundPokemonNameSubject.next(undefined);
        this.saveResultsToLocalStorage();
    }

    private saveResultsToLocalStorage() {
        localStorage.setItem('pokemonRounds', JSON.stringify(this.results));
    }

    private initialiseFromLocalStorage(): string[] | undefined {
        const storedResults = localStorage.getItem('pokemonRounds');
        if (storedResults) {
            const loadedGameRounds: string[] = JSON.parse(storedResults) as string[];
            let newScore = 0;
            let newCurentRound = undefined;
            for (let index = 0; index < loadedGameRounds.length; index++) {
                const result = loadedGameRounds[index];
                if (result !== undefined) {
                    newCurentRound = index;
                    if(result === "success") newScore = newScore + (this.scorePerRound);
                }
            }
            // Ensure we haven't completed the game and the number of rounds matches the current setting
            if(newCurentRound !== undefined && (newCurentRound + 1) < this.noOfRounds && loadedGameRounds.length === this.noOfRounds){
                this.score = newScore;
                this.currentRound = newCurentRound + 1;
                return loadedGameRounds;
            }
        }
        return undefined;
    }
}