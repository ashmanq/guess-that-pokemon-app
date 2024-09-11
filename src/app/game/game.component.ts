import { Component, inject, OnInit, output } from '@angular/core';
import { GameService } from '../../shared/services/game.service';
import { GameScoreComponent } from "./game-score/game-score.component";
import { PokemonImageComponent } from "./pokemon-image/pokemon-image.component";
import { SelectionButtonsComponent } from "./selection-buttons/selection-buttons.component";
import { Result } from './game.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameScoreComponent, PokemonImageComponent, SelectionButtonsComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit{
  restartGame = output<void>();
  showNextRoundButton = false;
  isLoading: boolean = true;
  isPokemonHidden = true;
  isFinished = false;
  isError = false;
  allResults: Result[]= [];
  private gameService = inject(GameService);

  ngOnInit() {
    if(!this.gameService.getCurrentGameRound()){
      this.gameService.fetchGameRound().then(res => {
        if(!res) this.isError = true
        this.isLoading = false;
      })
    } else {
      this.isLoading = false;
    }
    this.allResults = [...this.gameService.getAllResults()];
  }

  get roundResult() {
    return this.gameService.getCurrentRoundResult();
  }

  async handleOptionSelected(selection: string) {
    const result = await this.gameService.checkResult(selection);
    if(!result) this.isError = true;
  }

  toggleShowNextRound(result: boolean) {
    if(result === true) this.showNextRoundButton = true;
    else this.showNextRoundButton = false;
    this.allResults = [...this.gameService.getAllResults()];
  }

  async startNewRound() {
    this.showNextRoundButton = false;
    if(this.gameService.isFinalRound()){
      this.isFinished = true;
    } else {
      this.isLoading = true;
      await this.gameService.incrementRound();
      this.isLoading = false;
      this.showNextRoundButton = true;
    }
  }

  get getNextRoundNumber() {
    return this.gameService.getCurrentRound() + 1;
  }

  get isFinalRound() {
    return this.gameService.isFinalRound();
  }

  get nextLevelText() {
    if(this.gameService.isFinalRound()) {
      return "Click to view final score!";
    }
    let resultText = "";
    const currentResult = this.gameService.getCurrentRoundResult()?.gameResult
    if(currentResult == "success") {
      resultText += "Congratulations! ";
    } else if (currentResult == "fail")  {
      resultText += "Better luck next time. "
    }
    return resultText += "Click to go to the next round!";
  }

  get nextRoundButtonText() {
    if(this.gameService.isFinalRound()) {
      return "View Score";
    }
    return `Round ${this.gameService.getCurrentRound() + 1}`;
  }

  get finalScoreText() {
    return `Final Score: ${(this.gameService.getScore()/this.gameService.getMaxScore() * 100)}%`
  }

  get finalScoreSubText() {
    const score = this.gameService.getScore()/this.gameService.getMaxScore() * 100;
    if (score === 100) return "Well done, you guessed every Pokemon correctly!";
    return ""
  }
  get isFullScore() {
    return this.gameService.getScore() == this.gameService.getMaxScore()
  }


  updateAllResults() {
    const paddedResult = [...this.allResults];
    const maxRounds = this.gameService.getMaxRounds();
    for (let i = this.allResults.length; i++; i < maxRounds) {
      // paddedResult.push({undefined})
    }

  }

  resetGame() {
    this.isError = false
    this.gameService.restart();
    this.restartGame.emit();
    this.showNextRoundButton = false;
  }

  async refreshGameRound() {
    this.isLoading = true;
    this.isError = false

    const result = await this.gameService.fetchGameRound();
    if(!result) {
      this.isError = true
    } else {
      this.allResults = [...this.gameService.getAllResults()];
    }
    this.isLoading = false;
  }

}
