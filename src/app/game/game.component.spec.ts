import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GameService } from '../../shared/services/game.service';
import { provideHttpClient } from '@angular/common/http';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  let gameService: GameService;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [provideHttpClientTesting(), provideHttpClient()]
    })
      .compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    gameService = TestBed.inject(GameService);

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
