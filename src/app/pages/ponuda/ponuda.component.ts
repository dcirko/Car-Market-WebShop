import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CurrencyPipe } from "../../currency.pipe";

@Component({
  selector: 'app-ponuda',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CurrencyPipe, RouterModule],
  templateUrl: './ponuda.component.html',
  styleUrl: './ponuda.component.css'
})
export class PonudaComponent {
  cars: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchCars();
  }

  fetchCars() {
    this.http.get<any[]>('http://localhost:3000/api/automobili').subscribe(
      (data) => {
        console.log('✅ Podaci dohvaćeni iz API-ja:', data);
        this.cars = data;
      },
      (error) => {
        console.error('❌ Greška pri dohvaćanju automobila:', error);
      }
    );
  }
}
