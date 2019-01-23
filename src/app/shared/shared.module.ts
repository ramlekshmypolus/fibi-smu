import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DragNdropDirective } from './file-drop/drag-ndrop.directive';

import { AppElasticComponent } from './app-elastic/app-elastic.component';
import { FileDropComponent } from './file-drop/file-drop.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [AppElasticComponent, FileDropComponent, DragNdropDirective],
  exports: [
    AppElasticComponent,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FileDropComponent,
    DragNdropDirective
  ],

})
export class SharedModule { }
