import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-file-drop',
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.css']
})
export class FileDropComponent implements OnInit {

  @Input() multiple;
  @Output() filesDropEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild('dragdropfile')
  public fileSelector: ElementRef;
  constructor() { }

  ngOnInit() {
    if (this.multiple) {
      (this.fileSelector.nativeElement as HTMLInputElement).multiple = true;
    }
  }
  onFileDrop(files) {
    this.filesDropEvent.emit(files);
    (this.fileSelector.nativeElement as HTMLInputElement).value = '';
  }
  triggerClickEvent() {
  (this.fileSelector.nativeElement as HTMLInputElement).click();
 }
}
