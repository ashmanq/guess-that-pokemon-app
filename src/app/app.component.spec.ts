import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { GameService } from '../shared/services/game.service';

// describe('AppComponent', () => {
//   let gameService: GameService;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [AppComponent],
//       providers: [GameService]
//     }).compileComponents();
//     gameService = TestBed.inject(GameService);
//   });

//   it('should create the app', () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app).toBeTruthy();
//   });

//   it(`should start with game started as false`, () => {
//     const fixture = TestBed.createComponent(AppComponent);
//     const app = fixture.componentInstance;
//     expect(app.gameStarted).toEqual(false);
//   });
// });
