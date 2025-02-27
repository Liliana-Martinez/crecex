import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { InteractiveScreenComponent } from './shared/componentes/interactive-screen/interactive-screen.component';
import { ClientsGuarantorsComponent } from './features/clients-guarantors/clients-guarantors.component';
import { ConsultComponent } from './features/clients-guarantors/pages/consult/consult.component';
import { ModifyComponent } from './features/clients-guarantors/pages/modify/modify.component';
import { AddComponent } from './features/clients-guarantors/pages/add/add.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, // Muestra el login al iniciar
  { 
    path: 'app', component: InteractiveScreenComponent, // Estructura con header y menú
    children: [
      { path: 'home', component: HomeComponent }, // Aquí se cargará dentro del <router-outlet>
      { 
        path: 'clients-guarantors',
        children: [
          //{ path: '', redirectTo: 'add', pathMatch: 'full' },
          { path: 'add', component: AddComponent },
          { path: 'consult', component: ConsultComponent },
          { path: 'modify', component: ModifyComponent },
        ]
      }

    ] 
  }

    /*{ path: '', component: LoginComponent},
    { path: 'Home', component: InteractiveScreenComponent},
    { path: 'home', component: HomeComponent},
    { path: 'features',
        loadChildren: () => import('./features/features.routes').then(m =>m.FEATURES_ROUTES)
    }*/
];

