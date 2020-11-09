const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');
const imagesUpload = require('../utils/imageUploads');
const imagesUpdate = require('../utils/imageUpdate');

class Post{
    async create(req,res){
        const {
            name,
            description,
            image,
            type,
            discount,
            val,
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
            qt_desconto: discount,
            val_prod_serv: val,
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

    async delete(req, res){
        const { postID, userID } = req.params;

        const verifyPost = await verifyEntity('tb_post', {
            cd_post:postID,
            id_usuario:userID
        });

        if(verifyPost === false){
            return res.status(404).send({
                error: "Esse Post não existe"
            });
        }

        try {
            await deleteEntity('tb_post', {
                cd_post:postID,
                id_usuario:userID
            });
            return res.status(200).send({
                success: "Post apagado com sucesso"
            });
        } catch (err) {
            console.log(err);

            return res.status(400).send({
                error: 'Erro ao apagar post',
            });
        }
    }
    async update(req, res){
        const { postID, userID } = req.params;
        const {
            name,
            description,
            type,
            discount,
            val,
            status,
            idType
        } = req.body;

        const verifyPost = await verifyEntity('tb_post', {
            cd_post:postID,
            id_usuario:userID
        });

        if(verifyPost === false){
            return res.status(404).send({
                error: 'Esse post não existe'
            });
        }

        const post = {
            nm_titulo: name,
            ds_post: description,
            tp_post: type,
            qt_desconto: discount,
            val_prod_serv: val,
            ds_status: status,
            id_tp_prod_serv: idType
        }


        try {
            await knex('tb_post').update(post).where({
                cd_post:postID,
                id_usuario:userID
            });
            return res.status(201).json({
                success: 'Atualizado com sucesso!',
                post: post
            })
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Erro ao atualizar post'
            });
        }
    }
    async postImageUpdate(req, res){
        const { uID, pID } = req.params;
        const { newImage } = req.body;

        const verifyPost = await verifyEntity('tb_post', { 
            id_usuario: uID,
            cd_post: pID
        });

        if(verifyPost === false){
            return res.status(404).send({
                Error: `Requisição Não Autorizada`
            });
        }

        const updateImageURL = await imagesUpdate('post-images', 'img_post', { cd_post: pID }, newImage, 'tb_post');

        const updatedImage = {
            img_post : updateImageURL
        }
        try {
            await knex('tb_post').update( updatedImage ).where({ cd_post: pID });

            return res.status(200).json({
                success: 'Imagem de seu post foi atualizada'
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'erro ao atualizar'
            });
        }
    }
    async showPosts(req, res){
        const { userID } = req.params;
        const { userCity } = req.body;

        try {
            const posts = await knex(knex.raw('tb_post p, tb_usuario u'))
                                .leftJoin('tb_follow', 'tb_follow.id_usuario', 'u.cd_usuario')
                                .where(knex.raw(`p.id_usuario = tb_follow.id_usuario_segue and
                                tb_follow.id_usuario = ${userID} or
                                p.id_usuario = any (select cd_usuario from tb_usuario where tp_pessoa = 'Jurídica' and nm_cidade = '${userCity}') and
                                p.id_usuario = cd_usuario`))
                                .select('p.*');
            return res.status(200).json(posts);
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Ocorreu um erro ao buscar Posts'
            });
        }

    }
}
module.exports = Post;