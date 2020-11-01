/*CONFIGS UTILIZADAS COM O XAMPP, CASO USE OUTRO, ALTERE AS CONFIGURAÇÕES*/

const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'localhost',
      user : 'root',
      password : '',
      database : 'db_iccessbility'
    }
  });

  module.exports = knex;