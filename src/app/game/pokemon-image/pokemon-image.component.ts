import { Component, inject, OnDestroy, OnInit, output } from '@angular/core';
import { GameService } from '../game.service';
import { NgOptimizedImage } from '@angular/common';
import { Subscription, timeInterval } from 'rxjs';

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

  ngOnInit(): void {
    // this.pokemonNameSubscription = this.gameService.currentRoundPokemonNameObservable.subscribe((result) => {
    //   if (result) {
    //     setTimeout(() => {
    //       this.pName = this.gameService.getCurrentRoundPokemonName() || "";
    //       this.resultShown.emit(true);
    //     }, this.animationDurationSecs * 1000)
    //   } else {
    //     this.pName = ""
    //     this.resultShown.emit(false);
    //   }
    // })
  }

  ngOnDestroy(): void {
    if (this.pokemonNameSubscription) {
      this.pokemonNameSubscription.unsubscribe();
    }
  }

  get pokemonImage() {
    return ""
    // return this.gameService.getCurrentRoundImageUrl();
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
    return this.gameService.getCurrentRoundResult();
  }

  get animationDuration() {
    return `${this.animationDurationSecs}s`
  }

}
