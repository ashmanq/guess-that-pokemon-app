import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonImageComponent } from './pokemon-image.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GameService } from '../game.service';

describe('PokemonImageComponent', () => {
  let component: PokemonImageComponent;
  let fixture: ComponentFixture<PokemonImageComponent>;

  let gameService: GameService;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonImageComponent],
      providers: [provideHttpClientTesting(), provideHttpClient()]
    })
    .compileComponents();


    httpTesting = TestBed.inject(HttpTestingController);
    gameService = TestBed.inject(GameService);

    await gameService.fetchGameRound();

    fixture = TestBed.createComponent(PokemonImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
