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
  isHidden = input<boolean>(true)

  get pokemonImage() {
    return this.gameService.getCurrentRoundImageUrl();
  }

  get imageLabel() {
    return this.isHidden() ? "" : this.gameService.getCurrentRoundPokemonName();
  }

  get pokemonName() {
    return this.isHidden() ? "?" : this.gameService.getCurrentRoundPokemonName();
  }

}
