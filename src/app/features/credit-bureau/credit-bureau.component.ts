import { Component} from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-credit-bureau',
  imports: [RouterModule],
  templateUrl: './credit-bureau.component.html',
  styleUrl: './credit-bureau.component.css'
})
export class CreditBureauComponent {
  constructor(private router: Router) {

    }
  redirectagregar() {
    this.router.navigate(['/app/features/credi-bureau/agregar']);
  }
}
