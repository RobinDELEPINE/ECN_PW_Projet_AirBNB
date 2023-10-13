// Importation des modules nécessaires
const bodyParser = require('body-parser');  // Module pour traiter les corps de requête
const express = require("express");  // Framework pour construire l'application web
const app = express();  // Initialisation de l'application
const port = 3000;  // Port sur lequel le serveur écoutera
const cors = require('cors');  // Middleware pour gérer les problèmes de CORS
const sqlite3 = require("sqlite3").verbose();  // Module SQLite pour interagir avec la base de données
const db = new sqlite3.Database('accommodations.db');  // Initialisation de la base de données SQLite

// Middleware pour gérer les corps de requête JSON et les problèmes de CORS
app.use(bodyParser.json({ limit: '35mb' }));  // Limite la taille des corps de requête JSON à 35 MB
app.use(
  bodyParser.urlencoded({ //Nécessaire pour la requête POST
    extended: true,
    limit: '35mb',
    parameterLimit: 50000,
  }),
);
app.use(cors()); 

// Requete GET pour récupérer tous les logements
app.get("/get/accommodations", (req, res) => {
  // Utilisation de db.all pour récupérer tous les logements depuis la base de données
  db.serialize(function () {
    db.all('SELECT * FROM accommodations', function (err, row) {
      res.send(row);  // Envoi de la liste des logements en réponse à la requête GET
    });
  });
});

// Endpoint POST pour mettre à jour un logement
app.post("/post/accommodations", (req, res) => {
  const updatedAccommodation = req.body;  // Extraction des données du corps de la requête
  // Vérification de la validité du corps de la requête
  if (typeof updatedAccommodation !== 'object' || updatedAccommodation.id === undefined || updatedAccommodation.favourite === undefined) {
    res.status(400).send("Invalid request body");  // Réponse 400 en cas de corps de requête invalide
    return;
  }

  // Utilisation de db.run pour exécuter la mise à jour dans la base de données
  db.serialize(() => {
    const query = `
      UPDATE accommodations
      SET
        favourite = ?
      WHERE id = ?
    `;
    const params = [
      updatedAccommodation.favourite ? 1 : 0,  // Conversion du booléen en 1 ou 0 pour SQLite
      updatedAccommodation.id,
    ];

    // Gestion des erreurs et envoi de la réponse appropriée
    db.run(query, params, (err) => {
      console.log(`id ${updatedAccommodation.id}`);
      if (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");  // Réponse 500 en cas d'erreur interne du serveur
      } else {
        res.status(200);  // Réponse 200 en cas de succès
      }
    });
  });
});

// Endpoint GET pour récupérer un logement par ID
app.get('/get/city', (req, res) => {
  const id = parseInt(req.query.id);  // Récupération de l'ID à partir des paramètres de requête

  // Vérification de la validité de l'ID
  if (isNaN(id)) {
    res.status(400).json({ message: 'ID invalide' });  // Réponse 400 en cas d'ID invalide
    return;
  }

  const query = `
    SELECT * FROM accommodations
    WHERE id = ?
  `;

  // Utilisation de db.get pour récupérer un logement par ID
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Erreur interne du serveur' });  // Réponse 500 en cas d'erreur interne du serveur
      return;
    }

    // Envoi de la réponse appropriée en fonction du résultat de la requête
    if (!row) {
      res.status(404).json({ message: 'Logement non trouvé' });  // Réponse 404 si le logement n'est pas trouvé
    } else {
      res.json(row);  // Envoi du logement en réponse à la requête GET
    }
  });
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});
