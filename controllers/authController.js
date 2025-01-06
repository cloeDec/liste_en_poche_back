const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

exports.register = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  if (!nom || !prenom || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO Utilisateur (nom, prenom, email, password) VALUES (?, ?, ?, ?)',
    [nom, prenom, email, hashedPassword],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.status(201).json({ message: 'User registered successfully' });
    }
  );
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM Utilisateur WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      const user = results[0];

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id_utilisateur: user.id_utilisateur }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    }
  );
};
