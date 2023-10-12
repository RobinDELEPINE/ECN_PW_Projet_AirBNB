import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Logement } from 'src/app/models/Logement';
import { GetAccommodationsService } from 'src/app/services/get-accommodations.service';
import { CityFilterService } from 'src/app/services/city-filter.service';
import { City } from 'src/app/models/City';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  mesLogements$: Observable<Array<Logement>>;
  mesLogementsFiltered$: Observable<Array<Logement>>;

  cityFilter : City;

  // constructor(private http : HttpClient){}
  constructor(private accomodationService: GetAccommodationsService, private filterService : CityFilterService){};

  ngOnInit() : void{
    // this.mesLogements$ = this.http.get<Array<Logement>>('http://localhost:3000/get/accommodations'); 
    this.mesLogements$ = this.accomodationService.getAccomodations();
    this.mesLogementsFiltered$ = this.mesLogements$;

    this.filterService.selectedCity$.subscribe(
      (cityFilter)=>{
        if(cityFilter.nom === ''){
          this.mesLogementsFiltered$ = this.mesLogements$;
        }else{
          //filtrer mesLogements
          this.mesLogementsFiltered$ = this.mesLogements$.pipe(
            map(logements => logements.filter(logement => logement.city_name === cityFilter.nom))
          );
        }
      }
    );
  }

}

