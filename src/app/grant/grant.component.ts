import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { GrantService } from './grant.service';

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

  constructor( private _grantService: GrantService,
    private _route: ActivatedRoute ) {}

  ngOnInit() {
    this.grantId = this._route.snapshot.queryParamMap.get('grantId');
    if (this.grantId == null) {
      this.showDataFlagObj.mode = 'create';
      this._grantService.createGrantCall().subscribe(data => {
        this.result = data;
      });
    } else {
      this._grantService.loadGrantById({'grantCallId': this.grantId}).subscribe(response => {
        this.result = response;
        if (this.result.grantCall.grantStatusCode === 1) {
            this.showDataFlagObj.mode = 'edit';
        } else {
            this.showDataFlagObj.mode = 'view';
        }
      });
    }
  }

}
