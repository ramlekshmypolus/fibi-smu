import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-proposal-budget',
  templateUrl: './proposal-budget.component.html',
  styleUrls: ['./proposal-budget.component.css']
})
export class ProposalBudgetComponent implements OnInit {

  @Input() result: any = {};
  @Input() showOrHideDataFlagsObj: any = {};

  constructor() { }

  ngOnInit() {}

}
