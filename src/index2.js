app.get('/establishmentType', (req, res) => {
    database.select({cd: "cd_tp_estabelecimento"}, {type: "nm_tipo"}).table("tb_tipo_estabelecimento").then(data => {
        return res.json(data);
    }).catch(err => {
        console.log(err);
    });
});
app.post('/establishmentType', (req, res) => {
    var establishmentData = req.body;

    database.insert(establishmentData).into("tb_tipo_estabelecimento").then(data => {
        database.select({cd: "cd_tp_estabelecimento"}, {type: "nm_tipo"}).where({
            cd_tp_estabelecimento : data
        }).table("tb_tipo_estabelecimento").then(data => {
            return res.json(data);
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
});

