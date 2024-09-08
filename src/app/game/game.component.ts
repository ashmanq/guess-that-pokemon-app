import { Component, inject, OnInit, output } from '@angular/core';
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
  isLoading: boolean = true;
  isPokemonHidden = true;
  isFinished = false;
  private gameService = inject(GameService);

  ngOnInit() {
    this.gameService.fetchGameRounds().then(res => {
      this.isLoading = false;
    })
  }

  get roundResult() {
    return this.gameService.getCurrentRoundResult();
  }


  handleOptionSelected(selection: string) {
    this.gameService.checkResult(selection);
  }

  async startNewRound() {
    if(this.gameService.isFinalRound()){
      this.isFinished = true;
    } else {
      this.isLoading = true;
      this.gameService.incrementRound();
      // We introduce a time delay to prevent the pokemon image still showing the previous pokemon
      setTimeout(() => {
        this.isLoading = false;
      }, 500)

    }
  }

  getNextRoundNumber() {
    return this.gameService.getCurrentRound() + 1;
  }

  resetGame() {
    this.gameService.restart();
    this.restartGame.emit();
  }

}
