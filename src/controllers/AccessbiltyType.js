const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');


class AccessbilityType{
    async create(req, res){
        const { aType } = req.body;

        const verifyAtype = await verifyEntity('tb_acessibilidade', { nm_acessibilidade : aType });

        if(verifyAtype === true){
            return res.status(401).send({
                error: 'Tipo de acessibilidade ja existente'
            });
        }

        const acessibilidade = {
            nm_acessibilidade : aType
        }
        
        const trx = await knex.transaction();

        try {
            await trx('tb_acessibilidade').insert(acessibilidade);
            await trx.commit();
            return res.status(201).json({
                success: 'Tipo de acessibilidade criada',
                accessibility: aType
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Erro ao cadastrar'
            });
        }
    }

    async showAll(req, res){
        try {
            const aType = await knex('tb_acessibilidade')
            .select();  

        return res.status(202).json( aType );
        } catch (err) {
            return res.status(400).send({
                Error: 'Falha ao encontrar tipos de acessibilidade'
            });
        }
    }
    async show(req, res){
        const { cd } = req.params;

        const verifyAtype = await verifyEntity('tb_acessibilidade', { cd_acessibilidade : cd });

        if(verifyAtype === false){
            return res.status(404).send({
                error: 'Tipo de acessibilidade não encontrado'
            });
        }
        try {
                const aType = await knex('tb_acessibilidade')
                .where('cd_acessibilidade', cd)
                .first()
                .select();  

            return res.status(202).json( aType );
        } catch (err) {
            return res.status(400).send({
                Error: 'Falha ao encontrar tipo de acessibilidade'
            });
        }
    }
    async delete(req, res){
        const { cd } = req.params;

        const verifyAtype = await verifyEntity('tb_acessibilidade', { cd_acessibilidade : cd });

        if(verifyAtype === false){
            return res.status(404).send({
                error: 'Tipo de acessibilidade não encontrado'
            });
        }

        try {
            deleteEntity('tb_acessibilidade', { cd_acessibilidade : cd });

            return res.status(200).json({
                success: `Sucesso ao excluir tipo de acessibilidade com ID ${cd}`
            });
        } catch (err) {
            console.log(err);

            return res.status(400).send({
                error: `Erro ao deletar tipo de acessibilidade com ID ${cd}`
            });
        }
    }
    async update(req, res){
        const { cd } = req.params;
        const { aType } = req.body;
        const newAtype = { nm_acessibilidade: aType };

        const verifyAtype = await verifyEntity('tb_acessibilidade', { cd_acessibilidade : cd });

        if(verifyAtype === false) {
            return res.status(404).send({
                error: 'Tipo de acesibilidade não encontrado'
            });
        }

        try {
            await knex('tb_acessibilidade').update( newAtype ).where({ cd_acessibilidade : cd });
            return res.status(200).json({ newAtype });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Falha ao atualizar tipo de acessibilidade'
            });
        }
    }
}
module.exports = AccessbilityType;