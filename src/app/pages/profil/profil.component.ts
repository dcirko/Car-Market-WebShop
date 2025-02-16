import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurrencyPipe } from "../../currency.pipe";
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  kupnje: any[] = [];
  user: any = {};
  idKorisnika: number = 0;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    //const idKorisnika = this.route.snapshot.paramMap.get('idKorisnika'); 
    this.idKorisnika = 1;
    console.log(this.idKorisnika);

    this.getKupnjeKorisnika();
    this.getUser();
  }

  getKupnjeKorisnika() {
    this.apiService.getUserPurchases(this.idKorisnika).subscribe(
      (data) => {
        console.log('✅ Podaci dohvaćeni iz API-ja:', data);
        this.kupnje = data;
      },
      (error) => {
        console.error('❌ Greška pri dohvaćanju kupnji:', error);
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

  addCar() {
    this.router.navigate(['/dodaj-auto']);
  }

}
