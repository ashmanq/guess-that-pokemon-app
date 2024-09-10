import { Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import { GameService } from '../game.service';
import { NgOptimizedImage } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pokemon-image',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './pokemon-image.component.html',
  styleUrl: './pokemon-image.component.scss'
})
export class PokemonImageComponent implements OnInit, OnDestroy {
  private gameService = inject(GameService);
  private pokemonNameSubscription: Subscription | undefined;
  resultShown = output<boolean>();
  pName = "";
  animationDurationSecs = 2;
  timeoueID: NodeJS.Timeout | null = null;

  ngOnInit(): void {
    this.pokemonNameSubscription = this.gameService.currentRoundPokemonNameObservable.subscribe(async (name) => {
      if (name) {
        this.timeoueID = setTimeout(() => {
          this.pName = name || "";
          this.resultShown.emit(true);
        }, this.animationDurationSecs * 1000)
      } else {
        this.pName = ""
        this.resultShown.emit(false);
      }
    })
  }

  ngOnDestroy(): void {
    if (this.pokemonNameSubscription) {
      this.pokemonNameSubscription.unsubscribe();
    }
    if(this.timeoueID) {
      clearTimeout(this.timeoueID)
    }
  }

  get pokemonImage() {
    return this.gameService.getCurrentRoundImage();
  }

  get imageLabel() {
    return ""
    // return this.gameService.getCurrentRoundResult() ? this.gameService.getCurrentRoundPokemonName() : "";
  }

  get pokemonName() {
    return ""
    // return this.gameService.getCurrentRoundResult() ? this.gameService.getCurrentRoundPokemonName() : "";
  }

  get result() {
    return this.gameService.getCurrentRoundResult()?.gameResult;
  }

  get animationDuration() {
    return `${this.animationDurationSecs}s`
  }

}
