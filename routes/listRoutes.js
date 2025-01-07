const express = require("express");
const listController = require("../controllers/listController");
const router = express.Router();

router.get("/", (req, res) => {
  listController
    .fetchListe()
    .then((result) => {
      res.status(200).json(results);
      res.json(result);
    })
    .catch((err) => {
      console.error("Oops...", err);
      res.json({ message: "Error" + err.sqlMessage });
    });
});

// router.post("/", (req, res) => {
//   const liste = req.body;
//   listController
//     .addListe(liste)
//     .then((result) => {
//       console.log(result);
//       res
//         .status(201)
//         .json({ message: "Liste créée avec succès", id: results.insertId });
//       res.json(result.insertId);
//     })
//     .catch((err) => {
//       console.error("Oops...", err);
//       res.json({ message: "Error" + err.sqlMessage });
//     });
// });

// router.delete("/:IDListe", (req, res) => {
//   const deleteListe = req.params.IDListe;
//   listController
//     .deleteListeById(deleteListe)
//     .then((result) => {
//       res.status(200).json({ message: "Liste supprimée avec succès" });
//       res.json(result);
//     })
//     .catch((err) => {
//       console.error("Oops...", err);
//       res.json({ message: "Error" + err.sqlMessage });
//     });
// });

module.exports = router;
