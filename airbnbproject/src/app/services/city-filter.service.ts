import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { City } from '../models/City';

@Injectable({
  providedIn: 'root'
})
export class CityFilterService {
  // private selectedCity : City;

  // setSelectedCity(suggestion: City) {
  //   this.selectedCity = suggestion;
  // }

  // getSelectedCity(){
  //   return this.selectedCity;
  // }

  private selectedCitySubject = new Subject<City>();
  selectedCity$ = this.selectedCitySubject.asObservable();

  setSelectedCity(city: City) {
    return this.selectedCitySubject.next(city);
  }

}