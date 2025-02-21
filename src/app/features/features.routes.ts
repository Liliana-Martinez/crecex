import { Routes } from "@angular/router";
import { ClientsGuarantorsComponent } from "./clients-guarantors/clients-guarantors.component";

console.log('Cargando rutas hijas...'); // Depuración

export const FEATURES_ROUTES: Routes = [
    { path: 'clients-guarantors', component: ClientsGuarantorsComponent }
];


