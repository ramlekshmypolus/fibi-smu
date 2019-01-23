import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CommonService } from '../common/services/common.service';

@Injectable()
export class GrantService {

  constructor( private _commonService: CommonService, private _http: HttpClient ) { }

  createGrantCall() {
    return this._http.post(this._commonService.baseUrl + '/createGrantCall', {} );
  }

  loadGrantById(params) {
    return this._http.post(this._commonService.baseUrl + '/loadGrantCallById', params);
  }

  fetchSponsorsBySponsorType(params) {
    return this._http.post(this._commonService.baseUrl + '/fetchSponsorsBySponsorType', params);
  }

  addGrantCallAttachment(params) {
    return this._http.post(this._commonService.baseUrl + '/addGrantCallAttachment', params);
  }

  deleteGrantCallKeyword(params) {
    return this._http.post(this._commonService.baseUrl + '/deleteGrantCallKeyword', params);
  }

  deleteGrantCallContact(params) {
    return this._http.post(this._commonService.baseUrl + '/deleteGrantCallContact', params);
  }

  deleteGrantCallAreaOfResearch(params) {
    return this._http.post(this._commonService.baseUrl + '/deleteGrantCallAreaOfResearch', params);
  }

  deleteGrantCallEligibility(params) {
    return this._http.post(this._commonService.baseUrl + '/deleteGrantCallEligibility', params);
  }

  deleteGrantCallAttachment(params) {
    return this._http.post(this._commonService.baseUrl + '/deleteGrantCallAttachment', params);
  }

  downloadAttachment(attachmentId) {
    return this._http.get(this._commonService.baseUrl + '/downloadGrantCallAttachment', {
      headers: new HttpHeaders().set('attachmentId', attachmentId.toString()),
      responseType: 'blob'
  } );
  }

  saveGrantCall(params) {
    return this._http.post(this._commonService.baseUrl + '/saveUpdateGrantCall', params);
  }

  publishGrantCall(params) {
    return this._http.post(this._commonService.baseUrl + '/publishGrantCall', params);
  }

}
