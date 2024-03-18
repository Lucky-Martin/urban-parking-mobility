import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-reset-map-button',
  templateUrl: './reset-map-button.component.html',
  styleUrls: ['./reset-map-button.component.scss'],
})
export class ResetMapButtonComponent  implements OnInit {
  @Output() mapReset: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

  onResetMap() {
    this.mapReset.emit();
  }
}
