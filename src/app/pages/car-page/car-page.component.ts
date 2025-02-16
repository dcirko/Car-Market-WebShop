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
  idKorisnika: number = 0;
  user: any = {};
  isBought: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); 
    console.log(id);

    this.idKorisnika = 1;
    console.log(this.idKorisnika);
    this.getUser();

    this.apiService.getCarById(id).subscribe(
      (data) => {
        console.log('✅ Podaci dohvaćeni iz API-ja:', data);
        this.car = data;
        this.checkIfCarBought();
      },
      (error) => {
        console.error('❌ Greška pri dohvaćanju automobila:', error);
      }
    );

    
  }

  checkIfCarBought() {
    if (!this.car || !this.car.id || !this.idKorisnika) return;
  
    this.apiService.isCarBought(this.car.id, this.idKorisnika).subscribe(
      (response: any) => {
        this.isBought = response.kupljen; 
        console.log('🔍 Status kupnje auta za ovog korisnika:', this.isBought);
      },
      (error) => {
        console.error('❌ Greška pri provjeri kupnje auta:', error);
      }
    );
  }
  

  buyCar() {
    if (this.isBought) {
      alert('🚫 Ovaj auto je već kupljen!');
      return;
    }

    const podaciKupnje = {
      korisnik_id: 1,
      automobil_id: this.car.id,
      cijena: this.car.cijena,
      nacinPlacanja: this.nacinPlacanja,
    };

    this.apiService.buyCar(podaciKupnje).subscribe(
      (data) => {
        console.log('🚗 Auto je uspješno kupljen:', data);
        alert('Auto je uspješno kupljen!');
        this.isBought = true; // Ažuriramo status auta
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('❌ Greška pri kupnji auta:', error);
        alert('Greška pri kupnji auta!');
      }
    );
  }

  getUser() {
    this.apiService.getUserById(this.idKorisnika).subscribe(
      (data) => {
        console.log('✅ Podaci dohvaćeni iz API-ja:', data);
        this.user = data[0];
      },
      (error) => {
        console.error('❌ Greška pri dohvaćanju korisnika:', error);
      }
    );
  }

  editCar(car: any) {
    localStorage.setItem('editCar', JSON.stringify(car));  
    this.router.navigate(['/uredi-auto']);
  }

  deleteCar(id: number){
    const confirmation = confirm("Želiš li sigurno obrisati ovaj auto?");
    if (confirmation) {
      this.apiService.deleteCar(id).subscribe(
        (data) => {
          console.log('🚗 Auto je uspješno obrisan:', data);
          alert('Auto je uspješno obrisan!');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('❌ Greška pri brisanju auta:', error);
          alert('Greška pri brisanju auta!');
        }
      );
    }
  }

  confirmPurchase(event: Event) {
    event.preventDefault();
    const confirmation = confirm("Želiš li sigurno kupiti ovaj auto?");
    if (confirmation) {
      this.buyCar();
    }
  }
}
