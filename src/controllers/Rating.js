const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');

class Rating{
    async giveRating(req, res){
        const { uID, eID, stars } = req.params;

        const verifyRating = await verifyEntity('tb_rating', {
            id_estabelecimento: eID,
            id_usuario: uID
        });

        if(verifyRating === true){
            return res.status(400).send({
               error: 'Você já julgou esse estabelecimento' 
            });
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

}
module.exports = Rating;