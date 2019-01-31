import { Directive, Output, HostListener, EventEmitter, Input , OnInit } from '@angular/core';

@Directive({
  selector: '[appDragNdrop]'
})
export class DragNdropDirective {

  constructor() { }
  @Output() filesDropEvent: EventEmitter<any> = new EventEmitter();

  @HostListener('dragover') onDragOver() {
      return false;
  }
  @HostListener('dragenter' ['$event']) onDragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
    return false;
}
  @HostListener('drop', ['$event']) handleDrop(event) {
      event.preventDefault();
      this.handleInputChange(event);
      this.filesDropEvent.emit(event.dataTransfer.files[0]);
  }
  handleInputChange(event) {
  }
}
