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
  animationDurationSecs = 1;
  timeouetID: any = null;

  ngOnInit(): void {
    this.pokemonNameSubscription = this.gameService.currentRoundPokemonNameObservable.subscribe(async (name) => {
      if (name) {
        
        if(this.timeouetID) clearTimeout(this.timeouetID);

        this.pName = name || "";
        
        this.timeouetID = setTimeout(() => {
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
    if(this.timeouetID) {
      clearTimeout(this.timeouetID)
    }
  }

  get pokemonImage() {
    return this.gameService.getCurrentRoundImage();
  }

  get result() {
    return this.gameService.getCurrentRoundResult()?.gameResult;
  }

  get animationDuration() {
    return `${this.animationDurationSecs}s`
  }

  get isNameSet() {
    if(this.pName.length) return true;
    return false;
  }

}
