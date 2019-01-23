import { Component, OnInit, Input } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-research-summary-count',
  templateUrl: './research-summary-count.component.html'
})
export class ResearchSummaryCountComponent implements OnInit {

  @Input() summaryViewsData;
  departmentUnitNumber = null;

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  getDetailedResearchSummary(summaryView) {
    if (summaryView === 'Submitted Proposals') {
        this._router.navigate(['fibi/dashboard/expandedView'],
                              { queryParams: { 'summaryIndex': 'PROPOSALSSUBMITTED',
                                               'summaryHeading': summaryView,
                                               'departUnitNumber': this.departmentUnitNumber } });
    }
    if (summaryView === 'In Progress Proposals') {
        this._router.navigate(['fibi/dashboard/expandedView'],
                              { queryParams: { 'summaryIndex': 'PROPOSALSINPROGRESS',
                                               'summaryHeading': summaryView,
                                               'departUnitNumber': this.departmentUnitNumber } });
    }
    if (summaryView === 'Active Awards') {
        this._router.navigate(['fibi/dashboard/expandedView'],
                              { queryParams: { 'summaryIndex': 'AWARDSACTIVE',
                                               'summaryHeading': summaryView,
                                               'departUnitNumber': this.departmentUnitNumber } });
    }
  }

}
