const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');
const imagesUpload = require('../utils/imageUploads');
const imagesDelete = require('../utils/imageDelete');
const imagesUpdate = require('../utils/imageUpdate');
const config = require('../config/config');

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const cryptData = {
    algorithm : 'aes256',
    secret : config.md5HashKey,
    type: 'hex'
}

function encrypt(pass){
    const cipher = crypto.createCipher(cryptData.algorithm, cryptData.secret);
    cipher.update(pass);
    return cipher.final(cryptData.type);
}

function descrypt(pass){
    const dcipher = crypto.createDecipher(cryptData.algorithm, cryptData.secret);
    dcipher.update(pass, cryptData.type);
    return dcipher.final();
}

class User {
    async login(req, res){
        const { cpf_cnpj, pass } = req.body;

        const verifyCpfCnpj = await verifyEntity(
            'tb_usuario', 
            { nm_cpf_cnpj : cpf_cnpj }
            
        );

        if(verifyCpfCnpj === false){
            return res.status(404).send({
                Error: 'Usuário não encontrado'
            })
        }
        const user = await knex('tb_usuario')
            .where('nm_cpf_cnpj', cpf_cnpj)
            .first()
            .select();

        const decryptedPass = descrypt(user.nm_senha);

        if(user){
            if(pass === decryptedPass.toString()){
                const token = jwt.sign({ id: user.cd_usuario }, config.md5HashKey, { 
                    expiresIn: '1d'
                 });

                 const data = {
                    name: user.nm_usuario,
                    nasc: user.dt_nascimento,
                    profilePic: user.img_foto,
                    address: user.nm_endereco,
                    city: user.nm_cidade,
                    personType: user.tp_pessoa,
                    cpf_cnpj: user.nm_cpf_cnpj,
                    bio: user.ds_bio,
                    cover: user.img_capa,
                    phone: user.nr_telefone,
                    token
                 }

                return res.status(200).json({
                    data
                });
            }
            else{
                return res.status(404).send({
                    Error: 'Usuário não encontrado'
                })
            }
        }else{
            return res.status(404).send({
                Error: 'Usuário não encontrado'
            })
        }
    }
    async create(req, res){
        const { 
            nome,
            nascimento,
            foto,
            endereco,
            cidade,
            estado,
            tipoPessoa,
            cpf_cnpj,
            bio,
            capa,
            senha,
            telefone
         } =  req.body;
         
         const verifyUser = await verifyEntity(
            'tb_usuario', 
            { nm_cpf_cnpj: cpf_cnpj }
            
        );

        if(verifyUser === true) {
            return res.status(409).send({
                Error: 'Usuário já existente'
            })
        }

        const profileImg = await imagesUpload('profile-images', foto);
        const coverImg = await imagesUpload('cover-images', capa);

        const encryptedPass = encrypt(senha);

        const user = {
            nm_usuario: nome, 
            dt_nascimento: nascimento,
            img_foto: profileImg,
            nm_endereco: endereco,
            nm_cidade: cidade,
            sg_estado: estado,
            tp_pessoa: tipoPessoa,
            nm_cpf_cnpj: cpf_cnpj,
            ds_bio: bio,
            img_capa: coverImg,
            nm_senha: encryptedPass,
            nr_telefone: telefone
          };



        const trx = await knex.transaction();

        try{
            await trx('tb_usuario').insert(user);
            await trx.commit();
            return res.status(201).json({
                success: 'Registrado Com sucesso',
                usuario: user
            });
        }catch(err){
            console.log(err);
            return res.status(400).send({
                erro: 'Erro ao Cadastrar.'
            });
        }
    }
    async delete(req, res) {
        const { cd } = req.params;

        try {
            deleteEntity('tb_usuario', { cd_usuario: cd });

            return res.status(200).json({
                success: `Sucesso ao deletar o usuário com ID ${cd}`
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                Error: `Erro ao deletar usuário com ID ${cd}`
            });
        }
    }
    async show(req, res){
        const { cd } = req.params;

        const verifyUser = await verifyEntity('tb_usuario', { cd_usuario: cd });

        if(verifyUser === false){
            return res.status(404).send({
                Error: 'Usuário não encontrado'
            })
        }
        try {
            const user = await knex('tb_usuario')
                .where('cd_usuario', cd)
                .first()
                .select();

            return res.status(202).json( user );
        } catch (err) {
            return res.status(400).send({
                Error: 'Falha ao encontrar Usuário'
            });
        }
    }
    async showAll(req, res){
        try {
            const user = await knex('tb_usuario')
                .select();

            return res.status(202).json( user );
        } catch (err) {
            return res.status(400).send({
                Error: 'Falha ao encontrar Usuários'
            });
        }
    }
    async update(req, res){
        const { 
            nome,
            nascimento,
            endereco,
            cidade,
            estado,
            tipoPessoa,
            cpf_cnpj,
            bio,
            senha,
            telefone
         } =  req.body;

         const user = {
            nm_usuario: nome, 
            dt_nascimento: nascimento,
            nm_endereco: endereco,
            nm_cidade: cidade,
            sg_estado: estado,
            tp_pessoa: tipoPessoa,
            nm_cpf_cnpj: cpf_cnpj,
            ds_bio: bio,
            nm_senha: senha,
            nr_telefone: telefone
          };

        const { cd_usuario } = req.params;

        const verifyUser = await verifyEntity(
            'tb_usuario', 
            {cd_usuario: cd_usuario } 
            
        );

        if(verifyUser === false){
            return res.status(404).send({
                Error: 'Usuário não encontrado'
            })
        }
        try {
            await knex('tb_usuario').update( user ).where({ cd_usuario });
            return res.status(200).json({ user });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                Error: 'Falha ao atualizar Usuário'
            });
        }
    }
    async imageUpdate(req, res){
        const { userID } = req.params;
        const { newImage } = req.body;

        const updateImageURL = await imagesUpdate('profile-images', 'img_foto', { cd_usuario:userID }, newImage, 'tb_usuario');
        const updatedImage = {
            img_foto : updateImageURL
        }
        try {
            await knex('tb_usuario').update( updatedImage ).where({ cd_usuario:userID });

            return res.status(200).json({
                success: 'Imagem de perfil atualizada'
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'erro ao selecionar'
            });
        }
    }
    async coverImageUpdate(req, res){
        const { userID } = req.params;
        const { newImage } = req.body;

        const updateImageURL = await imagesUpdate('cover-images', 'img_capa', { cd_usuario:userID }, newImage, 'tb_usuario');

        const updatedImage = {
            img_capa : updateImageURL
        }
        try {
            await knex('tb_usuario').update( updatedImage ).where({ cd_usuario:userID });

            return res.status(200).json({
                success: 'Imagem de perfil atualizada'
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'erro ao selecionar'
            });
        }
    }
}
module.exports = User;