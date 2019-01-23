import { Directive, Output, HostListener, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: '[appDragNdrop]'
})
export class DragNdropDirective {

  constructor() { }
  @Input() multiple;
  @Output() filesDropEvent: EventEmitter<any> = new EventEmitter();

  @HostListener('dragover') onDragOver() {
      return false;
  }
  @HostListener('dragenter' ['$event']) onDragStart(e) {
    e.dataTransfer.setData('text', e.target.id);
    return false;
  }
  @HostListener('drop', ['$event']) handleDrop(e) {
    e.preventDefault();
    this.filesDropEvent.emit(e.dataTransfer.files);
  }
}
