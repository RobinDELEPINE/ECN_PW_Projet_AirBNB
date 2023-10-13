import { Injectable } from '@angular/core';
import { Logement } from '../models/Logement';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { City } from '../models/City';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class GetAccommodationsService {

  constructor(private http : HttpClient){}

  // fonction qui retourne l'ensemble des logements de la base de données sql
  getAccomodations(){
    return this.http.get<Array<Logement>>(`http://localhost:3000/get/accommodations`);
  }

  // fonction qui retourne les logements qui sont dans la ville "city"
  getCitiesByName(city : string): Observable<Array<City>> {
    return this.http.get<Array<City>>(`https://geo.api.gouv.fr/communes?nom=${city}`);
  }

  // fonction qui appelle l'api gouvernementale, on spécifie la ville en paramètre et on récupère les coordonnées de la ville
  getCoordCity(city : string){
    return this.http.get(`https://api-adresse.data.gouv.fr/search/?q=${city}`).pipe(
    map((data: any) => {
      // Vérifiez que des résultats ont été renvoyés
      if (data && data.features && data.features.length > 0) {
        const firstResult = data.features[0];
        // Vérifiez que les coordonnées existent dans la première entrée
        if (firstResult.geometry && firstResult.geometry.coordinates) {
          return firstResult.geometry.coordinates;
        }
      }
      // Si les données sont absentes ou incorrectes, retournez null ou une autre valeur par défaut
      return null;
    })
  );
  }

  // met à jour un logement de la base de données. Cette fonction est utilisée pour mettre les likes dans la base de données
  setAccomodations(logement: Logement){
    return this.http.post('http://localhost:3000/post/accommodations', logement).pipe(
      catchError(error => {
        console.error('Erreur lors de la requête POST :', error);
        return throwError(error); // Renvoie une erreur observable pour que le composant puisse la traiter
      }));
  }

  // cette fonction permet d'avoir un logement en lui spécifiant un id. Cette fonction est utilisée quand on clique sur un logement ce qui lui permet de récupérer les infos dans la base de données à partir de l'url
  getCityById(id : number): Observable<Logement> {
    return this.http.get<Logement>(`http://localhost:3000/get/city?id=${id}`);
  }
}
