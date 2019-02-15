import { Component, OnInit } from '@angular/core';
import { AwardReportsAndTermsService } from '../award-reports-and-tabs/award-reports-and-terms.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Subscription } from "rxjs/Subscription";

@Component( {
    selector: 'award-reports-and-terms',
    templateUrl: 'award-reports-and-terms.component.html',
    // styleUrls: ['../../../assets/css/bootstrap.min.css', '../../../assets/css/font-awesome.min.css', '../../../assets/css/style.css', '../../../assets/css/search.css']
} )

export class AwardReportsAndTerms {
    showReports: boolean = true;
    showPaymentAndInvoice: boolean = true;
    showApprovedSpecialItems: boolean = true;
    showTerms: boolean = true;
    noReports: boolean = false;
    noPayment: boolean = false;
    noApprovedEquipment: boolean = false;
    noApprovedTravel: boolean = false;
    noTerms: boolean = false;
    result: any = {};
    awardReportKeyList: any = [];
    awardTermsKeyList: any[] = [];
public getReportadTermsSubscription : Subscription;

    constructor( private awardreportsandtermsService: AwardReportsAndTermsService ) { }

    ngOnInit() {
        this.getReportadTermsSubscription =this.awardreportsandtermsService.getAwardReportsAndTerms().subscribe(
            data => {
                this.result = data;
                if ( this.result.awardPaymntSchedule !== undefined && this.result.awardTerms !== undefined && this.result.awardPaymntInvoice !== undefined && this.result.approvedTravel !== undefined ) {
                    this.awardReportKeyList = Object.keys( this.result.awardReport );
                    this.awardTermsKeyList = Object.keys( this.result.awardTerms );
                    if ( this.result.awardReport == null || this.result.awardReport.length == 0 ) {
                        this.noReports = true;
                    }
                    if ( this.result.awardApprovdEquipment == null || this.result.awardApprovdEquipment.length == 0 ) {
                        this.noApprovedEquipment = true;
                    }
                    if ( this.result.approvedTravel == null || this.result.approvedTravel.length == 0 ) {
                        this.noApprovedTravel = true;
                    }
                    if ( this.result.awardTerms == null || this.result.awardTerms.length == 0 ) {
                        this.noTerms = true;
                    }
                    if ( this.result.awardPaymntInvoice == null || this.result.awardPaymntInvoice.length == 0 ) {
                        this.noPayment = true;
                    }
                }
            } );
    }
    
    showReportingTab( event: any ) {
        event.preventDefault();
        this.showReports = !this.showReports;
    }

    showPaymentAndInvoiceTab( event: any ) {
        event.preventDefault();
        this.showPaymentAndInvoice = !this.showPaymentAndInvoice;
    }

    showApprovedSpecialItemsTab( event: any ) {
        event.preventDefault();
        this.showApprovedSpecialItems = !this.showApprovedSpecialItems;
    }

    showTermsTab( event: any ) {
        event.preventDefault();
        this.showTerms = !this.showTerms;
    }
    ngOnDestroy() {
        this.getReportadTermsSubscription.unsubscribe();
    }
}
