import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CommonService } from '../../common/services/common.service';

@Injectable()
export class ProposalHomeService {

  constructor( private http: HttpClient, private _commonService: CommonService ) { }

  fetchAreaOfExcellence(searchString) {
    return this.http.get(this._commonService.baseUrl + '/findAreaOfExcellence' + '?searchString=' + searchString);
  }

  fetchAreaOfResearch(searchString) {
    return this.http.get(this._commonService.baseUrl + '/findAreaOfResearch' + '?searchString=' + searchString);
  }

  deleteProposalResearchArea(params) {
    return this.http.post(this._commonService.baseUrl + '/deleteProposalResearchArea', params);
  }

  deleteProposalSpecialReview( params ) {
   return this.http.post( this._commonService.baseUrl + '/deleteProposalSpecialReview', params);
  }

  fetchLeadUnit (searchString, personId ) {
    return this.http.get( this._commonService.baseUrl + '/findLeadUnits',
        { headers: new HttpHeaders().set( 'searchString', searchString ).set( 'personId', personId)} );
    }

  fetchSponsors( searchString) {
    return this.http.get( this._commonService.baseUrl + '/findSponsors' + '?searchString=' + searchString);
  }

  fetchKeyword( searchString ) {
    return this.http.get( this._commonService.baseUrl + '/findKeyWords' + '?searchString=' + searchString);
  }

  deleteProposalKeyword( params ) {
    return this.http.post( this._commonService.baseUrl + '/deleteProposalKeyword', params );
  }

  fetchGrantCall( searchString) {
    return this.http.get( this._commonService.baseUrl + '/findGrantCall' + '?searchString=' + searchString);
  }

  fetchDepartment( searchString) {
    return this.http.get( this._commonService.baseUrl + '/findDepartment' + '?searchString=' + searchString);
  }

  deleteProposalPerson( params ) {
    return this.http.post( this._commonService.baseUrl + '/deleteProposalPerson', params );
  }

  deleteProposalSponsor( params ) {
    return this.http.post( this._commonService.baseUrl + '/deleteProposalSponsor', params );
  }

  fetchProtocol( searchString ) {
    return this.http.get( this._commonService.baseUrl +  '/findProtocol' + '?searchString=' + searchString);
  }

  deleteIrbProtocol( params ) {
    return this.http.post( this._commonService.baseUrl + '/deleteIrbProtocol', params );
  }

  addProposalAttachment( formData ) {
    return this.http.post( this._commonService.baseUrl + '/addProposalAttachment', formData );
  }

  deleteProposalAttachment( params ) {
    return this.http.post( this._commonService.baseUrl + '/deleteProposalAttachment', params );
  }

  downloadProposalAttachment( attachmentId ) {
    return this.http.get( this._commonService.baseUrl + '/downloadProposalAttachment', {
        headers: new HttpHeaders().set( 'attachmentId', attachmentId.toString() ),
        responseType: 'blob'
    } );
  }

}
