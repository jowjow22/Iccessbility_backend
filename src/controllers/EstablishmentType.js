const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');

class EstablishmentType {
    async  create(req, res){
        const { nome } = req.body;
        const eType = { nm_tipo: nome };

        const verifyEtype = verifyEntity('tb_tipo_estabelecimento', { nm_tipo : nome });

        if(verifyEtype === true) {
            return res.status(409).send({
                Error: 'Tipo de estabelecimento já existente'
            });
        }

        const trx = await knex.transaction();

        try {
            await trx('tb_tipo_estabelecimento').insert(eType);
            await trx.commit();
            return res.status(201).json({
                success: 'Registrado Com sucesso',
                eType: eType
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                erro: 'Erro ao Cadastrar'
            });
        }
    }
    async delete(req, res){
        const { cd } = req.params;

        try {
            deleteEntity('tb_tipo_estabelecimento', { cd_tp_estabelecimento: cd });

            return res.status(200).json({
                Success: `Sucesso ao excluir tipo de estabelecimento com ID ${cd}`
            });
        } catch (err) {
            console.log(err);

            return res.status(400).send({
                Error: `Erro ao deletar tipo de estabelecimento com ID ${cd}`
            });
        }
    }
    async show(req, res){
        const { cd } = req.params;

        const verifyEtype = await verifyEntity('tb_tipo_estabelecimento', { cd_tp_estabelecimento : cd });

        if(verifyEtype === false){
            return res.status(404).send({
                Error: 'Tipo de estabelecimento não encontrado'
            })
        }
        try {
                const eType = await knex('tb_tipo_estabelecimento')
                .where('cd_tp_estabelecimento', cd)
                .first()
                .select();  

            return res.status(202).json( eType );
        } catch (err) {
            return res.status(400).send({
                Error: 'Falha ao encontrar tipo de estabelecimento'
            });
        }
    }
    async showAll(req, res){
        try {
            const eType = await knex('tb_tipo_estabelecimento')
            .select();  

        return res.status(202).json( eType );
        } catch (err) {
            return res.status(400).send({
                Error: 'Falha ao encontrar tipos de estabelecimento'
            });
        }
    }
    async update(req, res){
        const { cd_tp_estabelecimento } = req.params;
        const { nome } = req.body;
        const eType = { nm_tipo: nome };

        const verifyEtype = verifyEntity('tb_tipo_estabelecimento', { cd_tp_estabelecimento : cd_tp_estabelecimento });

        if(verifyEtype === false) {
            return res.status(404).send({
                Error: 'Tipo de estabelecimento não encontrado'
            });
        }

        try {
            await knex('tb_tipo_estabelecimento').update( eType ).where({ cd_tp_estabelecimento });
            return res.status(200).json({ eType });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                Error: 'Falha ao atualizar tipo de estabelecimento'
            });
        }
    }
}

module.exports = EstablishmentType;