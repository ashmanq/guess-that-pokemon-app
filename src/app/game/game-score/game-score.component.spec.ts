import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameScoreComponent } from './game-score.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GameService } from '../game.service';
import { provideHttpClient } from '@angular/common/http';

describe('GameScoreComponent', () => {
  let component: GameScoreComponent;
  let fixture: ComponentFixture<GameScoreComponent>;

  let gameService: GameService;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameScoreComponent],
      providers: [provideHttpClientTesting(), provideHttpClient()]
    })
    .compileComponents();


    httpTesting = TestBed.inject(HttpTestingController);
    gameService = TestBed.inject(GameService);

    fixture = TestBed.createComponent(GameScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
