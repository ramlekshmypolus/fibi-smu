import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProposalComponent } from './proposal.component';

import { ProposalResolverService } from './services/proposal-resolver.service';

const routes: Routes = [{path: '', component: ProposalComponent, resolve: { proposalDetails: ProposalResolverService } }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ProposalResolverService]
})
export class ProposalRoutingModule { }
