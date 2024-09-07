import { provideHttpClient } from "@angular/common/http";
import { GameService } from "./game.service"
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from "@angular/core/testing";


describe('Game Service', () => {
    let gameService: GameService;
    let httpTesting: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameService, provideHttpClientTesting(), provideHttpClient()]

        });
        httpTesting = TestBed.inject(HttpTestingController);
        gameService = TestBed.inject(GameService);
    })

    it('Should be able to get a list of pokemon', async () => {
        const noOnPokemonToGet = 12;
        const pokemonList = await gameService.getPokemonList(noOnPokemonToGet);
        expect(pokemonList.length).toBe(noOnPokemonToGet);
    })

    it('Should be able to get a list of unique pokemon', async () => {
        const noOnPokemonToGet = 32;
        const pokemonList = await gameService.getPokemonList(noOnPokemonToGet);
        const pokemonNames = pokemonList.map((pokemon) => pokemon.name);
        const pokemonSet = new Set(pokemonNames);
        const checkUnique = pokemonSet.size === pokemonNames.length;
        expect(checkUnique).toBeTrue();
    })

    it('Should be able to get shuffle a list of pokemon', async () => {
        const noOnPokemonToGet = 12;
        const pokemonList = await gameService.getPokemonList(noOnPokemonToGet);
        const unshuffledList = [...pokemonList];
        const shuffledList = GameService.shuffleArray(pokemonList)

        expect(unshuffledList).not.toEqual(shuffledList);
    })

    it('Should be able to get a score', () => {
        const score = gameService.getScore();
        expect(score).toBeInstanceOf(Number);
        expect(score).toBe(0);
    })

    it('Should be able to get the maximum rounds', () => {
        const maximumRounds = gameService.getMaxRounds();
        expect(maximumRounds).toBeInstanceOf(Number);
        expect(maximumRounds).toBe(5);
    })

    it('Should be able to get the maximum score', () => {
        const maximumScore = gameService.getMaxScore();
        expect(maximumScore).toBeInstanceOf(Number);
        expect(maximumScore).toBe(50);
    })

    it('Should be able to add a result to the score', () => {
        const score = gameService.getScore();
        expect(score).toBe(0);
        gameService.addResultToScore(true);
        const newScore = gameService.getScore();
        const isGreaterThanZero = newScore > score;
        const currentRound = gameService.getCurrentRound();
        expect(isGreaterThanZero).toBeTruthy();
        expect(currentRound).not.toEqual(0);
    })

    it('Should be able to create game rounds', async () => {
        await gameService.fetchGameRounds();
        const round = gameService.getCurrentGameRound();
        expect(round.pokemonName).toBeDefined();
        expect(round.pokemonImageUrl).toBeDefined();
        expect(round.pokemonOptions).toBeDefined();
    })


})