
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { City } from 'src/app/models/City';
import { GetAccommodationsService } from 'src/app/services/get-accommodations.service';
import { CityFilterService } from 'src/app/services/city-filter.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router, private service: GetAccommodationsService, private serviceCityFilter : CityFilterService){}

  villes : Array<City>;

  addressSuggestions: any[] = [];

  suggestionNulle: City = {
    nom: '',
    codesPostaux: []
  };

  isPopupVisible = false;
  affichageListe = false;

  showPopup() {
    this.isPopupVisible = true;
  }

  hidePopup() {
    this.isPopupVisible = false;
  }
  

  goToMainPage(){
    console.log("goToMainPage");
    this.router.navigateByUrl('');
  }

  searchAdress(event : any){
    const query = event.target.value;
    this.affichageListe = false;
    if (query.length > 2) {
      this.affichageListe = true;
      this.service.getCitiesByName(query).subscribe(
        (tableau: any) => {
          this.addressSuggestions = tableau.slice(0, 5); // Mettez à jour la liste des suggestions avec les résultats de l'API
          console.log(this.addressSuggestions);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.addressSuggestions = []; // Videz la liste si la requête est trop courte
    }
  }

  selectCity(suggestion : City){
    this.addressSuggestions = []; // Videz la liste si la requête est trop courte
    var monInput = document.getElementById("monInput") as HTMLInputElement;
    monInput.value = suggestion.nom; //vide la string dans input
 

    // console.log("Tu as cliqué sur : "+suggestion.nom+","+suggestion.code);
    // this.home.setFiltre(suggestion);

    this.serviceCityFilter.setSelectedCity(suggestion);

    if(suggestion.nom === ''){
      this.isPopupVisible = false;
    }

  }

}
