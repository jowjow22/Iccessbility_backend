const knex = require('../models/database');

const verifyEntity = require('../utils/verifyEntity');
const deleteEntity = require('../utils/deleteEntity');

class TypeProdServ{
    async create(req, res){
        const {
            name,
            description
        } = req.body;

        const verifyTypePS = await verifyEntity('tb_tipo_produto_servico',{
            nm_tp_prod_serv: name
        });
    
        if(verifyTypePS === true){
            return res.status(401).send({
                error: "Tipo de produto ou serviço já existente"
            })
        }

        const typePS = {
            nm_tp_prod_serv: name,
            ds_tp_prod_serv: description
        }

        const trx = await knex.transaction();

        try {
            await trx('tb_tipo_produto_servico').insert(typePS);
            await trx.commit();
            
            return res.status(201).json({
                success: 'Cadastrado com sucesso!',
                typePS: typePS
            });
            
        } catch (err) {
            console.log(err)
            return res.status(400).send({
                error:'Erro ao cadastrar'
            })
        }
    }
    async delete(req, res){
        const { typePSID } = req.params;

        const verifyTypePS = await verifyEntity('tb_tipo_produto_servico',{
            cd_tp_prod_serv: typePSID
        });
    
        if(verifyTypePS === false){
            return res.status(404).send({
                error: "Tipo de produto ou serviço inexistente"
            })
        }
        try {
            await deleteEntity('tb_tipo_produto_servico', {
                cd_tp_prod_serv: typePSID
            });

            return res.status(200).send({
                success: 'Tipo de produto ou serviço apagado com sucesso'
            });
        } catch (err) {
            console.log(err);
            return res.status(400).send({
              error:'erro ao deletar'  
            })
        }
    }
    async showAll(req, res){
        try {
            const typePS = await knex('tb_tipo_produto_servico').select();

            return res.status(200).json( typePS );
        } catch (err) {
            console.log(err);
            return res.status(200).send({
                error: 'Erro ao buscar tipos de produtos ou serviços'
            })
        }
    }
    async update(req, res){
        const {
            name,
            description
        } = req.body;

        const { typePSID } = req.params;

        const verifyTypePS = await verifyEntity('tb_tipo_produto_servico',{
            cd_tp_prod_serv: typePSID
        });
    
        if(verifyTypePS === false){
            return res.status(404).send({
                error: "Tipo de produto ou serviço inexistente"
            })
        }

        const typePS = {
            nm_tp_prod_serv: name,
            ds_tp_prod_serv: description
        }

        try {
            await knex('tb_tipo_produto_servico').update(typePS).where({
                cd_tp_prod_serv: typePSID
            });
            
            return res.status(200).json({
                success: 'Atualizado com sucesso!',
                typePS: typePS
            });
            
        } catch (err) {
            console.log(err)
            return res.status(400).send({
                error:'Erro ao Atualizar'
            })
        }
    }

}
module.exports = TypeProdServ;