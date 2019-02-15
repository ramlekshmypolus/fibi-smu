import { Component, OnInit, OnDestroy } from '@angular/core';
import { AwardSummaryService } from './award-home/award-summary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AwardHierarchyService } from '../award/award-hierarchy/award-hierarchy.service';
import { AwardconfigurationService } from '../award/awardconfiguration.service';
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../common/services/common.service';

@Component( {
    templateUrl: 'award.component.html'
} )

export class AwardComponent implements OnInit, OnDestroy {
    currentTab = 'award_home';
    public awardId: string;
    public awardNumber: string;
    public sponsorName: string;
    public leadUnitName: string;
    public accountNumber: string;
    public awardStatus: string;
    public lastUpdate: string;
    public obligationEndDate: any;
    result: any = {};
    userName: string;
    documentNumber: string;
    public currentValueSub: Subscription;
    public loadAwardSub: Subscription;
    public is_awd_budget = 'F';
    public latest_version_number: string;
    currentUser: string;
    fullName: string;
    isGrantManager: string;
    createOSTRequest = false;
    select = '--Select--';
    serviceRequest: any = {};
    projectVariationRequest_categoryMap: any = [];
    projectVariationRequest_typeMap: any = [];
    projectVariationRequest_templateList: any = [];
    projectVariationRequest_departmentList: any = [];
    projectVariationRequest_userList: any = [];
    moduleCode: number;
    moduleItemKey: string;
    isDateValidationMsg = false;
    dateValidationMsg = '* Select Award Extension Date after the obligation End Date';
    pvr_errorString = '';
    isPVRsave = false;
    successMsg = '';
    pvr_result: any = {};
    serviceRequestId: string;

    private ngxEditorConfig: {} = {
            'editable' : true,
            'spellcheck': true,
            'height' : 'auto',
            'minHeight': '0',
            'width': 'auto',
            'minWidth': '0',
            'translate': 'yes',
            'enableToolbar': false,
            'showToolbar': false,
            'placeholder': 'Enter text here...',
            'imageEndPoint': '',
            'toolbar': [
                ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript']
            ]
        };

    constructor( public router: Router, public awardSummaryService: AwardSummaryService, public route: ActivatedRoute,
        public awardHierarchyService: AwardHierarchyService, public awardconfigurationService: AwardconfigurationService,
        public _commonService: CommonService ) {
        this.currentUser = localStorage.getItem('currentUser');
    }

    ngOnInit() {
        this.currentValueSub = this.awardHierarchyService.currentvalue.subscribe( data => {
            this.currentTab = data;
        } );
        this.awardId = this.route.snapshot.queryParams['awardId'];
        this.loadAwardSub = this.awardSummaryService.loadAwardSummary( this.awardId ).subscribe( data => {
            this.result = data || [];
            if ( this.result.length !== 0 && this.result.awardDetails !== undefined && this.result.awardPersons !== undefined ) {
                this.awardconfigurationService.changeAwardData( this.result );
                this.userName = this.result.awardPersons[0].user_name;
                this.awardNumber = this.result.awardDetails[0].award_number;
                this.accountNumber = this.result.awardDetails[0].account_number;
                this.leadUnitName = this.result.awardDetails[0].lead_unit_name;
                this.awardStatus = this.result.awardDetails[0].award_status;
                this.sponsorName = this.result.awardDetails[0].sponsor_name;
                this.lastUpdate = this.result.awardDetails[0].last_update;
                this.obligationEndDate = this.result.awardDetails[0].obligation_end;
                this.documentNumber = this.result.awardDetails[0].document_number;
                this.is_awd_budget = this.result.awardDetails[0].is_awd_budget;
                this.latest_version_number = this.result.awardDetails[0].latest_version_number;
            }
        } );

        this.fullName = localStorage.getItem('userFullname');
        this.isGrantManager = localStorage.getItem('grantManager');
    }

    show_current_tab( e: any, current_tab ) {
        e.preventDefault();
        this.currentTab = current_tab;
    }

    ngOnDestroy() {
        this.currentValueSub.unsubscribe();
        this.loadAwardSub.unsubscribe();
    }

    backToList( e ) {
        e.preventDefault();
        this.router.navigate( ['/fibi/dashboard/awardList'], { queryParams: { 'currentTab': 'AWARD' } } );
    }

    /*Award Variation Request Creation*/
    createProjectVariationRequest() {
        this.awardconfigurationService.createProjectVariationRequest( this.serviceRequest ).subscribe(( data ) => {
            let temp: any = {};
            temp = data;
            this.projectVariationRequest_categoryMap = temp.categoryMap;
            this.projectVariationRequest_typeMap = temp.typeMap;
            this.projectVariationRequest_departmentList = temp.departmentList;
            this.serviceRequest = temp.serviceRequest;
            this.serviceRequest.arrivalDate = this.obligationEndDate;
        } );
        this.createOSTRequest = true;
    }

    /*fetching Template for Description in Create Award Variation Request*/
    getDescription( categoryCode, serviceTypeCode ) {

        this.awardconfigurationService.viewTemplate( categoryCode, serviceTypeCode ).subscribe(( data ) => {
            let temp: any = {};
            temp = data;
            this.projectVariationRequest_templateList = temp.templateList;
            this.serviceRequest.description = this.projectVariationRequest_templateList[0].TEMPLATE;
        } );
    }

    /*validating whether category is empty or not*/
    checkCategory( categoryCode, serviceTypeCode ) {
        if ( categoryCode == '' || categoryCode == null || categoryCode == undefined || categoryCode == 'null') {
            this.serviceRequest.serviceTypeCode = 'null';
        } else if ( serviceTypeCode !== '' && serviceTypeCode !== null && serviceTypeCode !== undefined && serviceTypeCode !== 'null') {
            this.getDescription( categoryCode, serviceTypeCode );
        }
    }

    _keyPress(event: any) {
        const pattern = /[0-9\+\-\/\ ]/;
        const inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
          event.preventDefault();
        }
    }

    /*validating whether extension date is lesser than Obligation-end date*/
    validateExtensionDate(arrivalDate) {
        let selectedDate = arrivalDate;
        let date = new Date(arrivalDate);
        let newArrivalDate = this.convertDate(date);

        let oDate = new Date(this.obligationEndDate);
        let newObligationEndDate = this.convertDate(oDate);

        if(newArrivalDate < newObligationEndDate) {
            this.isDateValidationMsg = true;
            //this.serviceRequest.arrivalDate = this.obligationEndDate;
        }
        else {
            this.isDateValidationMsg = false;
            if(newArrivalDate == newObligationEndDate) {
                this.serviceRequest.arrivalDate = this.obligationEndDate;
            } else {
                this.serviceRequest.arrivalDate = selectedDate;
            }
        }
    }

    /*converting Date Object to string for Comparison*/
    convertDate(str) {
        const mnth = ('0' + (str.getMonth() + 1)).slice(-2);
        const day  = ('0' + str.getDate()).slice(-2);
        return [ str.getFullYear(), mnth, day ].join('/');
    }

    /*fetch respective Grant Manager on selecting Department*/
    getContractAdmin( unitNumber ) {
        this.awardconfigurationService.getContractAdmin( unitNumber ).subscribe(( data ) => {
            let temp: any = {};
            temp = data;
            this.projectVariationRequest_userList = temp.userList;
            this.serviceRequest.contractAdminName = this.projectVariationRequest_userList[0].FULL_NAME;
            this.serviceRequest.contractAdminPersonId = this.projectVariationRequest_userList[0].PERSON_ID;
        } );
    }

    /*updating of Reporter name (by GrantManagers only)*/
    updateReporter(fullName) {
        this.serviceRequest.reporterName = fullName;
    }

    /*save new Award variation request*/
    saveProjectVariationRequest( serviceRequest ) {
        if (this.serviceRequest.serviceTypeCode == '31') {
            this.serviceRequest.arrivalDate = null;
        }
        this.pvr_errorString = '';
        if ( this.serviceRequest.summary == '' || this.serviceRequest.summary == null || this.serviceRequest.summary == undefined ) {
            this.pvr_errorString += 'Subject';
        }
        else if ( this.serviceRequest.ostCategoryCode == '' || this.serviceRequest.ostCategoryCode == null || this.serviceRequest.ostCategoryCode == undefined || this.serviceRequest.ostCategoryCode == 'null') {
            this.pvr_errorString += " Category";
        }
        else if ( this.serviceRequest.serviceTypeCode == '' || this.serviceRequest.serviceTypeCode == null || this.serviceRequest.serviceTypeCode == undefined || this.serviceRequest.serviceTypeCode == 'null') {
            this.pvr_errorString += " Type";
        }
        else if ( (this.serviceRequest.serviceTypeCode=='7') && (this.serviceRequest.arrivalDate == '' || this.serviceRequest.arrivalDate == null || this.serviceRequest.arrivalDate == undefined) ) {
            this.pvr_errorString += " Award Extension Date";
        }
        else if ( this.serviceRequest.unitNumber == '' || this.serviceRequest.unitNumber == null || this.serviceRequest.unitNumber == undefined || this.serviceRequest.unitNumber == 'null') {
            this.pvr_errorString += " Department";
        }
        else if ( this.serviceRequest.description == '' || this.serviceRequest.description == null || this.serviceRequest.description == undefined ) {
            this.pvr_errorString += " Description";
        }
        if ( this.pvr_errorString == '' ) {
            this.serviceRequest.reporterName = this.fullName;
            this.serviceRequest.priorityId = 3;
            this.moduleCode = 1;
            this.moduleItemKey = this.awardNumber;
            this.awardconfigurationService.submitOSTDetails( this.serviceRequest, this.moduleCode, this.moduleItemKey ).subscribe(( data ) => {
                var temp: any = {};
                if (data != null) {
                    temp = data;
                    this.successMsg = temp.successMsg;
                    this.pvr_result = temp;
                    this.serviceRequestId = this.pvr_result.serviceRequest.serviceList[0].SERVICE_REQUEST_ID;
                    this.serviceRequest.status = temp.serviceRequest.serviceList[0].SERVICE_STATUS;
                }
            } );
            this.isPVRsave = true;
        }
    }

    closePVRPopup() {
        this.createOSTRequest = false;
        this.serviceRequest = {};
        this.pvr_result = {};
        this.pvr_errorString = '';
        this.isPVRsave = false;
        this.isDateValidationMsg = false;
    }

    openOSTRequest() {
        window.location.href = this._commonService.outputPathOST + '/dashboard?username=' +
                               this.currentUser + '&isSMU=true#/createform;requestId=' + this.serviceRequestId;
    }

}
