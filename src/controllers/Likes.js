const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');


class Likes{
    async giveLike(req, res){
        const { postID, userID } = req.params;

        const verifyLike = await verifyEntity('tb_likes', {
            id_usuario: userID,
            id_post: postID
        });

        if(verifyLike === true){
            return res.status(401).send({
                error: 'Você ja curtiu esse post'
            });
        }
        const like = {
            id_usuario: userID,
            id_post: postID
        }
        const trx = await knex.transaction();
        try{
            await trx('tb_likes').insert(like);
            await trx.commit();

            return res.status(201).json({
               success: 'Você curtiu esse post!'   
            })

        }catch(err){
            console.log(err);
            return res.status(400).send({
                error: 'Ocorreu um erro ao curtir este post'
            });
        }
    }
    
    async removeLike(req, res){
        const { postID, userID } = req.params;

        const verifyLike = await verifyEntity('tb_likes', {
            id_usuario: userID,
            id_post: postID
        });

        if(verifyLike === false){
            return res.status(404).send({
                error: 'Você ainda não curtiu esse post'
            });
        }
        try{
            await deleteEntity('tb_likes', {
                id_usuario: userID,
                id_post: postID
            });

            return res.status(200).json({
               success: 'Você removeu sua curtida desse post!'   
            })

        }catch(err){
            console.log(err);
            return res.status(400).send({
                error: 'Ocorreu um erro ao remover curtida deste post'
            });
        }
    }

    async showLikes(req, res){
        const { postID } = req.params;

        const verifyPost = await verifyEntity('tb_post', {
            cd_post: postID
        });

        if(verifyPost === false){
            return res.status(404).send({
                error: 'Esse post não existe'
            });
        }

        try {
            const likes = await knex(knex.raw('tb_usuario u'))
                                .select('u.*')
                                .leftJoin(knex.raw('tb_likes l'), knex.raw('l.id_usuario = u.cd_usuario'))
                                .where({ id_post: postID });

            return res.status(200).json({
                likesNum: likes.length,
                userGivedLike: likes
            })
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error:'Erro ao buscar curtidas dessa publicação'
            })
        }
    }
}
module.exports = Likes;