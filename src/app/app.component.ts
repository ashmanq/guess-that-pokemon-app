import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { IntroComponent } from "./intro/intro.component";
import { GameComponent } from "./game/game.component";
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, IntroComponent, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  gameStarted: boolean = false;
  gameService = inject(GameService);

  ngOnInit() {
    // Check if there are any saved game data
    const result = this.gameService.getAllResults();
    if (result.length){
      this.gameStarted = true;
    }
  }

  startGame() {
    this.gameStarted = true;
  }

  resetGame() {
    this.gameStarted = false;
  }
}
