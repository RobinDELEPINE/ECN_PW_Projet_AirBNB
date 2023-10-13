import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { City } from '../models/City';

@Injectable({
  providedIn: 'root'
})
export class CityFilterService {

  // classe qui stocke la ville rentrée dans les parametres de recherche
  // nous l'avons mis en observable pour ensuite utiliser un subscribe pour que l'affichage se mette à jour tout seul quand la valeur du filtre change
  
  private selectedCitySubject = new Subject<City>();
  selectedCity$ = this.selectedCitySubject.asObservable();

  setSelectedCity(city: City) {
    return this.selectedCitySubject.next(city);
  }

}