const knex = require('../models/database');

async function verifyEntity(table, column,field){
    const verification = await knex(table)
        .where(column, field)
        .first()
        .select(column);

    return !verification ? false : true;
    
}
module.exports = verifyEntity;