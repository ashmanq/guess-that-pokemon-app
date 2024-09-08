import { Component, effect, inject, OnInit, output } from '@angular/core';
import { GameService } from './game.service';
import { GameScoreComponent } from "./game-score/game-score.component";
import { PokemonImageComponent } from "./pokemon-image/pokemon-image.component";
import { SelectionButtonsComponent } from "./selection-buttons/selection-buttons.component";

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
  allResults: string[]= [];
  private gameService = inject(GameService);

  ngOnInit() {
    this.gameService.fetchGameRounds().then(res => {
      this.isLoading = false;
    })
    this.allResults = [...this.gameService.getAllResults()];
  }

  get roundResult() {
    return this.gameService.getCurrentRoundResult();
  }


  handleOptionSelected(selection: string) {
    this.gameService.checkResult(selection);
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
      this.gameService.incrementRound();
      // We introduce a time delay to prevent the pokemon image still showing the previous pokemon
      setTimeout(() => {
        this.isLoading = false;
        this.showNextRoundButton = true;
      }, 500)

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
    if(this.gameService.getCurrentRoundResult() == "success") {
      resultText += "Congratulations! ";
    } else if (this.gameService.getCurrentRoundResult() == "fail")  {
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

  resetGame() {
    this.gameService.restart();
    this.restartGame.emit();
    this.showNextRoundButton = false;
  }

}
