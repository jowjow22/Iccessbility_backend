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
    async showAll(req,res){
        try {
            const eType = await knex.select()
                                .from('tb_acessibilidade', 'tb_estabelecimento')
                                .join('tb_estabelecimento_acessibilidade', 'tb_estabelecimento_acessibilidade.id_acessibilidade', 'tb_acessibilidade.cd_acessibilidade'); 

        return res.status(202).json( eType );
        } catch (err) {
            return res.status(400).send({
                Error: 'Falha ao encontrar tipos de estabelecimento'
            });
        }
    }
}
module.exports = EstablishmentAccessbility;