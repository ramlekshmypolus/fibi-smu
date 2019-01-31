import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../../common/services/common.service';

@Injectable()
export class CreateQuestionnaireService {

  constructor(private http: HttpClient, private _commonService: CommonService) { }

  getQuestionnaireList() {
    return this.http.post(this._commonService.baseUrl + '/showAllQuestionnaire', {});
  }
  saveQuestionnaireList(data) {
     return this.http.post(this._commonService.baseUrl + '/configureQuestionnaire', data);
  }
}
