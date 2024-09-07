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
    // this.optionSelected = true;
    console.log("Selection: ", selection);
    this.gameService.checkResult(selection);
  }

  startNewRound() {
    console.log("Round!", this.gameService.isFinalRound())
    if(this.gameService.isFinalRound()){
      this.isFinished = true;
    } else {
      this.gameService.incrementRound();
    }
  }

  resetGame() {
    this.gameService.restart();
    this.restartGame.emit();
  }

}
