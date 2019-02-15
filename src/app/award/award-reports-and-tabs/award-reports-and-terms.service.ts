
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { CommonService } from '../../common/services/common.service';

@Injectable()
export class AwardReportsAndTermsService {
    awardId: any;

    constructor( private http: HttpClient, private _commonService: CommonService, private route: ActivatedRoute ) { }

    getAwardReportsAndTerms() {
        this.awardId = this.route.snapshot.queryParamMap.get( 'awardId' );
        const params = { 'awardId': this.awardId };
        return this.http.post( this._commonService.baseUrl + '/getAwardReportsAndTerms', params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error );
            } );
    }
}
