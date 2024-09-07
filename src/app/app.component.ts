import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { IntroComponent } from "./intro/intro.component";
import { GameComponent } from "./game/game.component";
import { GameService } from './game/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, IntroComponent, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  pokemonListLoading: boolean = true;
  gameStarted: boolean = true;
  private gameService = inject(GameService);

  ngOnInit() {
    // this.gameService.getPokemonList().then(res => {
    //   this.pokemonListLoading = false;
    // })
  }

  startGame() {
    console.log("Clicked")
    this.gameStarted = true;
  }
}
