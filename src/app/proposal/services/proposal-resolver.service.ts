import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { ProposalService } from './proposal.service';

@Injectable()
export class ProposalResolverService implements Resolve<any> {

  constructor( private _proposalService: ProposalService) {}

  resolve( route: ActivatedRouteSnapshot) {
    if (route.queryParamMap.get('proposalId') == null) {
      if (route.queryParamMap.get('grantId') == null) {
        return this._proposalService.createProposal({'personId': localStorage.getItem('personId'), 'grantCallId': null});
      } else {
        return this._proposalService.createProposal({'personId': localStorage.getItem('personId'),
        'grantCallId': route.queryParamMap.get('grantId')});
      }
    } else {
      return this._proposalService.loadProposalById({'proposalId': route.queryParamMap.get('proposalId'),
      'personId': localStorage.getItem('personId'), 'userName': localStorage.getItem('currentUser')});
    }
  }

}
