import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { AuthGuard } from './common/services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { AppRouterComponent } from './common/app-router/app-router.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'fibi', component: AppRouterComponent,
    children: [
      { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard] },
      { path: 'grant',  loadChildren: 'app/grant/grant.module#GrantModule',
        canActivate: [AuthGuard] },
      { path: 'proposal', loadChildren: 'app/proposal/proposal.module#ProposalModule',
        canActivate: [AuthGuard]},
      { path: 'questionnaire', loadChildren: 'app/questionnaire-create/create.module#CreateModule',
        canActivate: [AuthGuard]},
      { path: 'codetable', loadChildren: 'app/codetable/codetable.module#CodetableModule',
        canActivate: [AuthGuard]},
      { path: 'changePassword', component: ChangePasswordComponent,
      canActivate: [AuthGuard]},
      { path: 'unitHierarchy', loadChildren: 'app/unit-hierarchy/unit-hierarchy.module#UnitHierarchyModule',
      canActivate: [AuthGuard]},
      { path: 'award', loadChildren: 'app/award/award.module#AwardModule',
        canActivate: [AuthGuard]},
    ]
  },

  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
