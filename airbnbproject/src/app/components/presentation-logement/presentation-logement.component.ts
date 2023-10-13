import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Logement } from 'src/app/models/Logement';
import { GetAccommodationsService } from 'src/app/services/get-accommodations.service';
import { Observable } from 'rxjs';
import * as L from 'leaflet';


const customIcon = L.icon({
  iconUrl: '../../../assets/imgAirbnb/position.svg', // Remplacez par le chemin de votre image
  iconSize: [20, 20], // Définissez la taille de l'icône
  iconAnchor: [10, 10], // Définissez l'ancrage de l'icône
});

@Component({
  selector: 'app-presentation-logement',
  templateUrl: './presentation-logement.component.html',
  styleUrls: ['./presentation-logement.component.scss']
})


export class PresentationLogementComponent {

  // VARIABLES LOCALES
  id: number;
  private map: any;

  latitude: number = 51.5074;
  longitude: number = 0.0;

  cardDataObservable : Observable<Logement>;

  cardData : Logement;

  imageWithPrefix: string;

  // CONSTRUCTEUR
  constructor(private service : GetAccommodationsService, private route: ActivatedRoute){
    this.route.params.subscribe(params => {
      this.id = params['id']; // Obtenez la valeur du paramètre "id" depuis l'URL
      console.log(this.id); // Affichez la valeur du paramètre "id"
    });
  }

  
  ngOnInit() {
    
    // quand on clique sur un logement, on récupère les données du logement dans la base de données avec l'id et l'appel de la fonction suivante
    this.cardDataObservable = this.service.getCityById(this.id);

    // quand cardDataObservable est mis à jour on réalise les actions suivantes :
    this.cardDataObservable.subscribe(logement => {
      this.cardData = logement; // met à jour le conteneur cardData. Ce conteneur est utilisé pour l'affichage dans le htmls : nom, prix, rating...

      this.imageWithPrefix = "data:image/jpeg;base64," + logement.image; // Concaténer le préfixe "data:image/jpeg;base64," avec le string d'encodage de l'image
    
      this.service.getCoordCity(this.cardData.city_name).subscribe((coordinates: number[] | null) => {
        if (coordinates) {
          // Faites quelque chose avec les coordonnées
          console.log('Coordonnées :', coordinates);

          this.map = L.map('map').setView([coordinates[1], coordinates[0]], 10); // Coordonnées du centre de la carte et niveau de zoom

          // ajout de la carte au composant this.map
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(this.map);

          // ajout du marker
          this.addMarkerToMap(this.map, 'Il se situe ici', coordinates);

        } else {
          console.log('Aucune coordonnée trouvée ou données incorrectes.');
        }
      });

    });

  }


  // cette fonction permet d'ajouter le marqueur sur la carte
  addMarkerToMap(map: any, location: string, coordinates : any) {
    
    L.marker([coordinates[1], coordinates[0]], {
      icon: customIcon,
    })
      .addTo(map)
      .bindPopup(location)
      .openPopup();
  }


  // cette fonction met à jour la base de données en effectuant un request post
  public saveLiked(){
    console.log("love !");
    this.cardData.favourite = !this.cardData.favourite;
    this.service.setAccomodations(this.cardData).subscribe(
      response => {
        console.log('Requête POST réussie :', response);
      },
      error => {
        console.error('Erreur lors de la requête POST :', error);
      }
    );
  }

}
