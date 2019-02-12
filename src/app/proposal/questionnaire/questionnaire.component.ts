import { Component, OnInit, Input } from '@angular/core';

import { QuestionnaireService } from './questionnaire.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};

  isOverviewWdgtOpen = true;
  isHumanSubjectQuestionnaire = false;
  isQuestionaireWdgtOpen = [];

  proposalObject: any = {};
  questionnaireData:  any = {};
  proposalId: string;
  proposalData: any;
  questionnaire: any = [];
  requestObject = {
    module_item_code : 3,
    module_sub_item_code: 0,
    module_item_key: '',
    module_sub_item_key: 0
  };
  proposalVO: any = {};

  constructor( private _questionnaireService: QuestionnaireService) { }

  ngOnInit() {
    this.isQuestionaireWdgtOpen[0] = true;
    this.loadInitialData(this.result.proposal);
  }

  /**sets mode based on status
   * @param proposalObject
   */
  loadInitialData( proposalObject ) {
    this.isHumanSubjectQuestionnaire = false;
    this.proposalData = proposalObject;
    if (proposalObject.proposalStatus !== undefined || proposalObject.proposalStatus != null) {
      if (proposalObject.proposalStatus.statusCode === 1 || proposalObject.proposalStatus.statusCode === 3) {
        if (proposalObject.isPreReviewer === true) {
            this.showOrHideDataFlagsObj.mode = (this.proposalVO.isProposalPerson === true || localStorage.getItem('currentUser') ===
            this.proposalVO.proposal.createUser || localStorage.getItem('isAdmin') === 'true') ? 'edit' : 'view';
        } else {
            this.showOrHideDataFlagsObj.mode = 'edit';
        }
      } else if (proposalObject.proposalStatus.statusCode === 9) {
          this.showOrHideDataFlagsObj.mode = 'edit';
      } else {
        this.showOrHideDataFlagsObj.mode = 'view';
      }
      for (const PROPOSAL_INDEX of proposalObject.propSpecialReviews) {
          if (PROPOSAL_INDEX.specialReviewTypeCode === '1' || PROPOSAL_INDEX.specialReviewTypeCode === '13' ||
              PROPOSAL_INDEX.specialReviewTypeCode === '15' ) {
                this.isHumanSubjectQuestionnaire = true;
          }
      }
      this.loadApplicableQuestionnaire();
    }
  }

  /**loads number of questionnaires
   */
  loadApplicableQuestionnaire() {
    this.requestObject.module_item_key = this.proposalId;
    this._questionnaireService.getApplicableQuestionnaire(this.requestObject).subscribe(data => {
        this.questionnaireData = data;
        this.questionnaire = this.questionnaireData.applicableQuestionnaire;
    });
  }

}
