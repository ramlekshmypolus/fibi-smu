import { Component, OnInit } from '@angular/core';
import { ResearchSummaryConfigService} from '../common/services/research-summary-config.service';

@Component({
    templateUrl: 'dashboard.component.html',
    providers: []
})

export class DashboardComponent implements OnInit {

    unitAdministrators: any = [];
    unitselected = null;
    isAdmin  =  (localStorage.getItem('isAdmin') === 'true');
    constructor(private _researchSummaryConfigService: ResearchSummaryConfigService) {}

    ngOnInit() {
       this._researchSummaryConfigService.unitAdministrators.subscribe(
           data => {
               this.unitAdministrators = data || [];
           });
    }
    upadateUnitChange() {
        if (this.unitselected === 'null') {
            this._researchSummaryConfigService.slectetedUnit.next(null);
        } else {
            this._researchSummaryConfigService.slectetedUnit.next(this.unitselected);
        }

    }

}

/* for table scroll in route-log */
(function ($) {
    $.fn.hasScrollBar = function () {
        return this.get(0).scrollHeight > this.height();
    };
});
(function ($) {
    if ($('#routelog-table').hasScrollBar()) {
        $('.tableSection thead').toggleClass('extrawidth');
    }
});
