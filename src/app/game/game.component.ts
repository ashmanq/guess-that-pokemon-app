import { Component, inject, OnInit, output } from '@angular/core';
import { GameService } from '../../shared/services/game.service';
import { GameScoreComponent } from "./game-score/game-score.component";
import { PokemonImageComponent } from "./pokemon-image/pokemon-image.component";
import { SelectionButtonsComponent } from "./selection-buttons/selection-buttons.component";
import { Result } from './game.model';




@Component({
  selector: 'app-game',
  standalone: true,
  imports: [GameScoreComponent, PokemonImageComponent, SelectionButtonsComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit{
  restartGame = output<void>();
  showNextRoundButton = false;
  isLoading: boolean = true;
  isPokemonHidden = true;
  isFinished = false;
  isError = false;
  allResults: Result[]= [];
  roundStartAudio: HTMLAudioElement;
  correctAnswerAudio: HTMLAudioElement;
  wrongAnswerAudio: HTMLAudioElement;
  gameFinishAudio: HTMLAudioElement;
  private gameService = inject(GameService);

  constructor(){
    this.roundStartAudio = new Audio();
    this.roundStartAudio.src = 'audio/whos-that-pokemon.mp3';
    this.roundStartAudio.volume = 0.5;
    this.roundStartAudio.load();


    this.correctAnswerAudio = new Audio();
    this.correctAnswerAudio.src = 'audio/correct-answer-sound.mp3';
    this.correctAnswerAudio.volume = 0.1;
    this.correctAnswerAudio.load();

    this.wrongAnswerAudio = new Audio();
    this.wrongAnswerAudio.src = 'audio/wrong-answer-sound.mp3';
    this.wrongAnswerAudio.volume = 0.1;
    this.wrongAnswerAudio.load();

    this.gameFinishAudio = new Audio();
    this.gameFinishAudio.src = 'audio/game-finish-sound.mp3';
    this.gameFinishAudio.volume = 0.1;
    this.gameFinishAudio.load();
  }

  ngOnInit() {
    if(!this.gameService.getCurrentGameRound()){
      this.gameService.fetchGameRound().then(res => {
        if(!res) this.isError = true
        else this.restartAndPlayAudio(this.roundStartAudio);
        this.isLoading = false;
      })
    } else {
      this.roundStartAudio.play();
      this.isLoading = false;
    }
    this.allResults = [...this.gameService.getAllResults()];
  }

  get roundResult() {
    return this.gameService.getCurrentRoundResult();
  }

  get getNextRoundNumber() {
    return this.gameService.getCurrentRound() + 1;
  }

  get isFinalRound() {
    return this.gameService.isFinalRound();
  }

  get nextLevelText() {
    if(this.gameService.isFinalRound()) {
      return "Click to view final score!";
    }
    let resultText = "";
    const currentResult = this.gameService.getCurrentRoundResult()?.gameResult
    if(currentResult == "success") {
      resultText += "Congratulations! ";
    } else if (currentResult == "fail")  {
      resultText += "Better luck next time. "
    }
    return resultText += "Click to go to the next round!";
  }

  get nextRoundButtonText() {
    if(this.gameService.isFinalRound()) {
      return "View Score";
    }
    return `Go To Round ${this.gameService.getCurrentRound() + 1}`;
  }

  get finalScoreText() {
    return `${(this.gameService.getScore()/this.gameService.getMaxScore() * 100)}%`
  }

  get finalScoreSubText() {
    const score = this.gameService.getScore()/this.gameService.getMaxScore() * 100;
    if (score === 100) return "Well done, you guessed every Pokemon correctly!";
    return ""
  }
  get isFullScore() {
    return this.gameService.getScore() == this.gameService.getMaxScore()
  }

  async handleOptionSelected(selection: string) {
    const result = await this.gameService.checkResult(selection);
    if(!result) this.isError = true;
  }

  toggleShowNextRound(result: boolean) {
    const roundResult = this.gameService.getCurrentRoundResult();
    switch (roundResult?.gameResult) {
      case "success":
        this.restartAndPlayAudio(this.correctAnswerAudio);
        break;
      case "fail":
        this.restartAndPlayAudio(this.wrongAnswerAudio);
        break;
    }
    if(result === true) this.showNextRoundButton = true;
    else this.showNextRoundButton = false;
    this.allResults = [...this.gameService.getAllResults()];
  }

  async startNewRound() {
    this.showNextRoundButton = false;
    if(this.gameService.isFinalRound()){
      this.isFinished = true;
    } else {
      this.isLoading = true;
      await this.gameService.incrementRound();
      this.isLoading = false;
      this.showNextRoundButton = true;
    }
    if(!this.isFinished) {
      this.restartAndPlayAudio(this.roundStartAudio);
    } else {
      this.restartAndPlayAudio(this.gameFinishAudio);
    }
  }

  resetGame() {
    this.isError = false
    this.gameService.restart();
    this.restartGame.emit();
    this.showNextRoundButton = false;
  }

  async refreshGameRound() {
    this.isLoading = true;
    this.isError = false

    const result = await this.gameService.fetchGameRound();
    if(!result) {
      this.isError = true
    } else {
      this.allResults = [...this.gameService.getAllResults()];
    }
    this.isLoading = false;
  }

  private restartAndPlayAudio(audio: HTMLAudioElement) {
    audio.currentTime = 0;
    audio.play();
  }

}
