const db = require('../config/db');

exports.getLists = (req, res) => {
  const userId = req.user.id_utilisateur;

  db.query(
    'SELECT l.id_liste, l.date_creation FROM Liste l INNER JOIN appartient a ON l.id_liste = a.id_liste WHERE a.id_utilisateur = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
};

exports.createList = (req, res) => {
  const { date_creation } = req.body;
  const userId = req.user.id_utilisateur;

  db.query(
    'INSERT INTO Liste (date_creation) VALUES (?)',
    [date_creation],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      const listId = result.insertId;

      // Associez l'utilisateur à la liste
      db.query(
        'INSERT INTO appartient (id_utilisateur, id_liste, id_guest, date_partage) VALUES (?, ?, ?, ?)',
        [userId, listId, userId, new Date()],
        (err) => {
          if (err) return res.status(500).json({ error: err });
          res.status(201).json({ message: 'List created successfully', id_liste: listId });
        }
      );
    }
  );
};

exports.addProductToList = (req, res) => {
  const { id_liste, id_produit } = req.body;

  db.query(
    'INSERT INTO contient (id_liste, id_produit) VALUES (?, ?)',
    [id_liste, id_produit],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'Product added to list' });
    }
  );
};

exports.shareList = (req, res) => {
  const { id_liste, id_guest } = req.body;
  const userId = req.user.id_utilisateur;

  db.query(
    'INSERT INTO appartient (id_utilisateur, id_liste, id_guest, date_partage) VALUES (?, ?, ?, ?)',
    [userId, id_liste, id_guest, new Date()],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'List shared successfully' });
    }
  );
};
