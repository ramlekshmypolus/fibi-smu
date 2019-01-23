import { Injectable } from '@angular/core';
import { Http, HttpModule, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CommonService } from '../common/services/common.service';

@Injectable()
export class LoginService {
    private authUrl = 'http://reqres.in/api/login';
    private loggedIn = false;
    leadUnits = new BehaviorSubject<any>([]); // lead units allowed for logged user
    leadUnitsVariable = this.leadUnits.asObservable();

    constructor( private http: HttpClient, private _commonService: CommonService ) { }

    login(username: string, password: string) {
        const params = {
                principalName: username,
                password: password
        };
        return this.http.post(this._commonService.baseUrl + '/login', params, { observe: 'response' });
      }
    setLeadUnits(leadUnits: any) {
        this.leadUnits = leadUnits ;
    }
    getLeadUnits() {
        return this.leadUnits;
    }
}
