import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './auth/login/login.component';
export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent},
    { path: 'features',
        loadChildren: () => import('./features/features.routes').then(m =>m.FEATURES_ROUTES)
    }
];

