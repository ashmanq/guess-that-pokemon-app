import { Injectable, signal } from "@angular/core";
import { GameResult, GameRound, Result } from "../../app/game/game.model";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, lastValueFrom } from "rxjs";

const POKEMON_API_URL = `http://localhost:8000/api`;
const NO_OF_ROUNDS = 1;
const NO_OF_OPTIONS = 6;
const SCORE_PER_ROUND = 1;

const RESULTS_LOCAL_STORAGE_NAME = 'pokemonResults';
const CURRENT_GAME_ROUND_STORAGE_NAME = 'pokemonGameRound';


@Injectable({ providedIn: 'root' })
export class GameService {
    private receivedResultSignal = signal<string | undefined>(undefined);
    private noOfRounds = NO_OF_ROUNDS;
    private noOfOptions = NO_OF_OPTIONS;
    private scorePerRound = SCORE_PER_ROUND;
    private gameRound: GameRound | null = null;
    private results: Result[] = [];

    private score: number = 0;
    private currentRound = 0;

    // BehaviorSubject to hold the current Pokémon name
    private currentRoundPokemonNameSubject = new BehaviorSubject<string | undefined>(undefined);
    public currentRoundPokemonNameObservable = this.currentRoundPokemonNameSubject.asObservable();


    constructor(private http: HttpClient) {
        // This service can now make HTTP requests via `this.http`.
        this.initialiseFromLocalStorage()
    }

    async fetchGameResult(pokemonId: number, selectedName: string): Promise<null | GameResult> {
        try {
            const endPointUrl = `/pokemon/verify?id=${pokemonId}&name=${selectedName}`;
            const result = await this.pokemonApiCall(endPointUrl);
            // console.log("Verify result: ", result)
            return result as GameResult;
        } catch (error) {
            console.error("Error checking game result!");
            console.error(error);
            return null;
        }
    }

