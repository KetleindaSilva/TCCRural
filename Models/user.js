const db = require('./database');
const md5 = require('md5');

class User {
    static create(nome, email, senha, callback) {
        const senhaCriptografada = md5(senha);
        const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    
        db.query(sql, [nome, email, senhaCriptografada], (err, result) => {
          if (err) {
            console.error(err);
            callback(err, null);
            return;
          }
          callback(null, result);
        });
    }
static autenticar(email, senha, callback) {
  const senhaCriptografada = md5(senha);
  const sql = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';

  db.query(sql, [email, senhaCriptografada], (err, result) => {
      if (err) {
          console.error(err);
          callback(err, null);
          return;
      }
      callback(null, result[0]);
  });
}
static buscarNomePorId(anuncianteId, callback) {
  const sql = 'SELECT nome FROM usuarios WHERE id = ?';
  db.query(sql, [anuncianteId], (err, results) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }
    if (results.length > 0) {
      callback(null, results[0].nome);
    } else {
      callback(null, null); 
    }
  });
}




}

module.exports = User;
