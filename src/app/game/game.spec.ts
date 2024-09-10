import { provideHttpClient } from "@angular/common/http";
import { GameService } from "./game.service"
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from "@angular/core/testing";


describe('Game Service', () => {
    let gameService: GameService;
    let httpTesting: HttpTestingController;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [GameService, provideHttpClientTesting(), provideHttpClient()]

        });
        httpTesting = TestBed.inject(HttpTestingController);
        gameService = TestBed.inject(GameService);
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
    })


    // it('Should be able to get the current round result', async () => {
    //     await gameService.fetchGameRound();
    //     await gameService.fetchGameResult(1, "bulbasaur")
    //     const maximumScore = gameService.getCurrentRoundResult();
    //     expect(maximumScore).toBeInstanceOf(Boolean);
    //     // expect(maximumScore).toBe(5);
    // })

    // it('Should be able to add a result to the score', () => {
    //     const score = gameService.getScore();
    //     expect(score).toBe(0);
    //     gameService.addResultToScore(true);
    //     const newScore = gameService.getScore();
    //     const isGreaterThanZero = newScore > score;
    //     const currentRound = gameService.getCurrentRound();
    //     expect(isGreaterThanZero).toBeTruthy();
    //     expect(currentRound).not.toEqual(0);
    // })

    // it('Should be able to create game rounds', async () => {
    //     await gameService.fetchGameRound();
    //     const round = gameService.getCurrentGameRound();
    //     expect(round?.pokemonIndex).toBeDefined();
    //     expect(round?.pokemonImage).toBeDefined();
    //     expect(round?.pokemonOptions).toBeDefined();
    // })

    // it('Should be able to get the current rounds pokemon image url', async () => {
    //     await gameService.fetchGameRounds();
    //     const imageUrl = gameService.getCurrentRoundImageUrl();
    //     expect(imageUrl).toBeDefined();
    // })

})