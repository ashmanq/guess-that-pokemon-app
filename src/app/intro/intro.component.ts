import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.scss'
})
export class IntroComponent {
  @Output() start = new EventEmitter<void>();


  onStart() {
    this.start.emit();
  }
}
