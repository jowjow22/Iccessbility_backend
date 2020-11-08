const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');

class EstablishmentAccessbility{
    async create(req, res){
        const { establishmentId, aTypesId } = req.body;

        const verifyEAccessbility = await verifyEntity('tb_estabelecimento_acessibilidade', {
            id_estabelecimento:establishmentId,
            id_acessibilidade:aTypesId
        });

        if(verifyEAccessbility === true){
            return res.status(401).send({
                error: 'Você Já adicionou esse tipo de acessibilidade ao seu estabelecimento'
            });
        }

        const eAccessbility = {
            id_estabelecimento:establishmentId,
            id_acessibilidade:aTypesId
        }

        const trx = await knex.transaction();
        try {
            await trx('tb_estabelecimento_acessibilidade').insert(eAccessbility);
            await trx.commit();
            return res.status(201).json({
                success: 'Tipo de acessibilidade criada',
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                error: 'Erro ao cadastrar'
            });
        }
    }
    async delete(req, res){
        const {  establishmentId, aTypesId  } = req.params;

        const verifyEAccessbility = await verifyEntity('tb_estabelecimento_acessibilidade', {
            id_estabelecimento:establishmentId,
            id_acessibilidade:aTypesId
        });
        
        if(verifyEAccessbility === false){
            return res.status(404).send({
                error: 'Relação não encontrada'
            });
        }
        try{
            await deleteEntity('tb_estabelecimento_acessibilidade', {
                id_estabelecimento:establishmentId,
                id_acessibilidade:aTypesId
            });
            return res.status(200).send({
                success: 'Tipo de acessibilidade desvinculada com sucesso'
            })
        }catch(err){
            console.log(err);

            return res.status(400).send({
                error: `Erro ao desvincular tipo de acessibilidade}`
            });
        }
    }
    async showOne(req,res){
        const {eId} = req.params;

        const verifyEstablishment = await verifyEntity('tb_estabelecimento', {
            cd_estabelecimento: eId
        });

        if(verifyEstablishment === false){
            return res.status(404).send({
                error: "Estabelecimento Inexistente"
            })
        }

        try {
            const aType = await knex.select(knex.raw('e.*, group_concat(nm_acessibilidade) as acessibilidade'))
                                .from(knex.raw('tb_acessibilidade a, tb_estabelecimento e'))
                                .rightJoin('tb_estabelecimento_acessibilidade', 'tb_estabelecimento_acessibilidade.id_estabelecimento', 'e.cd_estabelecimento')
                                .where(knex.raw(`e.cd_estabelecimento = "${eId}"`))
                                .andWhere(knex.raw('tb_estabelecimento_acessibilidade.id_acessibilidade = a.cd_acessibilidade group by nm_estabelecimento'));

        return res.status(202).json(aType);
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                Error: 'Falha ao encontrar tipos de estabelecimento'
            });
        }
    }
    async showInAccessbility(req,res){
        const {aId} = req.params;

        const verifyAccessbility = await verifyEntity('tb_acessibilidade', {
            cd_acessibilidade: aId
        });

        if(verifyAccessbility === false){
            return res.status(404).send({
                error: "Acessibilidade Inexistente"
            })
        }

        try {
            const aType = await knex.select(knex.raw('e.*, group_concat(nm_acessibilidade) as acessibilidade'))
                                .from(knex.raw('tb_acessibilidade a, tb_estabelecimento e'))
                                .rightJoin('tb_estabelecimento_acessibilidade', 'tb_estabelecimento_acessibilidade.id_estabelecimento', 'e.cd_estabelecimento')
                                .where(knex.raw(`cd_estabelecimento = any (select e.cd_estabelecimento 
                                    from tb_acessibilidade as a, tb_estabelecimento as e 
                                    left join tb_estabelecimento_acessibilidade as ea on ea.id_estabelecimento = e.cd_estabelecimento 
                                    where ea.id_acessibilidade = ${aId})`))
                                .andWhere(knex.raw('tb_estabelecimento_acessibilidade.id_acessibilidade = a.cd_acessibilidade group by nm_estabelecimento'));

        return res.status(202).json(aType);
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                Error: 'Falha ao encontrar tipos de estabelecimento'
            });
        }
    }
}

module.exports = EstablishmentAccessbility;