const azure = require('azure-storage');
const { BlobServiceClient,ContainerClient, StorageSharedKeyCredential } = require("@azure/storage-blob");
const config = require('../config/config');


async function deleteImage(blobContainer, imageURL){
    const image =  imageURL.split('images/');

    const blobServiceClient = await BlobServiceClient.fromConnectionString(config.containerConnectionString);
    const containerClient = await blobServiceClient.getContainerClient(blobContainer);
    const blockBlobClient = containerClient.getBlockBlobClient(image[1])
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    const blobDeleteResponse = blockBlobClient.delete();
    return true;
}
module.exports = deleteImage;