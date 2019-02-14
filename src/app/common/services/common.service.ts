import { Injectable} from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class CommonService {

  // baseUrl = 'http://192.168.1.139:8080/fibi4';
   baseUrl = '';
  // baseUrl = 'https://demo.fibiweb.com/fibi4';
  // baseUrl = 'https://polus.fibiweb.com/fibi4';

   elasticIndexUrl = 'http://192.168.1.76:9200/';
  // elasticIndexUrl = 'http://52.20.110.7:9200/';
  // elasticIndexUrl = 'https://demo.fibiweb.com:4445/';
  // elasticIndexUrl = 'https://polus.fibiweb.com:4445/';
  // elasticIndexUrl = 'https://demo.fibiweb.com/elastic/';

   outputPath = 'http://192.168.1.139:8080/kc-dev';
  // outputPath = 'https://demo.fibiweb.com/kc-dev';
  // outputPath = 'https://polus.fibiweb.com/kc-dev';

  outputPathAB = 'http://192.168.1.139:8080/AwardBudgetTool';
  // outputPathAB = 'https://demo.fibiweb.com/AwardBudgetTool';
  // outputPathAB = 'https://polus.fibiweb.com/AwardBudgetTool';

  outputPathOST = 'http://192.168.1.139:8080/sst';
  // outputPathOST = 'https://demo.fibiweb.com/sst';
  // outputPathOST = 'https://polus.fibiweb.com/sst';

  IRBOutputPath = 'http://192.168.1.139:8080/fibi-irb/dashboard#/irb/dashboard';
  // IRBOutputPath = 'https://demo.fibiweb.com/fibi-irb/dashboard#/irb/dashboard';
  // IRBOutputPath = 'https://polus.fibiweb.com/fibi-irb/dashboard#/irb/dashboard';

  dashboardRequestObject = {
    property1: '',
    property2: '',
    property3: '',
    property4: '',
    pageNumber: 20,
    sortBy: 'updateTimeStamp',
    reverse: 'DESC',
    tabIndex: null,
    userName: localStorage.getItem( 'currentUser' ),
    personId: localStorage.getItem('personId'),
    currentPage: 1,
    isUnitAdmin: (localStorage.getItem('isAdmin') === 'true'),
    unitNumber: localStorage.getItem('unitNumber'),
    provost: (localStorage.getItem( 'provost' ) === 'true'),
    reviewer: (localStorage.getItem( 'reviewer' ) === 'true'),
    proposalTabName: null
  };

  constructor( private _http: HttpClient) { }

  logout() {
    localStorage.clear();
  }

  getDashboardObject() {
    this.dashboardRequestObject.isUnitAdmin = (localStorage.getItem('isAdmin') === 'true');
    this.dashboardRequestObject.personId    = localStorage.getItem('personId');
    this.dashboardRequestObject.unitNumber  = localStorage.getItem('unitNumber'),
    this.dashboardRequestObject.userName    = localStorage.getItem( 'currentUser' );
    this.dashboardRequestObject.provost     = (localStorage.getItem( 'provost' ) === 'true');
    this.dashboardRequestObject.reviewer    = (localStorage.getItem( 'reviewer' ) === 'true');
    return Object.assign({}, this.dashboardRequestObject);
  }

  /* scrolls page to top */
  pageScroll(elementId) {
    const id = document.getElementById(elementId);
    if (id) {
        id.scrollIntoView({behavior : 'smooth'});
    }
  }

  _keyPress(event: any, patternType) {
    const pattern = patternType === 'date' ? /[0-9\+\-\/\ ]/ : /[0-9\a-zA-Z]/;
    if (!pattern.test(String.fromCharCode(event.charCode))) {
        event.preventDefault();
    }
  }

  downloadRoutelogAttachment( attachmentId ) {
    return this._http.get( this.baseUrl + '/downloadWorkflowAttachment', {
        headers: new HttpHeaders().set( 'attachmentId', attachmentId.toString() ),
        responseType: 'blob'
    } );
  }

  copyProposal(proposal) {
    return this._http.post( this.baseUrl + '/copyProposal', proposal );
  }

  deleteProposal(params) {
    return this._http.post( this.baseUrl + '/deleteProposal', params);
  }

  copyGrantCall(params) {
    return this._http.post( this.baseUrl + '/copyGrantCall', params );
  }

}
