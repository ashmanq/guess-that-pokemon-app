import { Component, inject, input } from '@angular/core';
import { GameService } from '../game.service';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-pokemon-image',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './pokemon-image.component.html',
  styleUrl: './pokemon-image.component.scss'
})
export class PokemonImageComponent {
  private gameService = inject(GameService);

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

}
