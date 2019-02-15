import { HierarchyTreeviewComponent } from './hierarchy-treeview/hierarchy-treeview.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RateMaintainanceComponent } from './rate-maintainance/rate-maintainance.component';

const routes: Routes = [{ path: '', component: HierarchyTreeviewComponent},
                        { path: 'rateMaintainance', component: RateMaintainanceComponent },
                        { path: 'LArateMaintainance', component: RateMaintainanceComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitHierarchyRoutingModule { }
