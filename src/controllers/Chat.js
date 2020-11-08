const knex = require('../models/database');

const deleteEntity = require('../utils/deleteEntity');

class Chat{
    async sendMessage(req, res){
        const { rem, dest } = req.params;
        const { text } = req.body;

        const message = {
            id_remetente: rem,
            id_destinatario: dest,
            ds_msg: text
        }

        const trx = await knex.transaction();

        try {
            await trx('tb_chat').insert(message);
            await trx.commit();

            return res.status(201).json({
                success: 'Mensagem enviada com sucesso!',
                Message: message
            });
        } catch (err) {
            console.log(err);

            return res.status(400).send({
                error: 'Erro ao enviar mensagem'
            });
        }
    }
    async listChatMessages(req, res){
        const { rem, dest } = req.params;

        try{
            const chatMessages = await knex('tb_chat')
                                       .select()
                                       .where(knex.raw(`id_remetente = ${rem} and id_destinatario = ${dest} or id_remetente = ${dest} and id_destinatario = ${rem} order by dt_msg asc`));
            return res.status(200).json( chatMessages );
        }catch(err){
            console.log(err);
            return res.status(400).send({
                error: 'Ocorreu um erro ao buscar mensagens'
            })
        }

    }
}

module.exports = Chat;