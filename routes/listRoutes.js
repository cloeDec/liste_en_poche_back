const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Créer une nouvelle liste
router.post('/create', (req, res) => {
  const { userId, name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ message: 'userId et name sont requis' });
  }

  db.query(
    'INSERT INTO Liste (user_id, name, date_creation) VALUES (?, ?, NOW())',
    [userId, name],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Liste créée avec succès', id: results.insertId });
    }
  );
});

// Récupérer les listes d’un utilisateur
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;

  db.query(
    'SELECT * FROM Liste WHERE user_id = ?',
    [userId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(results);
    }
  );
});

// Ajouter un produit à une liste
router.post('/add-product', (req, res) => {
  const { listId, name, quantity, unit } = req.body;

  if (!listId || !name || !quantity || !unit) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  db.query(
    'INSERT INTO Produits (list_id, name, quantity, unit) VALUES (?, ?, ?, ?)',
    [listId, name, quantity, unit],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Produit ajouté avec succès' });
    }
  );
});

// Supprimer une liste
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM Liste WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: 'Liste supprimée avec succès' });
  });
});

module.exports = router;
