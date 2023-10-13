import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Logement } from 'src/app/models/Logement';
import { GetAccommodationsService } from 'src/app/services/get-accommodations.service';
import { Observable } from 'rxjs';
import * as L from 'leaflet';

const customIcon = L.icon({
  iconUrl: '../../../assets/imgAirbnb/logoAirbnb.svg', // Remplacez par le chemin de votre image
  iconSize: [10, 10], // Définissez la taille de l'icône
  iconAnchor: [0, 0], // Définissez l'ancrage de l'icône
});

@Component({
  selector: 'app-presentation-logement',
  templateUrl: './presentation-logement.component.html',
  styleUrls: ['./presentation-logement.component.scss']
})


export class PresentationLogementComponent {

  id: number;
  private map: any;

  latitude: number = 51.5074;
  longitude: number = 0.0;


  constructor(private service : GetAccommodationsService, private route: ActivatedRoute){
    this.route.params.subscribe(params => {
      this.id = params['id']; // Obtenez la valeur du paramètre "id" depuis l'URL
      console.log(this.id); // Affichez la valeur du paramètre "id"
    });
  }

  

  cardDataObservable : Observable<Logement>;

  cardData : Logement;

  imageWithPrefix: string;


  ngOnInit() {
    // this.cardData = this.serviceSaveData.getLogement();

    this.cardDataObservable = this.service.getCityById(this.id);

    this.cardDataObservable.subscribe(logement => {
      this.cardData = logement;

      console.log("name");
      console.log(this.cardData.city_name);

      this.imageWithPrefix = "data:image/jpeg;base64," + logement.image; // Concaténer le préfixe "data:image/jpeg;base64," avec le string d'encodage de l'image
    
      this.service.getCoordCity(this.cardData.city_name).subscribe((coordinates: number[] | null) => {
        if (coordinates) {
          // Faites quelque chose avec les coordonnées
          console.log('Coordonnées :', coordinates);

          this.map = L.map('map').setView([coordinates[1], coordinates[0]], 10); // Coordonnées du centre de la carte et niveau de zoom

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(this.map);

          this.addMarkerToMap(this.map, this.cardData.city_name, coordinates);

        } else {
          console.log('Aucune coordonnée trouvée ou données incorrectes.');
        }
      });

    });

  }


  addMarkerToMap(map: any, location: string, coordinates : any) {
    
    L.marker([coordinates[1], coordinates[0]], {
      icon: customIcon,
    })
    .addTo(map)
      .bindPopup(location)
      .openPopup();
  }


  public saveLiked(){
    console.log("love !");
    this.cardData.favourite = !this.cardData.favourite;
    this.service.setAccomodations(this.cardData).subscribe(
      response => {
        console.log('Requête POST réussie :', response);
        // Traiter la réponse si nécessaire
      },
      error => {
        console.error('Erreur lors de la requête POST :', error);
        // Traiter l'erreur
      }
    );
  }

}
