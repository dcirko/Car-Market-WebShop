import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CurrencyPipe } from "../../currency.pipe";
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';


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
  top3Cars$!: Observable<any[]>;

  constructor(private http: HttpClient, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.top3Cars$ = this.apiService.topCars$;
    this.apiService.getAllCars(3);
    
  }

  
  addCar() {
    this.router.navigate(['/dodaj-auto']);
  }

  ponuda(){
    this.router.navigate(['/ponuda']);
  }

  
  
  
}
