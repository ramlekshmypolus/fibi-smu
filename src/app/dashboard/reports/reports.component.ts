import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompleterService } from 'ng2-completer';

import { DashboardService } from '../dashboard.service';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  userName: string;

  reportObject: any = {};
  pieChartReportObject: any = {};
  reportData: any = {};
  dataList: any = [];
  openGrantList: any = [];
  awardNumberList: any = [];

  constructor( private _dashboardService: DashboardService,
    private _router: Router,
    private _completerService: CompleterService,
    private _commonService: CommonService ) { }

  ngOnInit() {
    this.userName = localStorage.getItem('currentUser');
    this.reportObject.selectedReportName = '--Select--';
    this._dashboardService.fetchAllReportData().subscribe(data => {
      this.reportData = data || [];
        if (this.reportData != null) {
            this.openGrantList = this._completerService.local(this.reportData.grantIds, 'grantCallId', 'grantCallId');
            this.awardNumberList = this._completerService.local(this.reportData.awardNumbers, 'awardNumber', 'awardNumber');
        }
    });
  }

  /** show only the report of pie-chart and hide other report
   * @param chartReportObj
   */
  changePiechartReport(chartReportObj) {
    this.reportObject = {};
    this.reportObject.selectedReportName = '--Select--';
    this.pieChartReportObject.reportType = chartReportObj.reportType;
    this.pieChartReportObject.chartType = chartReportObj.chartType;
  }

/** fetches report based on given report type id input
 * @param selectedReportItemId
 * @param selectedReportName
 */
  reportTypeIdChange(selectedReportItemId, selectedReportName) {
    let applicationReportReqObject = {};
    if ( selectedReportName === 'Expenditure by Award' ) {
      applicationReportReqObject = {
          awardNumber: selectedReportItemId,
          reportName: selectedReportName,
          personId: localStorage.getItem('personId')
      };
    } else {
      applicationReportReqObject = {
            grantCallId: selectedReportItemId,
            reportName: selectedReportName,
            personId: localStorage.getItem('personId')
        };
    }
    this._dashboardService.fetchApplicationReport(applicationReportReqObject)
        .subscribe(data => {
          this.reportObject = data;
          this.reportObject.selectedReportItemId = selectedReportItemId;
          this.reportObject.selectedReportName = selectedReportName;
      });
  }

  /** sets report type and preload the list for report type ids
   * @param selectedReportName
   */
  reportTypeChange(selectedReportName) {
    this.pieChartReportObject = {};
    this.reportObject = {};
    this.reportObject.selectedReportName = selectedReportName;
    this.dataList = (this.reportObject.selectedReportName !== 'Expenditure by Award') ? this.openGrantList : this.awardNumberList;
  }

  /** view proposal
   * @param event
   * @param proposalId
   */
  viewProposalById(event: any, proposalId) {
    event.preventDefault();
    this._router.navigate(['fibi/proposal/proposalHome'], { queryParams: { 'proposalId': proposalId } });
  }

}
