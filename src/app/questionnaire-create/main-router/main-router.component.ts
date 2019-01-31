import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-router',
  template: '<router-outlet></router-outlet><ngx-spinner></ngx-spinner>',
  styleUrls: ['./main-router.component.css']
})
export class MainRouterComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
