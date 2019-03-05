import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from '../dashboard.service';
import { CommonService } from '../../common/services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
})
export class ProposalListComponent implements OnInit {

  isShowNoCreateProposalModal = false;
  isReverse = true;
  isShowResultCard = false;
  isShowAdvanceSearchOptions = false;
  isRoutelogOpened = false;
  isShowDeleteWarningModal = false;
  isShowCopyWarningModal = false;
  isAdmin: boolean;

  serviceRequestList: any[] = null;
  workFlowList = [];
  workflowDetailsMap: any = [];
  selectedAttachmentStop: any = [];

  result: any = {};
  elasticResultObject: any = {};
  elasticSearchOptions: any = {};
  commentsGrantManagerExpand: any = {};
  proposalRequestObject =  this._commonService.getDashboardObject();
  adminStatus: string;
  versionHistorySelected: number;
  proposalIndex: number;
  proposalId: number;

  constructor( private _router: Router,
    private _dashboardService: DashboardService,
    public _commonService: CommonService,
    private _spinner: NgxSpinnerService ) { }

  ngOnInit() {
    this.proposalRequestObject.proposalTabName = 'MY_PROPOSAL';
    this.proposalRequestObject.tabIndex        = 'PROPOSAL';
    this.loadDashboard();
    this.elasticSearchOptions.url = this._commonService.elasticIndexUrl;
    this.elasticSearchOptions.index = 'fibiproposal';
    this.elasticSearchOptions.type = 'fibiproposal';
    this.elasticSearchOptions.size = 20;
    this.elasticSearchOptions.contextField = 'proposal_id';
    this.elasticSearchOptions.debounceTime = 500;
    this.elasticSearchOptions.fields = {
      proposal_id: {},
      title: {},
      full_name: {},
      category: {},
      type: {},
      status: {},
      sponsor: {}
    };
  }

  /** fetch proposal list */
  loadDashboard() {
    this._dashboardService.getDashboardList(this.proposalRequestObject)
        .subscribe(data => {
            this.result = data || [];
            if (this.result !== null) {
                this.serviceRequestList = this.result.proposal;
            }
    });
  }


  /** show and hide advance search feature
   * @param event
   */
  showAdvanceSearch(event: any) {
    event.preventDefault();
    this.isShowAdvanceSearchOptions = !this.isShowAdvanceSearchOptions;
    this.clear();
  }

  /** searches using advance search options */
  searchUsingAdvanceOptions() {
    /* close elastic search result if it is open */
    if (this.isShowResultCard === true) {
        this.isShowResultCard = false;
    }
    this.loadDashboard();
  }

  /** clear all advanced search fields */
  clear() {
    this.proposalRequestObject.property1 = '';
    this.proposalRequestObject.property2 = '';
    this.proposalRequestObject.property3 = '';
    this.proposalRequestObject.property4 = '';
    this.proposalRequestObject.property5 = '';
  }

  /** navigate to proposal create page if the logged in user has permission*/
  gotoProposal() {
    if (localStorage.getItem('createProposal') === 'true') {
        localStorage.setItem('currentTab', 'PROPOSAL_HOME');
        this._spinner.show();
        this._router.navigate(['fibi/proposal']);
    } else {
        this.isShowNoCreateProposalModal = true;
    }
  }

  /** select a result from elastic search
   * @param value
   */
  selectProposalElasticResult(value) {
    if (value) {
        this.isShowResultCard = true;
        this.elasticResultObject = value;
      } else {
        this.isShowResultCard = false;
        this.elasticResultObject = {};
      }
  }

  /** sends boolean value to elastic component - when clearing the elatic input result card also vanishes
 * @param $event
 */
  receiveResultCard($event) {
    this.isShowResultCard = $event;
  }

  /** sorts results based on fields
   * @param sortFieldBy
   */
  sortResult(sortFieldBy) {
    this.isReverse = (this.proposalRequestObject.sortBy === sortFieldBy) ? !this.isReverse : false;
    if (this.isReverse) {
        this.proposalRequestObject.reverse = 'DESC';
    } else {
        this.proposalRequestObject.reverse = 'ASC';
    }
    this.proposalRequestObject.sortBy = sortFieldBy;
    this.loadDashboard();
  }

  /** view proposal
   * @param event
   * @param proposalId
   */
  viewProposalById(event: any, proposalId) {
    event.preventDefault();
    localStorage.setItem('currentTab', 'PROPOSAL_HOME');
    this._spinner.show();
    this._router.navigate(['fibi/proposal'], { queryParams: { 'proposalId': proposalId } });
  }

