import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from "../../currency.pipe";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CurrencyPipe, FormsModule],
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.css'
})
export class CarPageComponent {
  car: any;
  nacinPlacanja: string = 'gotovina';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); 
    console.log(id);

    if (id) {
      this.http.get(`http://localhost:3000/api/automobili/${id}/specifikacije`).subscribe(data => {
        this.car = data;
        console.log(this.car);
      });
    }
  }
  buyCar() {
    const podaciKupnje = {
      korisnik_id: 1,
      automobil_id: this.car.id,
      cijena: this.car.cijena,
      nacinPlacanja: this.nacinPlacanja,

    }

    this.http.post('http://localhost:3000/api/kupi', podaciKupnje).subscribe(
      (data) => {
        console.log('🚗 Auto je uspješno kupljen:', data);
        alert('Auto je uspješno kupljen!');
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('❌ Greška pri kupnji auta:', error);
        alert('Greška pri kupnji auta!');
      }
    );
  }


  confirmPurchase(event: Event) {
    event.preventDefault();
    const confirmation = confirm("Želiš li sigurno kupiti ovaj auto?");
    if (confirmation) {
      this.buyCar();
    }
  }
}
