import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CommonService } from '../../common/services/common.service';

@Injectable()
export class ProposalBudgetService {

  constructor(private _http: HttpClient, private _commonService: CommonService) { }

  fetchCostElement( searchString, budgetCategoryCode) {
    return this._http.get( this._commonService.baseUrl + '/findCostElement',
                           { headers: new HttpHeaders().set( 'searchString', searchString ).set( 'budgetCategoryCode', budgetCategoryCode )}
                         );
  }

  fetchBudgetCategory( searchString) {
    return this._http.get( this._commonService.baseUrl + '/findBudgetCategory' + '?searchString=' + searchString);
  }

  fetchCostElementByBudgetCategory(param) {
    return this._http.post( this._commonService.baseUrl + '/fetchCostElementByBudgetCategory', param );
  }

  addBudgetPeriod(param) {
    return this._http.post( this._commonService.baseUrl + '/addBudgetPeriod', param );
  }

  copyBudgetPeriod(param) {
    return this._http.post( this._commonService.baseUrl + '/copyBudgetPeriod', param );
  }

  generateBudgetPeriod(param) {
    return this._http.post( this._commonService.baseUrl + '/generateBudgetPeriods', param );
  }

  deleteBudgetPeriod(param) {
    return this._http.post( this._commonService.baseUrl + '/deleteBudgetPeriod', param );
  }

  deleteLineItem(param) {
    return this._http.post( this._commonService.baseUrl + '/deleteBudgetLineItem', param );
  }

  applyRates(param) {
    return this._http.post( this._commonService.baseUrl + '/autoCalculate', param );
  }

  resetBudgetRates(param) {
    return this._http.post( this._commonService.baseUrl + '/resetBudgetRates', param );
  }

  getSyncBudgetRates(param) {
    return this._http.post( this._commonService.baseUrl + '/getSyncBudgetRates', param );
  }

  printBudget(proposalId) {
    return this._http.get( this._commonService.baseUrl + '/printBudgetPdfReport', {
      headers: new HttpHeaders().set( 'proposalId', proposalId.toString()),
      responseType: 'blob'
    });
  }

}
