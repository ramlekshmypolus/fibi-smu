import { Component, OnInit, Input } from '@angular/core';

import { GrantService } from '../services/grant.service';

@Component({
  selector: 'app-grant-view',
  templateUrl: './grant-view.component.html',
  styleUrls: ['./grant-view.component.css']
})
export class GrantViewComponent implements OnInit {

  @Input() result: any = {};
  @Input() showDataFlagObj: any = {};

  documentId: number;

  readMoreOrNotObj: any = {};

  attachmentVersions = [];

  constructor( private _grantService: GrantService ) { }

  ngOnInit() {
    this.showDataFlagObj.isAttachmentVersionOpen = [];
  }

  getVersion(index, documentId, isOpen) {
    this.attachmentVersions = [];
    this.documentId = documentId;
    this.showDataFlagObj.isAttachmentVersionOpen = [];
    if (!isOpen || isOpen == null) {
      this.showDataFlagObj.isAttachmentVersionOpen[index] = true;
    }
    this.attachmentVersions = this.result.grantCall.grantCallAttachments.filter(attachObj =>
                                    attachObj.documentStatusCode === 2 && attachObj.documentId === documentId );
  }

  downloadAttachments( attachment ) {
    if (attachment.attachmentId != null) {
      this._grantService.downloadAttachment( attachment.attachmentId )
      .subscribe( data => {
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveBlob( new Blob([data], { type: attachment.mimeType }), attachment.fileName );
        } else {
          const a = document.createElement( 'a' );
          a.href = URL.createObjectURL( data );
          a.download = attachment.fileName;
          document.body.appendChild(a);
          a.click();
        }
      } );
    }
  }

}
