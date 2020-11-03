const knex = require('../models/database');

async function deleteEntity(table, object){
    await knex(table)
        .where(object)
        .delete();
}
module.exports = deleteEntity;