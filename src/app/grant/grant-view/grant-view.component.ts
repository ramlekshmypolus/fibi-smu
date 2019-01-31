import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { GrantService } from '../services/grant.service';

@Component({
  selector: 'app-grant-view',
  templateUrl: './grant-view.component.html',
  styleUrls: ['./grant-view.component.css']
})
export class GrantViewComponent implements OnInit {

  @Input() result: any = {};
  @Input() showDataFlagObj: any = {};

  readMoreOrNotObj: any = {};

  constructor( private _router: Router, private _grantService: GrantService ) { }

  ngOnInit() {}

  /** navigate to dashboard */
  openGoBackModal() {
    this._router.navigate( ['fibi/dashboard/grantCall'] );
  }

  setCurrentProposalTab() {
    localStorage.setItem('currentTab', 'PROPOSAL_HOME');
  }

  downloadAttachments( attachment ) {
    if (attachment.attachmentId != null) {
      this._grantService.downloadAttachment( attachment.attachmentId )
      .subscribe( data => {
        const a = document.createElement( 'a' );
        a.href = URL.createObjectURL( data );
        a.download = attachment.fileName;
        document.body.appendChild(a);
        a.click();
      } );
    } else {
      const URL = 'data:' + attachment.mimeType + ';base64,' + attachment.attachment;
      const a = document.createElement( 'a' );
      a.href = URL;
      a.download = attachment.fileName;
      document.body.appendChild(a);
      a.click();
    }
  }

}
