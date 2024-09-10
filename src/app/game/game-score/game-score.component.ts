import { Component, inject, input } from '@angular/core';
import { GameService } from '../game.service';
import { Result } from '../game.model';

@Component({
  selector: 'app-game-score',
  standalone: true,
  imports: [],
  templateUrl: './game-score.component.html',
  styleUrl: './game-score.component.scss'
})
export class GameScoreComponent {
  allResults = input<Result[]>([]);
  gameService = inject(GameService);

  // get score() {
  //   return this.gameService.getScore();
  // }

  get maxScore() {
    return this.gameService.getMaxScore();
  }

  get currentRound() {
    return this.gameService.getCurrentRound();
  }

  get maxRounds() {
    return this.gameService.getMaxRounds();
  }

  // get allResults() {
  //   return this.gameService.getAllResults();
  // }
}
