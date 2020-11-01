const knex = require('../models/database');

async function deleteEntity(table, column,field){
    await knex(table)
        .where(column, field)
        .delete();
}
module.exports = deleteEntity;