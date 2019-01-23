import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrantComponent } from './grant.component';

const routes: Routes = [{ path: '', component: GrantComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrantRoutingModule { }
