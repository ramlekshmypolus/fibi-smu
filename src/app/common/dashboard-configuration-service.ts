import {Injectable} from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class DashboardConfigurationService {
    expenditureVolumeStatus : boolean = ((localStorage.getItem('dashboardExpenditureVolumeWidget')== 'true') || (localStorage.getItem('dashboardExpenditureVolumeWidget')== null));
    researchSummaryStatus : boolean = ((localStorage.getItem('dashboardResearchSummaryWidget')== 'true') || (localStorage.getItem('dashboardResearchSummaryWidget')== null));
    awardedProposalBySponsorStatus : boolean = ((localStorage.getItem('dashboardawardedProposalBySponsorWidget')== 'true')||(localStorage.getItem('dashboardawardedProposalBySponsorWidget')== null));
    AwardBysponsorTypesStatus : boolean = ((localStorage.getItem('dashboardAwardBysponsorTypesWidget')== 'true') || (localStorage.getItem('dashboardAwardBysponsorTypesWidget')== null));
    proposalBySponsorTypesStatus : boolean = ((localStorage.getItem('dashboardproposalBySponsorTypesWidget')== 'true')||(localStorage.getItem('dashboardproposalBySponsorTypesWidget')== null));
    inProgressproposalBySponsorStatus : boolean = ((localStorage.getItem('dashboardinProgressproposalBySponsorWidget')== 'true')||(localStorage.getItem('dashboardinProgressproposalBySponsorWidget')== null));

    private dashboardExpenditureVolumeWidget = new BehaviorSubject<boolean>(this.expenditureVolumeStatus);
    currentdashboardExpenditureVolumeWidget = this.dashboardExpenditureVolumeWidget.asObservable();
    private dashboardResearchSummaryWidget = new BehaviorSubject<boolean>(this.researchSummaryStatus);
    currentdashboardResearchSummaryWidget = this.dashboardResearchSummaryWidget.asObservable();
    private dashboardawardedProposalBySponsorWidget = new BehaviorSubject<boolean>(this.awardedProposalBySponsorStatus);
    currentdashboardawardedProposalBySponsorWidget = this.dashboardawardedProposalBySponsorWidget.asObservable();
    private dashboardAwardBysponsorTypesWidget  = new BehaviorSubject<boolean>(this.AwardBysponsorTypesStatus);
    currentdashboardAwardBysponsorTypesWidget = this.dashboardAwardBysponsorTypesWidget.asObservable();
    private dashboardproposalBySponsorTypesWidget  = new BehaviorSubject<boolean>(this.proposalBySponsorTypesStatus);
    currentdashboardproposalBySponsorTypesWidget = this.dashboardproposalBySponsorTypesWidget.asObservable();
    private dashboardinProgressproposalBySponsorWidget  = new BehaviorSubject<boolean>(this.inProgressproposalBySponsorStatus);
    currentdashboardinProgressproposalBySponsorWidget = this.dashboardinProgressproposalBySponsorWidget.asObservable();
    private messageSource = new BehaviorSubject<string>("default message");
    currentMessage = this.messageSource.asObservable();
    
	constructor() {
		
	}
	
	changeMessage(message: string) {
	    this.messageSource.next(message)
	}
	
	changeDashboardExpenditureVolumeWidget(status:boolean){
	    this.dashboardExpenditureVolumeWidget.next(status);
	}
	
	changeDashboardResearchSummaryWidgett(status:boolean){
        this.dashboardResearchSummaryWidget.next(status);
    }
	
	changeDashboardawardedProposalBySponsorWidget(status:boolean){
        this.dashboardawardedProposalBySponsorWidget.next(status);
    }
	
    changeDashboardAwardBysponsorTypesWidget(status:boolean){
        this.dashboardAwardBysponsorTypesWidget.next(status);
    }
    
    changeDashboardproposalBySponsorTypesWidget(status:boolean){
        this.dashboardproposalBySponsorTypesWidget.next(status);
    }
    
    changeDashboardinProgressproposalBySponsorWidget(status:boolean){
        this.dashboardinProgressproposalBySponsorWidget.next(status);
    }
}
