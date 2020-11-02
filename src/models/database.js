/*CONFIGS UTILIZADAS COM O XAMPP, CASO USE OUTRO, ALTERE AS CONFIGURAÇÕES*/

const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'us-cdbr-east-02.cleardb.com',
      user : 'b0ac80219ae14d',
      password : 'e552fd5f',
      database : 'heroku_6acdebaa0c29830'
    }
  });

  module.exports = knex;