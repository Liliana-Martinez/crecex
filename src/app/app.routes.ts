import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent}, //Es la ruta principal, es decir, cuando solo es http://localhost:4200/ 
    { path: 'features',
        loadChildren: () => import('./features/features.routes').then(m => m.FEATURES_ROUTES)
    }
     //   { path: 'features', loadChildren: () => import('./features/features.routes').then(m => m.default) }

        
];