  /** export proposal data as excel sheet or pdf
   * @param docType
   */
  exportAsTypeDoc(docType) {
    const exportDataReqObject = {
        tabIndex: 'PROPOSAL',
        userName: localStorage.getItem( 'currentUser' ),
        personId: localStorage.getItem( 'personId' ),
        isUnitAdmin: localStorage.getItem('isAdmin'),
        unitNumber: localStorage.getItem('unitNumber'),
        property1: this.proposalRequestObject.property1,
        property2: this.proposalRequestObject.property2,
        property3: this.proposalRequestObject.property3,
        property4: this.proposalRequestObject.property4,
        property5: this.proposalRequestObject.property5,
        reviewer: ( localStorage.getItem( 'reviewer' ) === 'true' ) ? true : false,
        proposalTabName: this.proposalRequestObject.proposalTabName,
        documentHeading: this.proposalRequestObject.proposalTabName === 'PROPOSAL' ?
                         'All Proposals' : this.proposalRequestObject.proposalTabName === 'MY_PROPOSAL' ?
                         'My Proposals' : 'Review Pending Proposals',
        exportType: docType === 'excel' ? 'xlsx' : docType === 'pdf' ? 'pdf' : '',
    };
    this._dashboardService.exportDasboardData(exportDataReqObject).subscribe(
        data => {
            let fileName = '';
            fileName = exportDataReqObject.documentHeading;
            // msSaveOrOpenBlob only available for IE & Edge
            if (window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveBlob( new Blob([data.body], { type: exportDataReqObject.exportType }),
                                            fileName.toLowerCase() + '.' + exportDataReqObject.exportType );
            } else {
                const DOWNLOAD_BTN = document.createElement('a');
                DOWNLOAD_BTN.href = URL.createObjectURL(data.body);
                DOWNLOAD_BTN.download = fileName.toLowerCase() + '.' + exportDataReqObject.exportType;
                document.body.appendChild(DOWNLOAD_BTN);
                DOWNLOAD_BTN.click();
            }
        });
  }

  /** fetch route log details of submitted proposals
   * @param proposal
   * @param proposalInde
   */
  fetchRouteLog(proposal, proposalIndex) {
    this.versionHistorySelected = proposal.workflow.workflowSequence;
    this.workFlowList = proposal.workflowList;
    this.isRoutelogOpened = true;
    this.workflowDetailsMap = [];
    this.proposalIndex = proposalIndex;
    if (proposal.workflow != null && proposal.workflow.workflowDetails.length > 0) {
        for (const KEY in proposal.workflow.workflowDetailMap) {
            if (proposal.workflow.workflowDetailMap[KEY] !== null) {
                this.workflowDetailsMap.push(proposal.workflow.workflowDetailMap[KEY]);
            }
        }
        this.workflowDetailsMap.forEach((value, index) => {
            this.selectedAttachmentStop[index] = [];
            value.forEach((workFlowValue, valueIndex) => {
                if (workFlowValue.workflowAttachments != null && workFlowValue.workflowAttachments.length > 0) {
                    this.selectedAttachmentStop[index][valueIndex] = workFlowValue.workflowAttachments[0].fileName;
                }
            });
        });
    }
  }

  /** change route log version to display route log of that version*/
  routeLogVersionChange() {
    for (const WORKFLOW of this.workFlowList) {
        if (WORKFLOW.workflowSequence.toString() === this.versionHistorySelected) {
            this.workflowDetailsMap = [];
            for (const KEY in WORKFLOW.workflowDetailMap) {
                if (WORKFLOW.workflowDetailMap[KEY] !== null) {
                    this.workflowDetailsMap.push(WORKFLOW.workflowDetailMap[KEY]);
                }
            }
        }
    }
  }

  /** download route log attachment
   * @param event
   * @param selectedFileName
   * @param selectedAttachArray
   */
  downloadRouteAttachment( event, selectedFileName, selectedAttachArray: any[] ) {
    event.preventDefault();
    for ( const ATTACHMENT of selectedAttachArray ) {
        if ( ATTACHMENT.fileName === selectedFileName ) {
            this._commonService.downloadRoutelogAttachment( ATTACHMENT.attachmentId )
            .subscribe(
                data => {
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveBlob( new Blob([data], { type: ATTACHMENT.mimeType }), ATTACHMENT.fileName );
                    } else {
                        const a = document.createElement( 'a' );
                        a.href = URL.createObjectURL( data );
                        a.download = ATTACHMENT.fileName;
                        document.body.appendChild(a);
                        a.click();
                    }
                } );
        }
    }
  }

  setCurrentProposalTab() {
    localStorage.setItem('currentTab', 'PROPOSAL_HOME');
  }

  clearModalFlags() {
    this.isShowNoCreateProposalModal = false;
    this.isShowDeleteWarningModal = false;
    this.isShowCopyWarningModal = false;
  }

  temprySaveProposal(proposalId, index) {
    this.proposalId = proposalId;
    this.proposalIndex = index;
    this.isShowDeleteWarningModal = true;
  }

  deleteProposal() {
    this._commonService.deleteProposal({'proposalId': this.proposalId}).subscribe((success: any) => {
        if (success.message === 'Proposal deleted successfully') {
            this.serviceRequestList.splice(this.proposalIndex, 1);
        }
    });
  }


  tempryCopyProposal(proposalId) {
    this.proposalId = proposalId;
    this.isShowCopyWarningModal = true;
 }

  /** copy and open proposal
   * @param proposalId
   */
  copyProposal() {
    const proposalVO = {
        proposal: null,
        proposalId: this.proposalId,
        userFullName: localStorage.getItem('userFullname')
    };
    this._commonService.copyProposal(proposalVO).subscribe((success: any) => {
        localStorage.setItem('currentTab', 'PROPOSAL_HOME');
        this._router.navigate(['fibi/proposal'], { queryParams: { 'proposalId': success.proposal.proposalId } });
    });
  }

}
