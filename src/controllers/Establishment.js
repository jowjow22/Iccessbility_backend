const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');
const imagesUpload = require('../utils/imageUploads');
const imagesUpdate = require('../utils/imageUpdate');

class Establishment{
    async create(req, res){
        const {
            name,
            city,
            image,
            state,
            latitude,
            longitude,
            totalRating,
            idUser,
            idEtype
        } = req.body;

        const verifyEstablishment = await verifyEntity(
            'tb_estabelecimento', 
            function (){ this.where({
                nm_estabelecimento: name,
                nm_cidade_estabelecimento: city
            }).orWhere({ latitude: latitude, longitude: longitude })}
            
        );
        if(verifyEstablishment === true) {
            return res.status(409).send({
                Error: 'Estabelecimento já existente'
            })
        }

        const eImage = await imagesUpload('establishment-images', image);


        const establishment = {
            nm_estabelecimento: name,
            nm_cidade_estabelecimento: city,
            img_estabelecimento: eImage,
            sg_estado: state,
            latitude: latitude,
            longitude: longitude,
            qt_media_stars: totalRating,
            id_usuario: idUser,
            id_tp_estabelecimento: idEtype
        }

        const trx = await knex.transaction();

        try{
            await trx('tb_estabelecimento').insert(establishment);
            await trx.commit();
            return res.status(201).json({
                success: 'Registrado Com sucesso',
                estabelecimento: establishment
            });
        }catch(err){
            console.log(err);
            return res.status(400).send({
                erro: 'Erro ao Cadastrar.'
            });
        }
    }
    async showInCity(req, res){
        const { cityName } = req.params;
        try{
            const establishments = await knex.select(knex.raw('e.*, group_concat(nm_acessibilidade) as acessibilidade'))
            .from(knex.raw('tb_acessibilidade a, tb_estabelecimento e'))
            .rightJoin('tb_estabelecimento_acessibilidade', 'tb_estabelecimento_acessibilidade.id_estabelecimento', 'e.cd_estabelecimento')
            .where(knex.raw(`e.nm_cidade_estabelecimento = "${cityName}"`))
            .andWhere(knex.raw('tb_estabelecimento_acessibilidade.id_acessibilidade = a.cd_acessibilidade group by nm_estabelecimento'));
            
            return res.status(200).json(establishments);
        }catch(err){
            console.log(err);
            return res.status(404).send({
                erro: "Não foi possivel encontrar a estabelecimentos"
            });
        }

    }
    async showOne(req, res){
        const { eID } = req.params;
        try{
            const establishments = await knex.select(knex.raw('e.*, group_concat(nm_acessibilidade) as acessibilidade'))
            .from(knex.raw('tb_acessibilidade a, tb_estabelecimento e'))
            .rightJoin('tb_estabelecimento_acessibilidade', 'tb_estabelecimento_acessibilidade.id_estabelecimento', 'e.cd_estabelecimento')
            .where(knex.raw(`e.cd_estabelecimento = "${eID}"`))
            .andWhere(knex.raw('tb_estabelecimento_acessibilidade.id_acessibilidade = a.cd_acessibilidade group by nm_estabelecimento'));
            
            return res.status(200).json(establishments);
        }catch(err){
            console.log(err);
            return res.status(404).send({
                erro: "Não foi possivel encontrar a estabelecimentos"
            });
        }

    }
    async delete(req, res){
        const { uID, eID } = req.params;
        const verifyEstablishment = await verifyEntity('tb_estabelecimento', { 
            id_usuario: uID,
            cd_estabelecimento: eID
        });

        if(verifyEstablishment === false){
            return res.status(404).send({
                Error: `Requisição Não Autorizada`
            });
        }

        try{
            deleteEntity('tb_estabelecimento', { 
                cd_estabelecimento: eID,
                id_usuario: uID
            });
            res.status(200).send({
                success: `Sucesso ao deletar o estabelecimento com ID ${eID}`
            });
        }catch(err){
            console.log(err);
            return res.status(400).send({
                Error: `Erro ao deletar estabelecimento com ID ${uID}`
            });
        }
    }
    async update(req, res){
        const {
            name,
            city,
            state,
            localization,
            totalRating,
            idUser,
            idEtype
        } = req.body;

        const establishment = {
            nm_estabelecimento: name,
            nm_cidade_estabelecimento: city,
            sg_estado: state,
            loc_estabelecimento: localization,
            qt_media_stars: totalRating,
            id_usuario: idUser,
            id_tp_estabelecimento: idEtype
        }

        const { uID, eID } = req.params;
        const verifyEstablishment = await verifyEntity('tb_estabelecimento', { 
            id_usuario: uID,
            cd_estabelecimento: eID
        });

        if(verifyEstablishment === false){
            return res.status(404).send({
                Error: `Requisição Não Autorizada`
            });
        }

        try {
            console.log(establishment);
            await knex('tb_estabelecimento').update(establishment).where({
                id_usuario: uID,
                cd_estabelecimento: eID
            });
            return res.status(200).json({
                establishmentID: eID,
                 establishment
                });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                Error: 'Falha ao atualizar estabelecimento'
            });
        }
    }
    async EstablishmentImageUpdate(req, res){
        const { uID, eID } = req.params;
        const { newImage } = req.body;

        const verifyEstablishment = await verifyEntity('tb_estabelecimento', { 
            id_usuario: uID,
            cd_estabelecimento: eID
        });

        if(verifyEstablishment === false){
            return res.status(404).send({
                Error: `Requisição Não Autorizada`
            });
        }

        const updateImageURL = await imagesUpdate('establishment-images', 'img_estabelecimento', { cd_estabelecimento:eID }, newImage, 'tb_estabelecimento');

        const updatedImage = {
            img_estabelecimento : updateImageURL
        }
        try {
            await knex('tb_estabelecimento').update( updatedImage ).where({ cd_estabelecimento:eID });

            return res.status(200).json({
                success: 'Imagem do estabelecimento foi atualizada'
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'erro ao atualizar'
            });
        }
    }
}
module.exports = Establishment;