const crypto = require('crypto');
const azure = require('azure-storage');
const config = require('../config/config');

async function imagesUpload(blobContainer, image){
    const blobSvc = azure.createBlobService(config.containerConnectionString);
    let fileName = crypto.randomBytes(20).toString('hex') + '.png';
    let rawData = image;
    let matches = rawData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let type = matches[1];
    let buffer = new Buffer.from(matches[2], 'base64');
    const profileUrl = `https://icessbilitystorage.blob.core.windows.net/${blobContainer}/${fileName}`;
    blobSvc.createBlockBlobFromText(blobContainer, fileName, buffer, {
       contentType: type
     }, (err, result, response) => {
       if (err) {
         fileName = 'default-publisher.png'
       }
     });
     return profileUrl;
}

module.exports = imagesUpload;