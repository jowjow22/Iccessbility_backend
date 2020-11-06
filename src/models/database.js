/*CONFIGS UTILIZADAS COM O XAMPP, CASO USE OUTRO, ALTERE AS CONFIGURAÇÕES*/

const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'us-cdbr-east-02.cleardb.com',
      user : 'b0ac80219ae14d',
      password : 'e552fd5f',
      database : 'heroku_6acdebaa0c29830',
      dateStrings: true
    }
  });
// const knex = require('knex')({
//   client: 'mysql2',
//   connection: {
//     host : 'localhost',
//     user : 'root',
//     password : '',
//     database : 'db_iccessbility',
//     dateStrings: true
//   }
// });

  module.exports = knex;