import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { AuthGuard } from './common/services/auth-guard.service';
import { LoginComponent } from './login/login.component';
import { AppRouterComponent } from './common/app-router/app-router.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'fibi', component: AppRouterComponent,
    children: [
      { path: 'dashboard', loadChildren: 'app/dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthGuard] },
      { path: 'grant',  loadChildren: 'app/grant/grant.module#GrantModule',
        canActivate: [AuthGuard] }
    ]
  },

  { path: 'login', component: LoginComponent },
  // { path: 'award', loadChildren: 'app/award/award.module#AwardModule' },
  // { path: 'expandedview', component: ExpandedviewComponent, canActivate: [AuthGuard] },
  // { path: 'committee', loadChildren: 'app/committee/committee.module#CommitteeModule' },
  // { path: 'grant', loadChildren: 'app/grant/grant.module#GrantModule', canActivate: [AuthGuard] },
  // { path: 'proposal', loadChildren: 'app/proposal/proposal.module#ProposalModule', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
