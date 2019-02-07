import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  saveProposal( params ) {
    return this._http.post( this._commonService.baseUrl + '/saveOrUpdateProposal', params );
  }

  submitProposal( params ) {
    return this._http.post( this._commonService.baseUrl + '/submitProposal', params );
  }

  printProposal(proposalId) {
    return this._http.get( this._commonService.baseUrl + '/printProposalPdfReport', {
      headers: new HttpHeaders().set( 'proposalId', proposalId.toString() ),
      responseType: 'blob'
      } );
  }

  createProposalPreReview( params ) {
    return this._http.post( this._commonService.baseUrl + '/createProposalPreReview', params );
  }

  downloadPreReviewAttachment( attachmentId ) {
    return this._http.get( this._commonService.baseUrl + '/downloadPreReviewAttachment', {
        headers: new HttpHeaders().set( 'attachmentId', attachmentId.toString() ),
        responseType: 'blob'
    } );
  }

  addPreReviewComment( formData ) {
    return this._http.post( this._commonService.baseUrl + '/addPreReviewComment', formData );
  }

  approveOrDisapprovePreReview( params ) {
    return this._http.post( this._commonService.baseUrl + '/approveOrDisapprovePreReview', params );
  }

  approveDisapproveProposal( formData ) {
    return this._http.post( this._commonService.baseUrl + '/approveOrRejectProposal', formData );
  }

}
