import { Injectable, signal } from "@angular/core";
import { GameRound, Pokemon, PokemonListItem } from "./game.model";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, lastValueFrom } from "rxjs";

const POKEMON_API_URL = `https://pokeapi.co/api/v2/pokemon`;
const NO_OF_ROUNDS = 5;
const NO_OF_OPTIONS = 4;
const SCORE_PER_ROUND = 1;


@Injectable({ providedIn: 'root' })
export class GameService {
    private receivedResultSignal = signal<string | undefined>(undefined);
    private noOfRounds = NO_OF_ROUNDS;
    private noOfOptions = NO_OF_OPTIONS;
    private scorePerRound = SCORE_PER_ROUND;
    private gameRounds: GameRound[] = [];

    private score: number = 0;
    private currentRound = 0;

    // BehaviorSubject to hold the current Pokémon name
    private currentRoundPokemonNameSubject = new BehaviorSubject<string | number | undefined>(undefined);
    public currentRoundPokemonNameObservable = this.currentRoundPokemonNameSubject.asObservable();


    constructor(private http: HttpClient) {
        // This service can now make HTTP requests via `this.http`.
    }

    async getPokemonPage(limit: number = 0, offset: number): Promise<PokemonListItem[]> {
        const url = POKEMON_API_URL + `?limit=${limit}&offset=${offset}`;
        const observable = this.http.get<any>(url);
        const result = await lastValueFrom(observable);
        const list = result?.results || [];
        return list;
    }

    async getPokemonList(noOfPokemon: number): Promise<PokemonListItem[]> {
        // Clear pokemon list
        const pokemonList: PokemonListItem[] = [];
        const noPerPage = 10;
        const totalPages = Math.ceil(noOfPokemon / noPerPage);
        let offset = 0;


        // Only get the number of pokemon requested
        for (let i = 0; i < totalPages; i++) {
            const limit = (i === totalPages - 1) ? (noOfPokemon - ((i) * noPerPage)) : noPerPage;
            const result = await this.getPokemonPage(limit, offset);
            if (result?.length) {
                pokemonList.push(...result);
            }
            offset = offset + pokemonList.length;
        }
        return pokemonList;
    }

    async getPokemonImage(pokemonUrl: string): Promise<string> {
        const observable = this.http.get(pokemonUrl);
        const result = await lastValueFrom(observable) as Pokemon;
        return result?.sprites?.other?.["official-artwork"]?.front_default;
    }

    static shuffleArray(array: any[]): any[] {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async fetchGameRounds(): Promise<any> {
        // Clear current game rounds
        this.gameRounds = [];

        const noOfPokemon = this.noOfRounds * this.noOfOptions;
        const listOfPokemon = await this.getPokemonList(noOfPokemon);
        const shuffledPokemonList = GameService.shuffleArray(listOfPokemon) as PokemonListItem[];
        // Split list into separate rounds randomly
        for (let index = 0; index < this.noOfRounds; index++) {
            const roundPokemonOptions = shuffledPokemonList.slice(index * this.noOfOptions, (index + 1) * this.noOfOptions)
            const randomIndex = Math.floor(Math.random() * this.noOfOptions);
            const selectedPokemon = roundPokemonOptions[randomIndex];
            const imageUrl = await this.getPokemonImage(selectedPokemon.url);
            const round: GameRound = {
                pokemonName: selectedPokemon.name,
                pokemonUrl: selectedPokemon.url,
                pokemonImageUrl: imageUrl || "",
                pokemonOptions: roundPokemonOptions.map(pokemon => pokemon.name)
            };
            this.gameRounds.push(round);
        }

        console.log("Rounds: ", this.gameRounds);
    }


    getScore() {
        return this.score;
    }

    getCurrentRound() {
        return this.currentRound + 1;
    }


    getCurrentGameRound() {
        return this.gameRounds[this.currentRound];
    }

    getCurrentRoundImageUrl() {
        return this.gameRounds[this.currentRound].pokemonImageUrl;
    }

    getCurrentRoundPokemonName() {
        return this.gameRounds[this.currentRound].pokemonName;
    }

    getCurrentRoundButtonOptions() {
        return this.gameRounds[this.currentRound].pokemonOptions;
    }

    getMaxRounds() {
        return this.noOfRounds;
    }

    getMaxScore() {
        return this.noOfRounds * this.scorePerRound;
    }

    getCurrentRoundResult() {
        return this.gameRounds[this.currentRound]?.result;
    }

    getAllResults() {
        const allResults: string[] = [];
        for (let index = 0; index < this.noOfRounds; index++) {
            const result = this.gameRounds[index]?.result
            if(!result) {
                allResults.push("")
            } else {
                allResults.push(result);
            }
        }
        return allResults;
    }

    getResultsSignal() {
        return this.receivedResultSignal;
    }

    isFinalRound() {
        return (this.currentRound + 1) >= this.noOfRounds;
    }

    checkResult(selection: string) {
        if (this.currentRound >= 0 && this.currentRound < this.noOfRounds) {
            const currentGameRound = this.gameRounds[this.currentRound];
            // Store previous value
            const prevGameRoundResult = currentGameRound?.result;
            if (selection === currentGameRound?.pokemonName) {
                currentGameRound.result = 'success';
                this.score = this.score + this.scorePerRound;
            } else {
                currentGameRound.result = 'fail';
            }
            // If the result is toggled then we signal a change for the pokemon name
            if (prevGameRoundResult !== currentGameRound?.result){
                this.currentRoundPokemonNameSubject.next(currentGameRound.result)
                this.receivedResultSignal.set(currentGameRound?.result)
            }
        }
    }

    incrementRound() {
        this.currentRound = this.currentRound + 1;
        this.currentRoundPokemonNameSubject.next(this.gameRounds[this.currentRound].result);
        this.receivedResultSignal.set(this.gameRounds[this.currentRound].result);
    }

    restart() {
        this.score = 0;
        this.currentRound = 0;
        this.gameRounds = [];
        this.currentRoundPokemonNameSubject.next(undefined);
    }
}