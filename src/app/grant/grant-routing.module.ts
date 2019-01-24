import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GrantComponent } from './grant.component';

import { GrantResolverService } from './services/grant-resolver.service';

const routes: Routes = [{ path: '', component: GrantComponent, resolve: { grantDetails: GrantResolverService } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [GrantResolverService]
})
export class GrantRoutingModule { }
