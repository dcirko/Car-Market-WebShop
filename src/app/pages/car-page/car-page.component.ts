import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe } from "../../currency.pipe";
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

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

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); 
    console.log(id);

    this.apiService.getCarById(id).subscribe(
      (data) => {
        console.log('✅ Podaci dohvaćeni iz API-ja:', data);
        this.car = data;
      },
      (error) => {
        console.error('❌ Greška pri dohvaćanju automobila:', error);
      }
    )
  }
  buyCar() {
    const podaciKupnje = {
      korisnik_id: 2,
      automobil_id: this.car.id,
      cijena: this.car.cijena,
      nacinPlacanja: this.nacinPlacanja,

    }

    this.apiService.buyCar(podaciKupnje).subscribe(
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
