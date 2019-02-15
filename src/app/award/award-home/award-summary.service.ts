import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { CommonService } from '../../common/services/common.service';

@Injectable()
export class AwardSummaryService {
    constructor( private http: HttpClient, private _commonService: CommonService ) {

    }

    public loadAwardSummary( awardId: string ): Observable<JSON> {
        const params = {
            awardId: awardId
        };
        return this.http.post( this._commonService.baseUrl + '/getAwardSummary', params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error );
            } );
    }
}
