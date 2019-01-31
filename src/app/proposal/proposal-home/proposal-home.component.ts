import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-proposal-home',
  templateUrl: './proposal-home.component.html',
  styleUrls: ['./proposal-home.component.css']
})
export class ProposalHomeComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};
  @Input() warningMsgObj: any = {};
  @Input() proposalDataBindObj: any = {};

  constructor() { }

  ngOnInit() {}

}
