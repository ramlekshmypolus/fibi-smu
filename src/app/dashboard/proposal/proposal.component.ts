import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from '../dashboard.service';
import { CommonService } from '../../common/services/common.service';

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

  constructor( private _router: Router,
    private _dashboardService: DashboardService,
    private _commonService: CommonService) { }

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
  }

  /** navigate to proposal create page if the logged in user has permission*/
  gotoProposal() {
    if (localStorage.getItem('createProposal') === 'true') {
        this._router.navigate(['fibi/proposal/proposalHome']);
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
    this._router.navigate(['fibi/proposal/proposalHome'], { queryParams: { 'proposalId': proposalId } });
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
            const DOWNLOAD_BTN = document.createElement('a');
            DOWNLOAD_BTN.href = URL.createObjectURL(data.body);
            DOWNLOAD_BTN.download = fileName.toLowerCase() + '.' + exportDataReqObject.exportType;
            document.body.appendChild(DOWNLOAD_BTN);
            DOWNLOAD_BTN.click();
        });
  }

  /** copy and open proposal
   * @param proposalId
   */
  copyProposal(proposalId) {
    const proposalVO = {
        proposal: null,
        proposalId: proposalId,
        userFullName: localStorage.getItem('currentUser')
    };
    this._dashboardService.copyProposal(proposalVO).subscribe((success: any) => {
        this._router.navigate(['fibi/proposal/proposalHome'], { queryParams: { 'proposalId': success.proposal.proposalId } });
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
            this._dashboardService.downloadRoutelogAttachment( ATTACHMENT.attachmentId )
            .subscribe(
                data => {
                    const a = document.createElement( 'a' );
                    a.href = URL.createObjectURL( data );
                    a.download = ATTACHMENT.fileName;
                    document.body.appendChild(a);
                    a.click();
                } );
        }
    }
  }

}
