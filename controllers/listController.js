const db = require("../config/db");

const fetchListe = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT * FROM liste ;`;
    let query = db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// const addListe = (liste) => {
//   return new Promise((resolve, reject) => {
//     let sql = `INSERT INTO list (id_liste, date_creation)
//         VALUES (?,?);
//       `;
//     let query = conn.query(
//       sql,
//       [liste.id_liste, liste.date_creation],
//       (err, result, field) => {
//         if (err) return reject(err);
//         resolve(result);
//       }
//     );
//   });
// };

// const deleteListeById = (IDListe) => {
//   return new Promise((resolve, reject) => {
//     let sql = `DELETE FROM liste WHERE id_liste = ?`;
//     let query = conn.query(sql, [IDListe], (err, result, field) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

module.exports = {
  fetchListe,
  // fetchListeByUserId
  // addListe,
  // deleteListeById,
};
