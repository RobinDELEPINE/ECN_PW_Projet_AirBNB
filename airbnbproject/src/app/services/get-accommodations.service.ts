import { Injectable } from '@angular/core';
import { Logement } from '../models/Logement';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { City } from '../models/City';



@Injectable({
  providedIn: 'root'
})
export class GetAccommodationsService {
  private apiBaseUrl = 'http://localhost:3000/get/accommodations';

  constructor(private http : HttpClient){}

  getAccomodations(){
    return this.http.get<Array<Logement>>(`${this.apiBaseUrl}`);
  }

  getCitiesByName(city : string): Observable<Array<City>> {
    return this.http.get<Array<City>>(`https://geo.api.gouv.fr/communes?nom=${city}`);
  }

  setAccomodations(logement: Logement){
    return this.http.post('http://localhost:3000/post/accommodations', logement).pipe(
      catchError(error => {
        console.error('Erreur lors de la requête POST :', error);
        return throwError(error); // Renvoie une erreur observable pour que le composant puisse la traiter
      }));
  }

  getCityById(id : number): Observable<Logement> {
    return this.http.get<Logement>(`http://localhost:3000/get/city?id=${id}`);
  }
}
