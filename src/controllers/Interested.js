const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');
const { leftJoin } = require('../models/database');

class Interested{
    async create(req, res){
        const { postID, userID } = req.params;

        const verifyInterest = await verifyEntity('tb_interessados', {
            id_post: postID,
            id_usuario: userID
        });

        const postOwner = await knex('tb_post').where({ cd_post: postID }).select('id_usuario');

        if(userID == postOwner[0].id_usuario){
            return res.status(401).send({
                error: 'Você não pode demonstrar interesse em seu próprio post'
            });
        }

        if(verifyInterest === true){
            return res.status(401).send({
                error: "Você já demonstrou interesse nessa publicação"
            });
        }

        const interest = {
            id_post: postID,
            id_usuario: userID
        };

        const trx = await knex.transaction();

        try {
            await trx('tb_interessados').insert(interest);
            await trx.commit();
            return res.status(201).json({
                success: 'Você demonstrou interesse nesse post',
                interest: interest
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Erro ao demonstrar interesse'
            });
        }
    }
    async delete(req, res){
        const { postID, userID } = req.params;

        const verifyInterest = await verifyEntity('tb_interessados', {
            id_post: postID,
            id_usuario: userID
        });

        if(verifyInterest === false){
            return res.status(404).send({
                error: 'Você ainda não demonstrou interesse nessa publicação'
            });
        }

        try {
            await deleteEntity('tb_interessados', {
                id_post: postID,
                id_usuario: userID
            });

            return res.status(200).send({
                success: 'Você não tem mais interesse nesse post'
            });
        } catch (err) {
            return res.status(400).send({
                error: 'Erro ao remover interesse'
            });
        }
    }
    async showInteresteds(req, res){
        const { postID } = req.params;

        try {
            const verifyOwner = await knex.select(knex.raw('u.nm_usuario as name, u.img_foto as image'))
            .from(knex.raw('tb_post p, tb_usuario u'))
            .leftJoin('tb_interessados', 'tb_interessados.id_usuario', 'u.cd_usuario')
            .where(knex.raw(`tb_interessados.id_post = p.cd_post and tb_interessados.id_post = ${postID}`));

            return res.status(200).json({
                postID: postID,
                Interesteds: verifyOwner
                
            });


        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Erro ao buscar interessados'
            });
        }


        
    }
}
module.exports = Interested;