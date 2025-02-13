import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from "../../currency.pipe";

@Component({
  selector: 'app-car-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CurrencyPipe],
  templateUrl: './car-page.component.html',
  styleUrl: './car-page.component.css'
})
export class CarPageComponent {
  car: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

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
}
