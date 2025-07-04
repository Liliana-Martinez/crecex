import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { InteractiveScreenComponent } from './shared/componentes/interactive-screen/interactive-screen.component';

import { ClientsGuarantorsComponent } from './features/clients-guarantors/clients-guarantors.component';
import { ConsultComponent } from './features/clients-guarantors/pages/consult/consult.component';
import { ModifyComponent } from './features/clients-guarantors/pages/modify/modify.component';
import { AddComponent } from './features/clients-guarantors/pages/add/add.component';

import { CreditsComponent } from './features/credits/credits.component';
import { NewComponent } from './features/credits/pagess/new/new.component';
import { RenewComponent } from './features/credits/pagess/renew/renew.component';
import { AdditionalComponent } from './features/credits/pagess/additional/additional.component';

import { PaymentsComponent } from './features/payments/payments.component';
import { CollectorsComponent } from './features/collectors/collectors.component';
import { CreditBureauComponent } from './features/credit-bureau/credit-bureau.component';
import { CommissionsComponent } from './features/commissions/commissions.component';

import { StatisticsComponent } from './features/statistics/statistics.component';
import { CashComponent } from './features/statistics/pages/cash/cash.component';
import { TotalCreditsComponent } from './features/statistics/pages/total-credits/total-credits.component';
import { TotalPaymentsComponent } from './features/statistics/pages/total-payments/total-payments.component';
import { SingInComponent } from './auth/sing-in/sing-in.component';
import { NoAutorizadoComponent } from './shared/componentes/no-autorizado/no-autorizado.component';
import { roleGuard } from './auth/role.guard';
import { roleChildGuard } from './auth/role-child.guard';
import { RedirectByRoleComponent } from './auth/redirect-by-role';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent }, // Muestra el login al iniciar
    { path: 'sing-in', component: SingInComponent},
    { path: 'app', component: InteractiveScreenComponent, // Estructura con header y menú
    children: [
      { 
        path: 'home', 
        component: HomeComponent,
        canActivate: [roleGuard],
        data: {expectedRoles: ['usuario1', 'usuario2', 'usuario3', 'administrador']} 
      }, // Aquí se cargará dentro del <router-outlet>
      { 
        path: 'clients-guarantors', 
        component: ClientsGuarantorsComponent,
        canActivateChild: [roleChildGuard],
        children: [
          //{ path: '', redirectTo: 'add', pathMatch: 'full' },
          { 
            path: '', 
            pathMatch: 'full', 
            component: RedirectByRoleComponent,
            data: { expectedRoles: ['usuario1', 'usuario2', 'usuario3', 'administrador'] }
          },
          { 
            path: 'add', 
            component: AddComponent,
            data: { expectedRoles: ['usuario3', 'administrador']} 
          },
          { 
            path: 'consult', 
            component: ConsultComponent,  
            data: { expectedRoles: ['usuario1', 'usuario2', 'usuario3', 'administrador']} 
          },
          { 
            path: 'modify', 
            component: ModifyComponent, 
            data: { expectedRoles: ['administrador']} 
          },
        ]
      },
      { 
        path: 'credits', 
        component: CreditsComponent,
        canActivateChild: [roleChildGuard],
        children: [
          { path: '', redirectTo: 'new', pathMatch: 'full' },
          { 
            path: 'new', 
            component: NewComponent, 
            data: { expectedRoles: ['administrador']}
          },
          { 
            path: 'renew', 
            component: RenewComponent,
            data: { expectedRoles: ['administrador']} 
          },
          { 
            path: 'additional', 
            component: AdditionalComponent,
            data: { expectedRoles: ['administrador']} 
          },
        ]
      },
      { 
        path: 'payments', 
        component: PaymentsComponent,
        canActivate: [roleGuard], 
        data: { expectedRoles: ['usuario2', 'usuario3', 'administrador']}
      }, 
      { 
        path: 'collectors', 
        component: CollectorsComponent,
        canActivate: [roleGuard], 
        data: { expectedRoles: ['usuario1', 'usuario2', 'usuario3', 'administrador']}
      },
      { 
        path: 'commissions', 
        component: CommissionsComponent,
        canActivate: [roleGuard], 
        data: { expectedRoles: ['administrador']}
      },
      { 
        path: 'statistics', 
        component: StatisticsComponent,
        canActivateChild: [roleChildGuard],
        children:[
          { path:'', redirectTo: 'cash', pathMatch: 'full' },
          { 
            path:'cash', 
            component: CashComponent, 
            data: { expectedRoles: ['administrador']}
          },
          { 
            path:'total-credits', 
            component: TotalCreditsComponent,
            data: { expectedRoles: ['administrador']}
          },
          { 
            path:'total-payments', 
            component: TotalPaymentsComponent, 
            data: { expectedRoles: ['administrador']} 
          },
        ]
      },
      { 
        path: 'credit-bureau', 
        component: CreditBureauComponent,
        canActivate: [roleGuard], 
        data: { expectedRoles: ['usuario1', 'usuario2', 'usuario3', 'administrador']}
      },
    ]
  },
  {
    path: 'no-autorizado',
    component: NoAutorizadoComponent
  }

    /*{ path: '', component: LoginComponent},
    { path: 'Home', component: InteractiveScreenComponent},
    { path: 'home', component: HomeComponent},
    { path: 'features',
        loadChildren: () => import('./features/features.routes').then(m =>m.FEATURES_ROUTES)
    }*/
];

