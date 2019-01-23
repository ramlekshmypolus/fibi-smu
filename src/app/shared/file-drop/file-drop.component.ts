import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.css']
})
export class FileDropComponent implements OnInit {

  @Input() multiple;
  @Output() filesDropEvent: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
    if (this.multiple) {
      (<HTMLInputElement>document.getElementById('drag-drop-file')).multiple = true;
    }
  }
  onFileDrop(files) {
    this.filesDropEvent.emit(files);
  }

}
