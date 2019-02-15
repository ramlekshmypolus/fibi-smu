import { Component, OnInit, ViewChildren, ViewChild, ElementRef, AfterViewInit, Renderer } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit, AfterViewInit {

  constructor( private loginService: LoginService, private router: Router, private renderer: Renderer ) { }
  credentials = {
    username: '',
    password: ''
};
loginFail = false;
result: any = {};

@ViewChildren('logoutInput') usernameLogoutInput;
@ViewChild('logoutInput') logoutInput: ElementRef;

  ngOnInit() {
    localStorage.clear();
  }

  ngAfterViewInit() {
    this.usernameLogoutInput.first.nativeElement.focus();
  }

  login() {
    this.loginService.login( this.credentials.username, this.credentials.password ).subscribe(
        data => {
            this.result = data.body;
            if (this.result != null) {
                localStorage.setItem('authToken', data.headers.get('Authorization'));
                if ( this.result.login === true ) {
                    localStorage.setItem('currentUser', this.result.userName );
                    localStorage.setItem('personId', this.result.personID );
                    localStorage.setItem('userFullname', this.result.fullName );
                    localStorage.setItem('firstName', this.result.firstName );
                    localStorage.setItem('lastName', this.result.lastName );
                    localStorage.setItem('isAdmin', String( this.result.unitAdmin ) );
                    localStorage.setItem('unitNumber', String(this.result.unitNumber ) );
                    localStorage.setItem('provost', String( this.result.provost ) );
                    localStorage.setItem('reviewer', String( this.result.reviewer ) );
                    localStorage.setItem('grantManager', String(this.result.grantManager ) );
                    localStorage.setItem('createProposal', String(this.result.createProposal) );
                    localStorage.setItem('superUser', String(this.result.superUser) );
                    this.loginService.setLeadUnits(this.result.leadUnits);
                    if (localStorage.getItem('currentUrl') != null && localStorage.getItem('currentUrl').indexOf('loginpage') === -1) {
                        window.location.hash = localStorage.getItem('currentUrl');
                    } else {
                        this.router.navigate( ['fibi/dashboard'] );
                    }
                } else {
                    this.loginFail = true;
                    this.credentials.username = '';
                    this.credentials.password = '';
                    this.renderer.invokeElementMethod( this.logoutInput.nativeElement, 'focus' );
                }
            }
        },
        error => {
            console.log( error );
        }
    );
}
}

