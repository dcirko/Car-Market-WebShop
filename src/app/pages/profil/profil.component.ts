import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CurrencyPipe } from "../../currency.pipe";
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.getKupnjeKorisnika();
    this.getUser();
  }

  getKupnjeKorisnika() {
    //const idKorisnika = this.route.snapshot.paramMap.get('idKorisnika'); 
    const idKorisnika = 1;
    console.log(idKorisnika);

    this.http.get<any[]>(`http://localhost:3000/api/kupnje/${idKorisnika}`).subscribe(
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
    const idKorisnika = 1;
    console.log(idKorisnika);

    this.http.get<any>(`http://localhost:3000/api/korisnici/${idKorisnika}`).subscribe(
      (data) => {
        console.log('✅ Podaci dohvaćeni iz API-ja:', data);
        this.user = data[0];
        console.log('✅ Podaci dohvaćeni iz API-ja:', this.user);
      },
      (error) => {
        console.error('❌ Greška pri dohvaćanju korisnika:', error);
      }
    );
  }

}
