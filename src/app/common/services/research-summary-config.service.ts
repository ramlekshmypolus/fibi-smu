import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ResearchSummaryConfigService {

      constructor() { }

      expenditureVolume = new BehaviorSubject<boolean>(
            (localStorage.getItem('expenditureVolumWidget') === 'true') ||
            (localStorage.getItem('expenditureVolumWidget') == null));
      researchSummary = new BehaviorSubject<boolean>(
            (localStorage.getItem('researchSummaryWidget') === 'true') ||
            (localStorage.getItem('researchSummaryWidget') == null));
      awardedProposal = new BehaviorSubject<boolean>(
            (localStorage.getItem('awardedProposalBySponsorWidget') === 'true') ||
            (localStorage.getItem('awardedProposalBySponsorWidget') == null));
      awardBysponsor = new BehaviorSubject<boolean>(
            (localStorage.getItem('awardBysponsorTypesWidget') === 'true') ||
            (localStorage.getItem('awardBysponsorTypesWidget') == null));
      proposalBySponsor = new BehaviorSubject<boolean>(
            (localStorage.getItem('proposalBySponsorTypesWidget') === 'true') ||
            (localStorage.getItem('proposalBySponsorTypesWidget') == null));
      inProgressproposal = new BehaviorSubject<boolean>(
            (localStorage.getItem('inProgressproposalBySponsorWidget') === 'true') ||
            (localStorage.getItem('inProgressproposalBySponsorWidget') == null));

      unitAdministrators = new Subject();
      slectetedUnit      = new Subject();
}
