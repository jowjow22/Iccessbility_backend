const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');
const imagesUpload = require('../utils/imageUploads');

class Post{
    async create(req,res){
        const {
            name,
            description,
            image,
            type,
            status,
            idType,
            idUser
        } = req.body;

        const verifyPost = await verifyEntity('tb_post', {
            nm_titulo:name,
            id_usuario:idUser
        });

        if(verifyPost === true){
            return res.status(401).send({
                error: "Post já Existente"
            });
        }

        const postImage = await imagesUpload('post-images', image);

        const post = {
            nm_titulo: name,
            ds_post: description,
            img_post: postImage,
            tp_post: type,
            ds_status: status,
            id_tp_prod_serv: idType,
            id_usuario: idUser
        }

        const trx = await knex.transaction();

        try {
            await trx('tb_post').insert(post);
            await trx.commit();
            return res.status(201).json({
                success: 'Registrado com sucesso!',
                post: post
            })
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Erro ao criar post'
            });
        }

    }
}
module.exports = Post;