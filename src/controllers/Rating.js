const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');
const { update } = require('../models/database');

class Rating{
    async giveRating(req, res){
        const { uID, eID, stars } = req.params;

        const verifyRating = await verifyEntity('tb_rating', {
            id_estabelecimento: eID,
            id_usuario: uID
        });

        if(verifyRating === true){
            try {
                const rating = await knex.select('tb_usuario.nm_usuario', 'tb_usuario.img_foto', 'tb_rating.qt_stars', 'tb_rating.id_estabelecimento')
                                          .from('tb_usuario')
                                          .leftJoin('tb_rating', 'tb_rating.id_usuario', 'tb_usuario.cd_usuario')
                                          .where({id_estabelecimento: eID, id_usuario: uID});
                return res.status(409).send({
                message: 'Você já julgou esse estabelecimento, deseja atualizar seu julgamento?',
                rating: rating 
                });
                } catch (err) {
                console.log(err);
                return res.status(400).send({
                    error: 'Erro ao buscar Rating'
                });
            }
        }

        const rating = {
            qt_stars: stars,
            id_estabelecimento: eID,
            id_usuario: uID
        }



        const trx = await knex.transaction();

        try {
            await trx('tb_rating').insert(rating);
            await trx.commit();
            
            let ratingMedia = await knex('tb_rating').where({
                id_estabelecimento: eID,
            }).select(knex.raw('ROUND(AVG(qt_stars) * 1, 2) AS media'));

            await knex('tb_estabelecimento')
                  .where({
                    cd_estabelecimento: eID,
                  })
                  .update({ qt_media_stars : eval(ratingMedia[0].media)});

            return res.status(201).json({
                success: 'Registrado Com sucesso',
                Rating: rating
            });

        } catch (err) {
            console.log(err);
            return res.status(400).send({
                erro: 'Erro ao Cadastrar.'
            });
        }

    }
    async showInEstablishment(req, res){
        const { eId } = req.params;

        const verifyRatings = await verifyEntity('tb_rating', {
            id_estabelecimento: eId
        });

        if(verifyRatings === false){
            return res.status(404).send({
                message: 'Ninguém julgou esse estabelecimento ainda, seja o primeiro!'
            });
        }

        try {
            const ratings = await knex.select('tb_usuario.cd_usuario','tb_usuario.nm_usuario', 'tb_usuario.img_foto', 'tb_rating.qt_stars', 'tb_rating.id_estabelecimento')
                                      .from('tb_usuario')
                                      .leftJoin('tb_rating', 'tb_rating.id_usuario', 'tb_usuario.cd_usuario')
                                      .where({id_estabelecimento: eId});
            return res.status(200).json(ratings);
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Erro ao buscar Ratings'
            });
        }
    }
    async showYourRating(req, res){
       const { eId, uId } = req.params;

        try {
        const rating = await knex.select('tb_usuario.nm_usuario', 'tb_usuario.img_foto', 'tb_rating.qt_stars', 'tb_rating.id_estabelecimento')
                                  .from('tb_usuario')
                                  .leftJoin('tb_rating', 'tb_rating.id_usuario', 'tb_usuario.cd_usuario')
                                  .where({id_estabelecimento: eId, id_usuario: uId});
        return res.status(200).json(rating);
        } catch (err) {
        console.log(err);
        return res.status(400).send({
            error: 'Erro ao buscar Rating'
        });
    }
    }
    async update(req, res){
        const { eId, uId, stars } = req.params;

        const verifyRating = await verifyEntity('tb_rating', {
            id_estabelecimento: eId,
            id_usuario: uId
        });

        if(verifyRating === false){
            return res.status(404).send({
               warn: 'Você ainda não julgou esse estabelecimento' 
            });
        }

        const newRating = {
            qt_stars: stars,
        }
        try {
            await knex('tb_rating').update(newRating).where({
                id_estabelecimento: eId,
                id_usuario: uId
            });

            let ratingMedia = await knex('tb_rating').where({
                id_estabelecimento: eId,
            }).select(knex.raw('ROUND(AVG(qt_stars) * 1, 2) AS media'));

            await knex('tb_estabelecimento')
                  .where({
                    cd_estabelecimento: eId,
                  })
                  .update({ qt_media_stars : eval(ratingMedia[0].media)});

            return res.status(200).json({
                user: uId,
                establishment: eId,
                newEstablishmentMedia: eval(ratingMedia[0].media),
                newRating: stars
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'erro ao atualizar rating'
            });
        }
    }
    async delete(req,res){
        const { eId, uId } = req.params;

        const verifyRating = await verifyEntity('tb_rating', { 
            id_usuario: uId,
            id_estabelecimento: eId
        });

        if(verifyRating === false){
            return res.status(404).send({
                Error: `Requisição Não Autorizada`
            });
        }
        try {
            deleteEntity('tb_rating',{
                id_usuario: uId,
                id_estabelecimento: eId
            });
            return res.status(200).send({
                success: 'Julgamento removido com sucesso'
            });
            
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Não foi Possivel remover o julgamento'
            });
        }
    }
}
module.exports = Rating;