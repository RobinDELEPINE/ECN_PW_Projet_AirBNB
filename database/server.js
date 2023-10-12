const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const port = 3000;
const cors = require('cors');
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database('accommodations.db');


app.use(bodyParser.json({limit: '35mb'}));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '35mb',
    parameterLimit: 50000,
  }),
);
app.use(cors());



app.get("/get/accommodations", (req, res) => {
    db.serialize(function (){
        db.all('SELECT * FROM accommodations', function(err, row){    res.send(row);});
    });
});

app.listen(port, () =>{
    console.log(`Serveur ecoutant sur le port ${port}`);
});

app.post("/post/accommodations", (req, res) => {
    const updatedAccommodation = req.body; // Supposons que l'accommodation est envoyée dans le corps de la requête
        if (typeof updatedAccommodation !== 'object' || updatedAccommodation.id === undefined || updatedAccommodation.favourite === undefined) {
            res.status(400).send("Invalid request body");
            return;
          }
        db.serialize(() => {
          const query = `
            UPDATE accommodations
            SET
              favourite = ?
            WHERE id = ?
          `;
          const params = [
            updatedAccommodation.favourite ? 1 : 0,
            updatedAccommodation.id,
          ];
      
          db.run(query, params, (err) => {
            console.log(`id ${updatedAccommodation.id}`);
            if (err) {
              console.error(err.message);
              res.status(500).send("Internal Server Error");
            } else {
              res.status(200);
            }
          });
        });

  });

  app.get('/get/city', (req, res) => {
    const id = parseInt(req.query.id);
  
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID invalide' });
      return;
    }
    
    const query = `
    SELECT * FROM accommodations
    WHERE id = ?
    `;

    db.get(query, [id], (err, row) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Erreur interne du serveur' });
        return;
      }

      if (!row) {
        res.status(404).json({ message: 'Logement non trouvé' });
      } else {
        res.json(row);
      }
    });
  });


  
  
  
  
  