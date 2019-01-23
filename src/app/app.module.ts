import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { FooterComponent } from './common/footer/footer.component';
import { HeaderComponent } from './common/header/header.component';
import { SessionTimeoutComponent } from './common/session/session-timeout.component';

import { LoginService } from './login/login.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardConfigurationService } from './common/dashboard-configuration-service';
import { CommonService } from './common/services/common.service';
import { ResearchSummaryConfigService } from './common/services/research-summary-config.service';

import { AuthGuard } from './common/services/auth-guard.service';
import { AppHttpInterceptor } from './common/services/http-interceptor';
import { AppRouterComponent } from './common/app-router/app-router.component';

@NgModule( {
    declarations: [
        AppRouterComponent,
        HeaderComponent,
        FooterComponent,
        AppComponent,
        LoginComponent,
        SessionTimeoutComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        NgIdleKeepaliveModule,
        NgbModule,
        BrowserAnimationsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AppHttpInterceptor,
            multi: true
        },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        LoginService,
        AuthGuard,
        CommonService,
        DashboardService,
        DashboardConfigurationService,
        ResearchSummaryConfigService
    ],
    bootstrap: [AppComponent]
} )

export class AppModule { }
