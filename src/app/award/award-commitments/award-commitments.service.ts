import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { CommonService } from '../../common/services/common.service';

@Injectable()
export class AwardCommitmentsService {
    constructor( private _commonService: CommonService, private http: HttpClient ) {

    }

    loadCostsharingDetails( awardId: string ): Observable<JSON> {
        const params = { 'awardId': awardId };
        return this.http.post( this._commonService.baseUrl + '/getAwardCommitments', params )
            .catch( error => {
                console.error( error.message || error );
                return Observable.throw( error.message || error );
            } );
    }
}
