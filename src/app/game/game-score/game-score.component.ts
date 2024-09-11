import { Component, computed, inject, input } from '@angular/core';
import { GameService } from '../../../shared/services/game.service';
import { Result, ResultCheck } from '../game.model';

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

  get maxScore() {
    return this.gameService.getMaxScore();
  }

  get currentRound() {
    return this.gameService.getCurrentRound();
  }

  get maxRounds() {
    return this.gameService.getMaxRounds();
  }

  paddedRoundResults = computed(() => {
    const paddedResults: ResultCheck[] = [];
    for (let index = 0; index < this.maxRounds; index++) {
      if(index < this.allResults().length){
        const result = this.allResults()[index]
        paddedResults.push(result.gameResult)
      } else {
        paddedResults.push(undefined)
      }
    }
    return paddedResults;
  })
}
