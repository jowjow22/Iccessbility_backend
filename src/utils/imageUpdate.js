const knex = require('../models/database');

const imagesUpload = require('../utils/imageUploads');
const imagesDelete = require('../utils/imageDelete');

async function imagesUpdate(container, selectField, whereObject, newImage, table){
    const image = await knex(table).select(selectField).where(whereObject).first();
    
    const oldURL = image[Object.keys(image)[0]]
    await imagesDelete(container, oldURL);
    const updateImageURL = await imagesUpload(container, newImage);
    return updateImageURL;
}

module.exports = imagesUpdate;