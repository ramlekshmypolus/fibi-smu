import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SearchComponent } from './search/search.component';
import { CodeTableComponent } from './code-table/code-table.component';
import { SearchService } from './search/search.service';
import { CodeTableService } from './code-table/code-table.service';
import { FilterPipe } from './code-table/filter.pipe';
import { DragNdropDirective } from './code-table/drag-ndrop.directive';
import { CodetableRoutingModule } from './codetable-routing.module';

import { Ng2CompleterModule } from 'ng2-completer';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  imports: [  CommonModule,
              Ng2CompleterModule,
              FormsModule,
              OwlDateTimeModule,
              OwlNativeDateTimeModule,
              CodetableRoutingModule
           ],
  declarations: [ SearchComponent,
                  CodeTableComponent,
                  FilterPipe,
                  DragNdropDirective
                ],
  providers: [  SearchService,
                CodeTableService
             ],
  exports: [ CodeTableComponent,
             SearchComponent
           ]
})
export class CodetableModule { }
