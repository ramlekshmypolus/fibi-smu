import { Component, OnInit, Input } from '@angular/core';

import { ProposalHomeComponent } from '../proposal-home.component';

@Component({
  selector: 'app-proposal-view',
  templateUrl: './proposal-view.component.html',
  styleUrls: ['./proposal-view.component.css']
})
export class ProposalViewComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() proposalDataBindObj: any = {};

  isAbsDescReadMore = false;

  constructor( private _proposalComponent: ProposalHomeComponent) { }

  ngOnInit() {}

}
