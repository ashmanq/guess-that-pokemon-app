import { Component, inject, OnDestroy, OnInit } from '@angular/core';
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
  pName = "";
  private pokemonNameSubscription: Subscription | undefined;
  animationDurationSecs = 2;

  constructor() {
  }

  ngOnInit(): void {
    this.pokemonNameSubscription = this.gameService.currentRoundPokemonNameObservable.subscribe((result) => {
      console.log("Name Change: ", result)
      if (result) {
        setTimeout(() => {
          this.pName = this.gameService.getCurrentRoundPokemonName();
        }, this.animationDurationSecs * 1000)
      } else {
        this.pName = ""
      }
    })
  }

  ngOnDestroy(): void {
    if (this.pokemonNameSubscription) {
      this.pokemonNameSubscription.unsubscribe();
    }
  }

  get pokemonImage() {
    return this.gameService.getCurrentRoundImageUrl();
  }

  get imageLabel() {
    return this.gameService.getCurrentRoundResult() ? this.gameService.getCurrentRoundPokemonName() : "";
  }

  get pokemonName() {
    return this.gameService.getCurrentRoundResult() ? this.gameService.getCurrentRoundPokemonName() : "";
  }

  get result() {
    return this.gameService.getCurrentRoundResult();
  }

  get animationDuration() {
    return `${this.animationDurationSecs}s`
  }

}
