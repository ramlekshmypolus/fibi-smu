import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-proposal-overview',
  templateUrl: './proposal-overview.component.html',
  styleUrls: ['./proposal-overview.component.css']
})
export class ProposalOverviewComponent implements OnInit {

  @Input() result: any = {};

  isOverviewWidgetOpen = true;

  constructor() { }

  ngOnInit() {}

}
