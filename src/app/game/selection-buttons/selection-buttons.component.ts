import { Component, inject, output } from '@angular/core';
import { GameService } from '../../../shared/services/game.service';

@Component({
  selector: 'app-selection-buttons',
  standalone: true,
  imports: [],
  templateUrl: './selection-buttons.component.html',
  styleUrl: './selection-buttons.component.scss'
})
export class SelectionButtonsComponent {
  optionSelected = output<string>();
  private gameService = inject(GameService);


  get optionsList() {
    return this.gameService.getCurrentRoundButtonOptions();
  }

  onSelectionClicked(option: string) {
    this.optionSelected.emit(option);
  }

}
