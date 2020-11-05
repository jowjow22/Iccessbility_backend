const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');

class Follow{
    async create(req, res){
        const { uFollowID, uFollowingID } = req.params;

        const follow = {
            id_usuario : uFollowID,
            id_usuario_segue: uFollowingID
        }

        const trx = await knex.transaction();

        try {
            await trx('tb_follow').insert(follow);
            await trx.commit();
            const completeFollow = await knex('tb_follow').where(follow).first().select();
            return res.status(201).json({
                success: 'Registrado Com sucesso',
                follow: completeFollow
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                erro: 'Erro ao seguir'
            });
        }
    }
    async showFollowing(req, res){
        const { userID } = req.params;

        try{
            const following = await knex.select('*')
                                    .from('tb_usuario')
                                    .leftJoin('tb_follow', 'tb_follow.id_usuario_segue', 'tb_usuario.cd_usuario')
                                    .where('id_usuario', userID);
                                    
            return res.status(200).json({
                success: `Você segue ${following.length} outros usuários`,
                followersNum: following.length,
                followers: following
            });

        }catch(err){
            console.log(err);
            return res.status(400).send({
                erro: 'Erro ao buscar seguidores'
            });
        }
    }
    async showFollowers(req, res){
       const { userID } = req.params;

       try{
        const followers = await knex.select('*')
                                .from('tb_usuario')
                                .leftJoin('tb_follow', 'tb_follow.id_usuario', 'tb_usuario.cd_usuario')
                                .where('id_usuario_segue', userID);
                                
        return res.status(200).json({
            success: `Você é seguido por ${followers.length} outros usuários`,
            followersNum: followers.length,
            followers: followers
        });

    }catch(err){
        console.log(err);
        return res.status(400).send({
            erro: 'Erro ao buscar seguidores'
        });
    }
    }

    async unfollow(req, res){
        const { uFollowID, uFollowingID } = req.params;

        const follow = {
            id_usuario : uFollowID,
            id_usuario_segue: uFollowingID
        }

        const verifyFollow = await verifyEntity('tb_follow', follow);

        if(verifyFollow === true) {
            try{
                const deleteFollow = await deleteEntity('tb_follow', follow);

                return res.status(200).send({
                    success: 'Você deixou de seguir esse usuario'
                });
            }catch(err){
                console.log(err);
                return res.status(400).send({
                    Error: 'Ocorreu um erro ao deixar de seguir'
                });
            }
        }else{
            return res.status(404).send({
                Error: 'Você não segue esse usuario'
            });
        }
    }
}
module.exports = Follow;