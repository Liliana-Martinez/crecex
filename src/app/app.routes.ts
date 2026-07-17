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
import { roleGuard } from './auth/role.guard';
import { roleChildGuard } from './auth/role-child.guard';
import { RedirectByRoleComponent } from './auth/redirect-by-role';
import { ZonesComponent } from './features/zones/zones.component';
import { AddZoneComponent } from './features/zones/pages/add-zone/add-zone.component';
import { ModifyZoneComponent } from './features/zones/pages/modify-zone/modify-zone.component';
import { AdministrationComponent} from './features/administration/administration.component';
import { ManageCreditsComponent } from './features/administration/pages/manage-credits/manage-credits.component';
import { ManagePaymentsComponent } from './features/administration/pages/manage-payments/manage-payments.component';

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
        data: {expectedRoles: ['promotoras', 'tienda', 'supervisora1', 'supervisora2', 'supervisora3', 'administracion1', 'administracion2', 'gerencia1', 'gerencia2']} 
      }, // Aquí se cargará dentro del <router-outlet>
      { 
        path: 'clients-guarantors', 
        component: ClientsGuarantorsComponent,
        canActivateChild: [roleChildGuard],
        children: [
          { 
            path: '', 
            pathMatch: 'full', 
            component: RedirectByRoleComponent,
            data: { expectedRoles: ['promotoras', 'tienda', 'supervisora1', 'supervisora2', 'supervisora3', 'administracion1', 'administracion2', 'gerencia1', 'gerencia2'] }
          },
          { 
            path: 'add', 
            component: AddComponent,
            data: { expectedRoles: ['administracion1', 'administracion2', 'gerencia1', 'gerencia2']} 
          },
          { 
            path: 'consult', 
            component: ConsultComponent,  
            data: { expectedRoles: ['promotoras', 'tienda', 'supervisora1', 'supervisora2', 'supervisora3', 'administracion1', 'administracion2', 'gerencia1', 'gerencia2']} 
          },
          { 
            path: 'modify', 
            component: ModifyComponent, 
            data: { expectedRoles: ['administracion1', 'administracion2', 'gerencia1', 'gerencia2']} 
          },
        ]
      },
      { 
        path: 'credits', 
        component: CreditsComponent,
        canActivateChild: [roleChildGuard],
        children: [
          { path: '', //redirectTo: 'new', 
            pathMatch: 'full',
            component: RedirectByRoleComponent,
            data: { expectedRoles:['administracion1', 'gerencia1', 'gerencia2']} 
          },
          { 
            path: 'new', 
            component: NewComponent, 
            data: { expectedRoles: ['administracion1', 'gerencia1', 'gerencia2']}
          },
          { 
            path: 'renew', 
            component: RenewComponent,
            data: { expectedRoles: ['administracion1', 'gerencia1', 'gerencia2']} 
          },
          { 
            path: 'additional', 
            component: AdditionalComponent,
            data: { expectedRoles: ['administracion1', 'gerencia1', 'gerencia2']} 
          },
        ]
      },
      { 
        path: 'payments', 
        component: PaymentsComponent,
        canActivate: [roleGuard], 
        data: { expectedRoles: ['administracion1', 'administracion2', 'gerencia1', 'gerencia2']}
      }, 
      { 
        path: 'collectors', 
        component: CollectorsComponent,
        canActivate: [roleGuard], 
        data: { expectedRoles: ['supervisora1', 'supervisora2', 'supervisora3', 'administracion1', 'administracion2', 'gerencia1', 'gerencia2']}
      },
      { 
        path: 'commissions', 
        component: CommissionsComponent,
        canActivate: [roleGuard], 
        data: { expectedRoles: ['administracion1', 'administracion2', 'gerencia1', 'gerencia2'] }
      },
      { 
        path: 'statistics', 
        component: StatisticsComponent,
        canActivateChild: [roleChildGuard],
        children:[
          { 
            path:'', 
            pathMatch: 'full',
            component: RedirectByRoleComponent,
            data: { expectedRoles: ['administracion1', 'gerencia1', 'gerencia2']} },
          { 
            path:'cash', 
            component: CashComponent, 
            data: { expectedRoles: ['administracion1', 'gerencia1', 'gerencia2']}
          },
          { 
            path:'total-credits', 
            component: TotalCreditsComponent,
            data: { expectedRoles: ['administracion1', 'gerencia1', 'gerencia2']}
          },
          { 
            path:'total-payments', 
            component: TotalPaymentsComponent, 
            data: { expectedRoles: ['administracion1', 'gerencia1', 'gerencia2']} 
          },
        ]
      },
      {
        path: 'zones',
        component: ZonesComponent,
        canActivateChild: [roleChildGuard],
        children:[
          { path:'', 
            pathMatch: 'full',
            component: RedirectByRoleComponent, 
            data: { expectedRoles: ['administracion1', 'gerencia1', 'gerencia2']} },
          { 
            path:'add', 
            component: AddZoneComponent,
            data: { expectedRoles: ['administracion1', 'gerencia1', 'gerencia2'] }
          },
          {
            path: 'modify',
            component: ModifyZoneComponent,
            data: { expectedRoles: ['administracion1', 'gerencia1', 'gerencia2'] }
          }

        ]
      },
      { 
        path: 'credit-bureau', 
        component: CreditBureauComponent,
        canActivate: [roleGuard], 
        data: { expectedRoles: ['promotoras', 'tienda', 'supervisora1', 'supervisora2', 'supervisora3', 'administracion1', 'gerencia1', 'gerencia2']}
      },
      { 
        path: 'administration', 
        component: AdministrationComponent,
        canActivateChild: [roleChildGuard],
        children:[
          { path:'', redirectTo: 'manage-credits', pathMatch: 'full' },
          { 
            path:'manage-credits', 
            component: ManageCreditsComponent, 
            data: { expectedRoles: ['administrador']}
          },
          { 
            path:'manage-payments', 
            component: ManagePaymentsComponent,
            data: { expectedRoles: ['administrador']}
          }
        ]
      },
    ]
  }
];

