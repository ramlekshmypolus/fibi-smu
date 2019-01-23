import { Component, AfterViewInit, ViewChild, ViewChildren, Renderer, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './login.service';

@Component( {
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: [],
    outputs: ['fullName']
} )

export class LoginComponent implements AfterViewInit, OnInit{
    credentials = {
        username: '',
        password: ''
    };
    loginFail = false;
    result: any = {};

    @ViewChildren('input') usernameInput;
    @ViewChild('input') input: ElementRef;

    constructor( private loginService: LoginService, private router: Router,
                private renderer: Renderer) {
    }

    ngOnInit() {
        if (localStorage.getItem('authToken')) {
            if (localStorage.getItem('currentUrl') != null) {
                window.location.hash = localStorage.getItem('currentUrl');
            }
            this.router.navigate( ['fibi/dashboard'] );
          }
    }

    ngAfterViewInit() {
        this.usernameInput.first.nativeElement.focus();
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
                        this.renderer.invokeElementMethod( this.input.nativeElement, 'focus' );
                    }
                }
            },
            error => {
                console.log( error );
            }
        );
    }
}
