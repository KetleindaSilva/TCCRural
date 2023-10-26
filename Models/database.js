const mysql = require('mysql2');


/*const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rural',
});*/
const db = mysql.createConnection({
    host: 'mysql.infocimol.com.br' ,
    user: 'infocimol06',
    password: 'ruralMarket123',
    database: 'infocimol06'
  });
db.connect((err) => {
    if (err) {
        console.log('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
    }
});

module.exports = db; 

