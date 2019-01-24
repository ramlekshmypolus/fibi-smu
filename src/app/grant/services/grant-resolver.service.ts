import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { GrantService } from './grant.service';

@Injectable()
export class GrantResolverService implements Resolve<any> {

  constructor( private _grantService: GrantService) {}

  resolve(route: ActivatedRouteSnapshot) {
    if (route.queryParamMap.get('grantId') == null) {
      return this._grantService.createGrantCall();
    } else {
      return this._grantService.loadGrantById({'grantCallId': route.queryParamMap.get('grantId')});
    }
  }
}
