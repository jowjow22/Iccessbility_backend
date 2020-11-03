const knex = require('../models/database');

async function verifyEntity(table, object){
    const verification = await knex(table)
        .where(object)
        .first()
        .select();

    return !verification ? false : true;
    
}
module.exports = verifyEntity;