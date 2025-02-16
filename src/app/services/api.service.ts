import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
  
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /*HomeIPonuda*/
  getAllCars(limit?: number): Observable<any[]> {
    const url = limit ? `${this.apiUrl}/automobili?limit=${limit}` : `${this.apiUrl}/automobili`;
    return this.http.get<any[]>(url);
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
