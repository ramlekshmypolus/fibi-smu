import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { ExpandedViewService } from './expanded-view.service';

@Component({
  selector: 'app-expanded-view',
  templateUrl: './expanded-view.component.html',
  styleUrls: ['./expanded-view.component.css']
})
export class ExpandedViewComponent implements OnInit {
  researchSummaryReqObj: any = {};
  exportDataReqObj: any = {};
  serviceRequestResult: any = {};
  researchSummaryIndex = null;
  pieChartIndex = null;
  donutChartIndex = null;
  departmentUnitNumber = null;
  exportIndex = '';
  exportDataHeading = '';


  constructor( private _route: ActivatedRoute, private _expandedViewService: ExpandedViewService) { }

  ngOnInit() {
    this.researchSummaryIndex = this._route.snapshot.queryParamMap.get('summaryIndex');
    this.pieChartIndex = this._route.snapshot.queryParamMap.get('pieChartIndex');
    this.donutChartIndex = this._route.snapshot.queryParamMap.get('donutChartIndex');

    if (this.researchSummaryIndex !== null) {
      this.exportIndex = this.researchSummaryIndex;
      this.exportDataHeading = this._route.snapshot.queryParamMap.get('summaryHeading');
      this.researchSummaryReqObj.personId = localStorage.getItem( 'personId' );
      this.researchSummaryReqObj.researchSummaryIndex = this.researchSummaryIndex;
      this.researchSummaryReqObj.unitNumber = this.departmentUnitNumber;
      this.researchSummaryReqObj.isAdmin = localStorage.getItem( 'isAdmin' );

      this._expandedViewService.loadDetailedResearchSummary( this.researchSummaryReqObj ).subscribe(
        data => {
            this.serviceRequestResult = data || [];
        });
    }

    if (this.pieChartIndex != null) {
      this.exportIndex = this.pieChartIndex;
      if (this.pieChartIndex === 'AWARD') {
        this.exportDataHeading = this._route.snapshot.queryParamMap.get('expandedViewAwardHeading');
      } else if (this.pieChartIndex === 'PROPOSAL') {
        this.exportDataHeading = this._route.snapshot.queryParamMap.get('proposalHeading');
      }
      this.researchSummaryReqObj.personId = localStorage.getItem( 'personId' );
      this.researchSummaryReqObj.isAdmin = localStorage.getItem( 'isAdmin' );
      this.researchSummaryReqObj.unitNumber = this.departmentUnitNumber;
      this.researchSummaryReqObj.pieChartIndex = this.pieChartIndex;
      this.researchSummaryReqObj.sponsorCode = this._route.snapshot.queryParamMap.get('sponsorCode');

      this._expandedViewService.loadPieChartDataByType( this.researchSummaryReqObj ).subscribe(
        data => {
          this.serviceRequestResult = data || [];
        });
    }

    if (this.donutChartIndex != null) {
      this.exportIndex = this.donutChartIndex;
      if (this.donutChartIndex === 'AWARDED') {
        this.exportDataHeading = this._route.snapshot.queryParamMap.get('donutAwardHeading');
      } else if (this.donutChartIndex === 'INPROGRESS') {
        this.exportDataHeading = this._route.snapshot.queryParamMap.get('donutProposalHeading');
      }
      this.researchSummaryReqObj.personId = localStorage.getItem( 'personId' );
      this.researchSummaryReqObj.isAdmin = localStorage.getItem( 'isAdmin' );
      this.researchSummaryReqObj.unitNumber = this.departmentUnitNumber;
      this.researchSummaryReqObj.donutChartIndex = this.donutChartIndex;
      this.researchSummaryReqObj.sponsorCode = this._route.snapshot.queryParamMap.get('sponsorCode');

      this._expandedViewService.loadDonutChartDataByType( this.researchSummaryReqObj ).subscribe(
        data => {
          this.serviceRequestResult = data || [];
      });
    }
  }

  exportAsTypeDoc(docType) {
    this.exportDataReqObj.personId = localStorage.getItem( 'personId' );
    this.exportDataReqObj.sponsorCode = this._route.snapshot.queryParamMap.get('sponsorCode');
    this.exportDataReqObj.researchSummaryIndex = this.exportIndex;
    this.exportDataReqObj.documentHeading = this.exportDataHeading;
    this.exportDataReqObj.exportType = docType === 'excel' ? 'xlsx' : docType === 'pdf' ? 'pdf' : '';
    this.exportDataReqObj.isAdmin = localStorage.getItem( 'isAdmin' );
    this.exportDataReqObj.unitNumber = this.departmentUnitNumber;
    this._expandedViewService.exportResearchSummaryData(this.exportDataReqObj).subscribe(
         data => {
            const temp: any = data || {};
            const exportDataElement = document.createElement( 'a' );
            exportDataElement.href = URL.createObjectURL( temp.body );
            exportDataElement.download = this.exportDataHeading + '.' + this.exportDataReqObj.exportType;
            document.body.appendChild(exportDataElement);
            exportDataElement.click();
         } );
    }


}
