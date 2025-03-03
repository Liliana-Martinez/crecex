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
import { CashComponent } from './features/statistics/pagesss/cash/cash.component';
import { TotalCreditsComponent } from './features/statistics/pagesss/total-credits/total-credits.component';
import { TotalPaymentsComponent } from './features/statistics/pagesss/total-payments/total-payments.component';
import { AgregarComponent } from './features/credit-bureau/agregar/agregar.component';


export const routes: Routes = [
    { path: '', component: LoginComponent }, // Muestra el login al iniciar
    { path: 'app', component: InteractiveScreenComponent, // Estructura con header y menú
    children: [
      { path: 'home', component: HomeComponent }, // Aquí se cargará dentro del <router-outlet>
      { path: 'clients-guarantors',
        children: [
          //{ path: '', redirectTo: 'add', pathMatch: 'full' },
          { path: 'add', component: AddComponent },
          { path: 'consult', component: ConsultComponent },
          { path: 'modify', component: ModifyComponent },
        ]
      },
      { path: 'credits', component: CreditsComponent,
        children: [
          { path: '', redirectTo: 'new', pathMatch: 'full' },
          { path: 'new', component: NewComponent },
          { path: 'renew', component: RenewComponent },
          { path: 'additional', component: AdditionalComponent },
        ]
      },
      { path: 'payments', component: PaymentsComponent }, 
      { path: 'collectors', component: CollectorsComponent },
      { path: 'commissions', component: CommissionsComponent },
      { path: 'statistics', component: StatisticsComponent,
        children:[
          { path:'', redirectTo: 'cash', pathMatch: 'full' },
          { path:'cash', component: CashComponent },
          { path:'total-credits', component: TotalCreditsComponent },
          { path:'total-payments', component: TotalPaymentsComponent },
        ]
      },
      { path: 'credit-bureau', component: CreditBureauComponent,
        children: [
        {path: 'agregar', component: AgregarComponent}
        ] 
      },
    ]
  }

    /*{ path: '', component: LoginComponent},
    { path: 'Home', component: InteractiveScreenComponent},
    { path: 'home', component: HomeComponent},
    { path: 'features',
        loadChildren: () => import('./features/features.routes').then(m =>m.FEATURES_ROUTES)
    }*/
];

