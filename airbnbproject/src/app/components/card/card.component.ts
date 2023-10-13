// Import des modules Angular nécessaires
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

// Import des modèles et services
import { City } from 'src/app/models/City';
import { Logement } from 'src/app/models/Logement';
import { GetAccommodationsService } from 'src/app/services/get-accommodations.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() cardData: Logement;  // Input pour recevoir les données du composant parent

  imageWithPrefix: string;  // Variable pour stocker l'URL de l'image avec le préfixe

  constructor(
    private router: Router,
    private service: GetAccommodationsService
  ) {}

  ngOnInit() {
    // Concaténation du préfixe "data:image/jpeg;base64," avec le string d'encodage de l'image
    this.imageWithPrefix = "data:image/jpeg;base64," + this.cardData.image;
  }

  // Méthode appelée lorsqu'un utilisateur clique sur l'icône "like"
  public saveLiked() {
    console.log("love !");
    this.cardData.favourite = !this.cardData.favourite;  // Inversion de l'état de favori
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

  // Méthode appelée lorsqu'un utilisateur clique sur la carte pour voir plus de détails
  public goToPage(cardData: Logement) {
    console.log("goToPage");

    this.router.navigateByUrl('presentation-logement/' + cardData.id);  // Navigation vers une autre page
  }
}
