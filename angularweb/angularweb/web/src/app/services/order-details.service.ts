import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailsService {

  constructor(private http: HttpClient) { }

  getFoodData() {
    return this.http.get<any[]>('http://localhost:3000/api/food'); // Substitua pela URL correta do seu backend
  }
}
