const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

// Fonction d'inscription
exports.register = async (req, res) => {
  const { nom, prenom, email, password } = req.body;

  // Vérification des champs obligatoires
  if (!nom || !prenom || !email || !password) {
    console.log('Erreur : Un ou plusieurs champs sont manquants');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Mot de passe haché : ${hashedPassword}`);
    
    // Insertion dans la base de données
    db.query(
      'INSERT INTO Utilisateur (nom, prenom, email, password) VALUES (?, ?, ?, ?)',
      [nom, prenom, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('Erreur SQL lors de l\'inscription :', err);
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already exists' });
          }
          return res.status(500).json({ error: err });
        }
        console.log('Utilisateur créé avec succès');
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (error) {
    console.error('Erreur serveur lors de l\'inscription :', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Fonction de connexion
exports.login = (req, res) => {
  const { email, password } = req.body;

  console.log(`Tentative de connexion avec l'email : ${email}`);

  // Requête pour récupérer l'utilisateur par email
  db.query(
    'SELECT * FROM Utilisateur WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.error('Erreur SQL lors de la connexion :', err);
        return res.status(500).json({ error: err });
      }

      const user = results[0];

      if (!user) {
        console.log('Aucun utilisateur trouvé avec cet email');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('Utilisateur trouvé :', user);

      try {
        // Comparaison des mots de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`Mot de passe valide : ${isPasswordValid}`);

        if (isPasswordValid) {
          // Génération du token JWT
          const token = jwt.sign(
            { id_utilisateur: user.id_utilisateur },
            SECRET_KEY,
            { expiresIn: '1h' }
          );
          console.log('Token généré avec succès');
          return res.json({ token });
        } else {
          console.log('Le mot de passe est incorrect');
          return res.status(401).json({ message: 'Invalid credentials' });
        }
      } catch (error) {
        console.error('Erreur serveur lors de la vérification du mot de passe :', error);
        res.status(500).json({ message: 'Server error' });
      }
    }
  );
};
