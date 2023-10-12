import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Logement } from 'src/app/models/Logement';
import { GetAccommodationsService } from 'src/app/services/get-accommodations.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-presentation-logement',
  templateUrl: './presentation-logement.component.html',
  styleUrls: ['./presentation-logement.component.scss']
})
export class PresentationLogementComponent {

  id: number;

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
      this.imageWithPrefix = "data:image/jpeg;base64," + logement.image; // Concaténer le préfixe "data:image/jpeg;base64," avec le string d'encodage de l'image
    });
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
