import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CurrencyPipe } from "../../currency.pipe";
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CurrencyPipe, RouterModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  featuredCars: any[] = [];
  top3Cars: any[] = [];
  

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {}

  ngOnInit() {

    this.fetchTop3Cars();
    
  }

  fetchTop3Cars() {
    this.apiService.getAllCars(3);  // Dohvatimo top 3 auta sa servera
    this.apiService.topCars$.subscribe(
      (data) => {
        this.top3Cars = data;  // Ažuriramo podatke u komponenti čim se podaci promijene
      },
      (error) => {
        console.error('❌ Greška pri dohvaćanju top 3 automobila:', error);
      }
    );

  }
  
  addCar() {
    this.router.navigate(['/dodaj-auto']);
  }

  ponuda(){
    this.router.navigate(['/ponuda']);
  }

  
  
  
}
