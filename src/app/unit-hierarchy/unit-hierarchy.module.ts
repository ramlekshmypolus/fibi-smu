import { UnitHierarchyService } from './unit-hierarchy.service';
import { FilterPipe } from './filter.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UnitHierarchyRoutingModule } from './unit-hierarchy-routing.module';
import { HierarchyTreeviewComponent } from './hierarchy-treeview/hierarchy-treeview.component';
import { RateMaintainanceComponent } from './rate-maintainance/rate-maintainance.component';
import { SharedModule } from '../shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RatePipeService } from './rate-maintainance/rate-pipe.service';

@NgModule({
  imports: [
    CommonModule,
    UnitHierarchyRoutingModule,
    FormsModule,
    SharedModule,
    NgxSpinnerModule,
    NgbModule.forRoot(),
  ],
  declarations: [HierarchyTreeviewComponent, RateMaintainanceComponent, FilterPipe ],
  providers: [UnitHierarchyService, RatePipeService]
})
export class UnitHierarchyModule {  }
