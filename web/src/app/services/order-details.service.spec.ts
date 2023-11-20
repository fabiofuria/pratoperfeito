import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailsService {

  constructor(private http: HttpClient) { }

  getFoodData(id: number) {
    const url = `http://localhost:3000/api/food?id=${id}`;
    return this.http.get<any[]>(url);
  }


}
