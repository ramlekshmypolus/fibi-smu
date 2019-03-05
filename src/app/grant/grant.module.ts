import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Ng2CompleterModule } from 'ng2-completer';
import { GrantRoutingModule } from './grant-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';

import { GrantComponent } from './grant.component';
import { GrantViewComponent } from './grant-view/grant-view.component';
import { GrantEditComponent } from './grant-edit/grant-edit.component';

import { GrantService } from './services/grant.service';

@NgModule({
  imports: [
    CommonModule,
    GrantRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    Ng2CompleterModule,
    SharedModule,
    NgxSpinnerModule
  ],
  declarations: [GrantComponent, GrantViewComponent, GrantEditComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    GrantService
  ]
})
export class GrantModule { }
