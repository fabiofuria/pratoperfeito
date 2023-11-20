import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenupageDetailsService {

  constructor(private http: HttpClient) { }

  getIngredientsData(id: number) {
    return this.http.get<any[]>(`http://localhost:3000/api/ingredients?id=${id}`);
  }

  getPreparationData(id: number) {
    return this.http.get<any[]>(`http://localhost:3000/api/preparation?id=${id}`);
  }
}
