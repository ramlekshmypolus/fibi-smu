import { Component, OnInit } from '@angular/core';

@Component( {
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`,
    providers: [],
} )

export class AppComponent implements OnInit {
    constructor() {}
    ngOnInit() {
        // if (!localStorage.getItem('authToken') && window.location.hash !== '' ) {
        //     localStorage.setItem('currentUrl', window.location.hash);
        // }
    }
}
