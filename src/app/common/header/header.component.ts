import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { DashboardService } from '../../dashboard/dashboard.service';
import { ResearchSummaryConfigService } from '../services/research-summary-config.service';
import { CommonService } from '../../common/services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    isAdmin = false;
    showConfiguringOption = false;
    isShowMore= false;
    isNotificationBox = false;
    expenditureVolumWidget = true;
    researchSummaryWidget = true;
    awardedProposalBySponsorWidget = true;
    awardBysponsorTypesWidget = true;
    proposalBySponsorTypesWidget = true;
    inProgressproposalBySponsorWidget = true;
    showMenu = true;
    $isExpenditureVolume;
    $isResearchSummary;
    $isAwardedProposal;
    $isAwardBysponsor;
    $isProposalBySponsor;
    $inProgressproposal;

    notificationList: any[];
    first3notificationList: any[] = [];
    result: any = [];

    docId: string;
    personId: string;
    fullName: string;
    userName: string;
    adminStatus: string;
    logo: string;
    currentUser: string;
    message: string;
    role: string;
    provost: string;
    grantManager: string;
    reviewer: string;

    @ViewChild( 'notificationBar' ) notificationBar: ElementRef;
    @ViewChild( 'configurationBar' ) configurationBar: ElementRef;

    constructor(
        private dashboardService: DashboardService,
        private _router: Router,
        private _researchSummaryConfigService: ResearchSummaryConfigService,
        private _commonService: CommonService
        ) {
        document.addEventListener( 'mouseup', this.offClickHandler.bind( this ) );
        document.addEventListener( 'mouseup', this.offClickHandlerDashboardConf.bind( this ) );
        // this.logo = './assets/images/kki_logo.png';
        // this.logo = './assets/images/logo-smu.jpg';
        this.logo = './assets/images/logo.png';
    }

    offClickHandler( event: any ) {
        if ( !this.notificationBar.nativeElement.contains( event.target ) ) {
            this.isNotificationBox = false;
        }
    }

    offClickHandlerDashboardConf( event: any ) {
        if ( !this.configurationBar.nativeElement.contains( event.target ) ) {
            this.showConfiguringOption = false;
        }
    }

    ngOnInit(): void {
        this.adminStatus = localStorage.getItem( 'isAdmin' );
        this.userName = localStorage.getItem( 'currentUser' );
        this.fullName = localStorage.getItem( 'userFullname' );
        /** subscription for chart widget status */
        this.$isExpenditureVolume = this._researchSummaryConfigService.expenditureVolume;
        this.$isResearchSummary   = this._researchSummaryConfigService.researchSummary;
        this.$isAwardedProposal   = this._researchSummaryConfigService.awardedProposal;
        this.$isAwardBysponsor    = this._researchSummaryConfigService.awardBysponsor;
        this.$isProposalBySponsor = this._researchSummaryConfigService.proposalBySponsor;
        this.$inProgressproposal  = this._researchSummaryConfigService.inProgressproposal;
        /*this.grantManager = localStorage.getItem( 'grantManager' );
        this.provost = localStorage.getItem( 'provost' );
        this.reviewer = localStorage.getItem( 'reviewer' );*/
        /* if ( this.grantManager == 'true' ) {
            this.role = "Grant Manager";
        } else if ( this.provost == 'true' ) {
            this.role = "Provost";
        } else if ( this.reviewer == 'true' ) {
            this.role = "Reviewer";
        } else*/
        if ( this.adminStatus === 'true' ) {
            this.role = 'Admin';
        } else {
            this.role = 'PI';
        }
        if ( this.adminStatus === 'true' ) {
            this.isAdmin = true;
        }
    }

    getUserNotification() {
        this.isNotificationBox = !this.isNotificationBox;
        this.isShowMore = false;
        if ( this.isNotificationBox === true && !this.result.length ) {
            this.dashboardService.getUserNotification({'personId': localStorage.getItem('personId')})
                .subscribe(data => {
                    this.result = data;
                    this.notificationList = this.result.slice(0, 3);
                });
        } else {
            this.notificationList = this.result.slice(0, 3);
        }
    }

    showMore( event: any ) {
        event.preventDefault();
        this.isShowMore = true;
        this.notificationList = this.result;
    }

    myDashboard( event: any ) {
        event.preventDefault();
        this._router.navigate( ['fibi/dashboard'] );
    }
    setWidgetStatus(widget, value) {
        localStorage.setItem( widget, String( value ) );
    }

    configureDashboard( event: any ) {
        event.preventDefault();
        this.showConfiguringOption = !this.showConfiguringOption;
    }

    expandMenu( e: any) {
        e.preventDefault();
        this.showMenu = false;
        const ELEMENT = <HTMLInputElement>document.getElementById('myMenu');
        ELEMENT.classList.remove('slideMenu-expand');
        ELEMENT.classList.add('slideMenu-hide');
      }

    hideMenu( e: any) {
        e.preventDefault();
        const ELEMENT = <HTMLInputElement>document.getElementById('myMenu');
        ELEMENT.classList.remove('slideMenu-hide');
        ELEMENT.classList.add('slideMenu-expand');
        this.showMenu = true;
    }

    logout() {
        this._commonService.logout();
        this._router.navigate(['/login']);
    }
}
