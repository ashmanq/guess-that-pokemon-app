import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionButtonsComponent } from './selection-buttons.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { GameService } from '../../../shared/services/game.service';

describe('SelectionButtonsComponent', () => {
  let component: SelectionButtonsComponent;
  let fixture: ComponentFixture<SelectionButtonsComponent>;

  let gameService: GameService;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionButtonsComponent],
      providers: [provideHttpClientTesting(), provideHttpClient()]
    })
    .compileComponents();


    httpTesting = TestBed.inject(HttpTestingController);
    gameService = TestBed.inject(GameService);

    fixture = TestBed.createComponent(SelectionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
