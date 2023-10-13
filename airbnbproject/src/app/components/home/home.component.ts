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

// Cette classe est utilisée pour afficher la grille de logement

export class HomeComponent implements OnInit{

  mesLogements$: Observable<Array<Logement>>; // liste de tous les logements
  mesLogementsFiltered$: Observable<Array<Logement>>; // liste des logements filtrés

  cityFilter : City;

  constructor(private accomodationService: GetAccommodationsService, private filterService : CityFilterService){};

  ngOnInit() : void{
    
    this.mesLogements$ = this.accomodationService.getAccomodations(); // liste de tous les logements
    this.mesLogementsFiltered$ = this.mesLogements$; // stockage de la liste de tous les logements

    // on enlève les logements qui ne correspondent pas au filtre de la liste des logements
    this.filterService.selectedCity$.subscribe(
      (cityFilter)=>{
        if(cityFilter.nom === ''){ // si il n'y a pas de filtre
          this.mesLogementsFiltered$ = this.mesLogements$; 
        }else{ // sinon on filtre
          this.mesLogementsFiltered$ = this.mesLogements$.pipe(
            map(logements => logements.filter(logement => logement.city_name === cityFilter.nom))
          );
        }
      }
    );
  }

}

