import { Component, OnInit, Input } from '@angular/core';
import { ProposalComponent } from '../../proposal.component';

@Component({
  selector: 'app-proposal-home-view',
  templateUrl: './proposal-home-view.component.html',
  styleUrls: ['./proposal-home-view.component.css']
})
export class ProposalHomeViewComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() proposalDataBindObj: any = {};
  @Input() warningMsgObj: any = {};

  isAbsDescReadMore = false;

  constructor( public _proposalComponent: ProposalComponent) { }

  ngOnInit() {}

}
