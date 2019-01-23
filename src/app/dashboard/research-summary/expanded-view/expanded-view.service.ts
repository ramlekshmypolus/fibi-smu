import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CommonService } from '../../../common/services/common.service';

@Injectable()
export class ExpandedViewService {
  constructor(private _http: HttpClient, private _commonService: CommonService) { }

  loadDetailedResearchSummary(params) {
    return this._http.post( this._commonService.baseUrl + '/getDetailedResearchSummary', params);
  }

  loadPieChartDataByType(params) {
    return this._http.post( this._commonService.baseUrl + '/getPieChartDataByType', params);
  }

  loadDonutChartDataByType(params) {
    return this._http.post( this._commonService.baseUrl + '/getDonutChartDataBySponsor', params);
  }

  exportResearchSummaryData(params) {
    return this._http.post( this._commonService.baseUrl + '/exportResearchSummaryDatas', params, {
      observe: 'response',
      responseType: 'blob'
    });
  }
}
