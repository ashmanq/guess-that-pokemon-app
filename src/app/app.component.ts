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
  gameStarted: boolean = true;

  ngOnInit() {
  }

  startGame() {
    this.gameStarted = true;
  }

  resetGame() {
    console.log("Restarting!")
    this.gameStarted = false;
  }
}
