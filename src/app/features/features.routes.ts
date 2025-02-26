import { Routes } from "@angular/router";
import { ClientsGuarantorsComponent } from "./clients-guarantors/clients-guarantors.component";
import { HomeComponent } from "./home/home.component";

console.log('Cargando rutas hijas...'); // Depuración

export const FEATURES_ROUTES: Routes = [
    { path: 'home', component: HomeComponent }//,
    //{ path: 'clients-guarantors', component: ClientsGuarantorsComponent }
];


