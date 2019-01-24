import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CommonService } from '../../common/services/common.service';

@Injectable()
export class ProposalService {

  constructor( private _http: HttpClient, private _commonService: CommonService) { }

  createProposal(params) {
    return this._http.post( this._commonService.baseUrl + '/createProposal', params );
  }

  loadProposalById( params ) {
    return this._http.post( this._commonService.baseUrl + '/loadProposalById', params );
  }

  createProposalBudget(params) {
    return this._http.post( this._commonService.baseUrl + '/createProposalBudget', params );
  }
}