    async fetchGameRound(): Promise<any> {
        try {
            let endPointUrl = `/pokemon/random/?noOfPokemon=${this.noOfOptions}`;
            if (this.results.length) {
                const previousPokemonIds = this.results.map(result => result.pokemonId)
                const resultsStringified = JSON.stringify(previousPokemonIds);
                endPointUrl = endPointUrl + `&previousPokemonIds=${resultsStringified}`
            }

            const result = await this.pokemonApiCall(endPointUrl);

            const imageBase64Data = result?.pokemonImage;
            const options = result?.pokemonOptions;
            const selectedPokemonIndex = result?.selectedPokemonIndex;
            let imageData: string = "";

            if (imageBase64Data) imageData = 'data:image/png;base64,' + imageBase64Data;

            const newRound: GameRound = {
                pokemonImage: imageData,
                pokemonOptions: options || [],
                pokemonIndex: selectedPokemonIndex,
            }

            this.gameRound = newRound;
            this.saveCurrentRoundToLocalStorage()
            return newRound;

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

    getCurrentRoundImage() {
        return this.gameRound?.pokemonImage;
    }

    isFinalRound() {
        return (this.currentRound + 1) >= this.noOfRounds;
    }

    async checkResult(selection: string) {
        const currentPokemonIndex = this.gameRound?.pokemonIndex;
        if (this.currentRound >= 0 && this.currentRound < this.noOfRounds && currentPokemonIndex) {
            // Store previous value
            const prevGameRoundResult = this.results[this.currentRound]?.gameResult;
            const response = await this.fetchGameResult(currentPokemonIndex, selection)
            if (!response) return null;

            const responseResult = response.result ? "success" : "fail";

            if (responseResult == "success") this.score = this.score + this.scorePerRound;

            this.results[this.currentRound] = {
                gameResult: responseResult,
                pokemonId: currentPokemonIndex
            }

            if (this.gameRound) this.gameRound.pokemonImage = response.pokemonImage

            let currentResult = this.results[this.currentRound].gameResult;

            if (prevGameRoundResult !== currentResult) {
                this.currentRoundPokemonNameSubject.next(response.pokemonName)
                this.receivedResultSignal.set(currentResult)
            }

            this.saveResultsToLocalStorage();
            this.clearCurrentRoundToLocalStorage();
            return response;
        }
        return null;
    }

    async incrementRound() {
        this.currentRound = this.currentRound + 1;
        this.gameRound = null;
        this.clearCurrentRoundToLocalStorage();
        await this.fetchGameRound();
        this.currentRoundPokemonNameSubject.next(undefined);
        this.receivedResultSignal.set(undefined);
        this.saveResultsToLocalStorage();
    }

    restart() {
        this.score = 0;
        this.currentRound = 0;
        this.results = [];
        this.gameRound = null;
        this.currentRoundPokemonNameSubject.next(undefined);
        this.saveResultsToLocalStorage();
        this.clearCurrentRoundToLocalStorage();
    }

    private saveCurrentRoundToLocalStorage() {
        localStorage.setItem(CURRENT_GAME_ROUND_STORAGE_NAME, JSON.stringify(this.gameRound));
    }

    private clearCurrentRoundToLocalStorage() {
        localStorage.removeItem(CURRENT_GAME_ROUND_STORAGE_NAME);
    }

    private saveResultsToLocalStorage() {
        localStorage.setItem(RESULTS_LOCAL_STORAGE_NAME, JSON.stringify(this.results));
      
    }

    private initialiseFromLocalStorage(): boolean {
        const storedResults = localStorage.getItem(RESULTS_LOCAL_STORAGE_NAME);
        if (storedResults) {
            const loadedGameRounds: Result[] = JSON.parse(storedResults) as Result[];
            let newScore = 0;
            let newCurentRound = undefined;
            for (let index = 0; index < loadedGameRounds.length; index++) {
                const round = loadedGameRounds[index];
                if (round?.gameResult !== undefined) {
                    newCurentRound = index;
                    if (round?.gameResult === "success") newScore = newScore + (this.scorePerRound);
                }
            }
            // Ensure we haven't completed the game and the number of rounds matches the current setting
            if (newCurentRound !== undefined && (newCurentRound + 1) < this.noOfRounds && loadedGameRounds.length <= this.noOfRounds) {
                this.score = newScore;
                this.currentRound = newCurentRound + 1;
                this.results = [...loadedGameRounds]
                const currentRoundStored = localStorage.getItem(CURRENT_GAME_ROUND_STORAGE_NAME);
                if (currentRoundStored) {
                    const currentRound = JSON.parse(currentRoundStored) as GameRound;
                    this.gameRound = currentRound;
                }
                return true;
            }
        }
        return false;
    }


    private pokemonApiCall(endPointUrl: string): Promise<any> {
        function onRetry() {
            console.warn("Retrying API call for endpoint: ", endPointUrl)
        }
        const call = () => this.apiCall(endPointUrl)
        return this.functionCallWithRetry(call, onRetry)
    }

    // Assume only get calls for API at this point
    private async apiCall(urlEndPoint: string): Promise<any> {
        const fullApiUrl = `${POKEMON_API_URL}${urlEndPoint}`;
        const observable = this.http.get<any>(fullApiUrl);
        const result = await lastValueFrom(observable);
        return result;
    }

    private functionCallWithRetry(promise: () => Promise<any>, onRetry: () => void, maxRetries: number = 3): Promise<any> {

        const retryWithBackoff = async (retries: number) => {
            try {
                if (retries > 0) {
                    const timeToWait = 2 ** retries * 100;
                    console.log(`waiting for ${timeToWait}ms...`);
                    await this.waitFor(timeToWait);
                }
                return await promise();
            } catch (error) {
                if (retries < maxRetries) {
                    onRetry();
                    return retryWithBackoff(retries + 1);
                } else {
                    console.warn("Maximum retries reached!")
                    throw error;
                }

            }
        }

        return retryWithBackoff(0);
    }

    // Time delay function
    private waitFor(timeInMillis: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, timeInMillis));
    }
}