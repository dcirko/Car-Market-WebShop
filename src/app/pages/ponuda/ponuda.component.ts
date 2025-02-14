import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CurrencyPipe } from "../../currency.pipe";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ponuda',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CurrencyPipe, RouterModule, FormsModule],
  templateUrl: './ponuda.component.html',
  styleUrl: './ponuda.component.css'
})
export class PonudaComponent {
  cars: any[] = [];
  allCars: any[] = [];
  searchQuery: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchCars();
  }

  fetchCars() {
    this.http.get<any[]>('http://localhost:3000/api/automobili').subscribe(
      (data) => {
        console.log('✅ Podaci dohvaćeni iz API-ja:', data);
        this.allCars = data; // Spremamo originalnu listu
        this.cars = [...this.allCars]; // Kopiramo u prikazanu listu
      },
      (error) => {
        console.error('❌ Greška pri dohvaćanju automobila:', error);
      }
    );
  }

  search(){
    const query = this.searchQuery.trim().toLowerCase();

    if (query === '') {
      this.cars = [...this.allCars];
      return;
    }else{
      this.cars = this.allCars.filter((car) => {
        return car.marka.toLowerCase().includes(query) || car.model.toLowerCase().includes(query);
      });
    }
  }
}
