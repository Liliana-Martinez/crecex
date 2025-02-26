import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { InteractiveScreenComponent } from './shared/componentes/interactive-screen/interactive-screen.component';
import { ClientsGuarantorsComponent } from './features/clients-guarantors/clients-guarantors.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, // Muestra el login al iniciar
  { 
    path: 'app', component: InteractiveScreenComponent, // Estructura con header y menú
    children: [
      { path: 'home', component: HomeComponent }, // Aquí se cargará dentro del <router-outlet>
      { path: 'clients-guarantors/add', component: ClientsGuarantorsComponent },
    ] 
  }
    /*{ path: '', component: LoginComponent},
    { path: 'Home', component: InteractiveScreenComponent},
    { path: 'home', component: HomeComponent},
    { path: 'features',
        loadChildren: () => import('./features/features.routes').then(m =>m.FEATURES_ROUTES)
    }*/
];

