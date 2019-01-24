import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GrantService } from './services/grant.service';

@Component({
  selector: 'app-grant',
  templateUrl: './grant.component.html',
})
export class GrantComponent implements OnInit {

  grantId = '';

  result: any = {};
  showDataFlagObj: any  = {
    isCurrencyFocusOn : false,
    isShowAddPointOfContact : true,
    isShowAreaOfResearch : true,
    isShowEligibility : true,
    isShowAttachmentList: true,
    mode: ''
  };

  constructor( private _route: ActivatedRoute ) {}

  ngOnInit() {
    this.result = this._route.snapshot.data.grantDetails;
    this.grantId = this._route.snapshot.queryParamMap.get('grantId');
    if (this.grantId == null) {
      this.showDataFlagObj.mode = 'create';
    } else {
        if (this.result.grantCall.grantStatusCode === 1) {
            this.showDataFlagObj.mode = 'edit';
        } else {
            this.showDataFlagObj.mode = 'view';
        }
    }
  }

}
