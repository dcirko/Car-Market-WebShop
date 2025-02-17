import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
  
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  private topCarsSubject = new BehaviorSubject<any[]>([]); 
  topCars$ = this.topCarsSubject.asObservable(); 
  private allCarsSubject = new BehaviorSubject<any[]>([]); 
  allCars$ = this.allCarsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /*HomeIPonuda*/
  getAllCars(limit?: number) {
    const url = limit ? `${this.apiUrl}/automobili?limit=${limit}` : `${this.apiUrl}/automobili`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        console.log( data);
        this.topCarsSubject.next(data);  
        this.allCarsSubject.next(data);
      },
      (error) => {
        console.error('❌ Greška pri dohvaćanju automobila:', error);
      }
    );;
  }
  

  /*carPage*/
  getCarById(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/automobili/${id}/specifikacije`);
  }

  buyCar(kupnja: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/kupi`, kupnja);
  }

  isCarBought(carId: number, userId: number) {
    return this.http.get<{ kupjen: boolean }>(`http://localhost:3000/api/automobili/${carId}/status-kupnje/${userId}`);
  }
  
  /* */ 

  /*addEditCar*/
  addCar(car: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/automobili`, car);
  }

  updateCar(id: number, car: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/automobili/${id}`, car);
  }
  /* */

  // Obriši automobil
  deleteCar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/automobili/${id}`);
  }

  /*profil*/
  getUserPurchases(korisnikId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/kupnje/${korisnikId}`);
  }

  getUserById(korisnikId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/korisnici/${korisnikId}`);
  }
  /* */
  
}
