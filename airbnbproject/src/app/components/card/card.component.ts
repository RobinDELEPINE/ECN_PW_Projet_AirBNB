import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { City } from 'src/app/models/City';
import { Logement } from 'src/app/models/Logement';
import { GetAccommodationsService } from 'src/app/services/get-accommodations.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() cardData : Logement;

  imageWithPrefix: string;

  constructor(
    private router: Router, 
    private service: GetAccommodationsService
  ){}

  ngOnInit() {
    // Concaténer le préfixe "data:image/jpeg;base64," avec le string d'encodage de l'image
    this.imageWithPrefix = "data:image/jpeg;base64," + this.cardData.image;
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

  public goToPage(cardData : Logement){
    console.log("goToPage");

    // this.serviceSaveData.setLogement(cardData);
    
    this.router.navigateByUrl('presentation-logement/'+cardData.id);
  }

  
}
