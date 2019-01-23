import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../common/services/common.service';

@Injectable()
export class DashboardService {

  constructor( private _http: HttpClient, private _commonService: CommonService) {}

  fetchAllReportData() {
      return this._http.post(this._commonService.baseUrl + '/fetchReportData', {} );
  }
  /** fetches dashboard data for all dashboard components
   * @param  {} params
   */
  getDashboardList(params) {
      return this._http.post( this._commonService.baseUrl + '/fibiDashBoard', params);
  }
  /** fetches document type and component names to export data
   * @param  {} params
   */
  exportDasboardData(params) {
      return this._http.post( this._commonService.baseUrl + '/exportDashboardDatas', params, {
          observe: 'response',
          responseType: 'blob'
        });
  }

  /** fetches detailed report of selected report type
   * @param params
   */
  fetchApplicationReport( params ) {
      return this._http.post( this._commonService.baseUrl + '/applicationReport', params );
  }

  /** fetches research-summary chart datas
   * @param params
   */
  getResearchSummaryData(params) {
    return this._http.post( this._commonService.baseUrl + '/getResearchSummaryData', params);
  }
  getUserNotification(params) {
      return this._http.post( this._commonService.baseUrl + '/getUserNotification', params);
  }

  downloadRoutelogAttachment( attachmentId ) {
    return this._http.get( this._commonService.baseUrl + '/downloadWorkflowAttachment', {
        headers: new HttpHeaders().set( 'attachmentId', attachmentId.toString() ),
        responseType: 'blob'
    } );
  }

  copyProposal(proposal) {
    return this._http.post( this._commonService.baseUrl + '/copyProposal', proposal );
  }
}
