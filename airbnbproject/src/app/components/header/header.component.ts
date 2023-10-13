// Importation des modules Angular nécessaires
import { Router } from '@angular/router';  // Module pour la navigation entre les pages
import { Observable } from 'rxjs/internal/Observable';  // Module pour la gestion des observables
import { City } from 'src/app/models/City';  // Import du modèle City
import { GetAccommodationsService } from 'src/app/services/get-accommodations.service';  // Service pour récupérer des hébergements
import { CityFilterService } from 'src/app/services/city-filter.service';  // Service pour gérer la sélection de ville
import { Component, OnInit } from '@angular/core';  // Composant Angular et module pour l'initialisation

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private router: Router, private service: GetAccommodationsService, private serviceCityFilter: CityFilterService) {}

  // Déclaration des propriétés
  villes: Array<City>;  // Liste des villes
  addressSuggestions: any[] = [];  // Liste des suggestions d'adresses provenant de la recherche
  suggestionNulle: City = {  // Objet représentant une suggestion vide
    nom: '',
    codesPostaux: []
  };

  // État de l'affichage du popup et de la liste de suggestions
  isPopupVisible = false;
  affichageListe = false;

  // Afficher le popup
  showPopup() {
    this.isPopupVisible = true;
  }

  // Cacher le popup
  hidePopup() {
    this.isPopupVisible = false;
  }
  
  // Aller à la page principale
  goToMainPage() {
    console.log("goToMainPage");
    this.router.navigateByUrl('');
  }

  // Recherche d'adresse en fonction de l'entrée utilisateur
  searchAdress(event: any) {
    const query = event.target.value;
    this.affichageListe = false;

    // Si la longueur de la requête est suffisante
    if (query.length > 2) {
      this.affichageListe = true;

      // Appel du service pour récupérer les villes par nom
      this.service.getCitiesByName(query).subscribe(
        (tableau: any) => {
          this.addressSuggestions = tableau.slice(0, 5);  // Mettez à jour la liste des suggestions avec les résultats de l'API
          console.log(this.addressSuggestions);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      this.addressSuggestions = [];  // Videz la liste si la requête est trop courte
    }
  }

  // Sélectionner une ville à partir des suggestions
  selectCity(suggestion: City) {
    this.addressSuggestions = [];  // Videz la liste de suggestions
    var monInput = document.getElementById("monInput") as HTMLInputElement;
    monInput.value = suggestion.nom;  // Vide la chaîne dans l'input

    // Appel du service pour définir la ville sélectionnée
    this.serviceCityFilter.setSelectedCity(suggestion);

    // Cacher le popup si la suggestion est vide
    if (suggestion.nom === '') {
      this.isPopupVisible = false;
    }
  }
}
