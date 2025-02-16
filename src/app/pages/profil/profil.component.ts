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

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit() {
    this.getKupnjeKorisnika();
    this.getUser();
  }

  getKupnjeKorisnika() {
    //const idKorisnika = this.route.snapshot.paramMap.get('idKorisnika'); 
    const idKorisnika = 2;
    console.log(idKorisnika);

    this.apiService.getUserPurchases(idKorisnika).subscribe(
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
    //const idKorisnika = this.route.snapshot.paramMap.get('idKorisnika'); 
    const idKorisnika = 2;
    console.log(idKorisnika);

    this.apiService.getUserById(idKorisnika).subscribe(
      (data) => {
        console.log('✅ Podaci dohvaćeni iz API-ja:', data);
        this.user = data[0];
      },
      (error) => {
        console.error('❌ Greška pri dohvaćanju korisnika:', error);
      }
    );

  }

}
