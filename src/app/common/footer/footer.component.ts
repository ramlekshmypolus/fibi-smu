import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  footerLogo: string;
  polusWebsite = 'http://polussolutions.com/';

  constructor() {
      this.footerLogo = './assets/images/footerLogo.png';
  }

  ngOnInit() {
  }
}
