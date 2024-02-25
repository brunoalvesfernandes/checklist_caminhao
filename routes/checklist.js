const router = require('express').Router()
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const dbConfig = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};

let con;

function handleDisconnect() {
    con = mysql.createConnection(dbConfig);

    con.connect(function (err) {
        if (err) {
            setTimeout(handleDisconnect, 2000);
        } else {

        }
    });

    con.on('error', function (err) {
        console.log('Erro de conexão:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); // Reconectar em caso de conexão perdida
        } else {
            throw err;
        }
    });
}

handleDisconnect();

router.get('/', isAuth, (req, res) => {
    res.render('checklist', { data: req.session.quest });
});

// checklist/enviar-foto
router.post('/enviar-foto', (req, res) => {
    const imgData = req.body.foto;
    const nome = req.session.user.login + "_" + Date.now() + ".jpg"; // Usando Date.now() para obter a data atual em milissegundos

    // Decodificar a imagem base64
    const base64Data = imgData.replace(/^data:image\/jpeg;base64,/, "");

    // Salvar a imagem na pasta /errors
    fs.writeFile(`./public/errors/${nome}`, base64Data, 'base64', function(err) {
        if (err) {
            console.error(err);
            res.json({ error: true, message: 'Erro ao salvar a imagem' });
        } else {
            // Retorna o nome da imagem
            res.json({ error: false, fotoName: "errors/"+nome });
        }
    });
});

// checklist/update-quest
router.post('/update-quest', (req, res) => {
    const quest = req.body.quest;

    // Salvar a imagem na pasta /errors
    updateQuest(quest, (err, sucess)=>{
        if (err) {
            console.error(err);
            res.json({ error: true});
        } else {
            // Retorna o nome da imagem
            res.json({ error: false});
        }
    });
});

// checklist/select-quest
router.get('/select-quest', (req, res) => {
    const query = "SELECT * FROM checklist";

    con.query(query, function (error, result) {
        if (error) {
            res.json({ error: true, quest: [{}]});
        }
        if(result[0]){
            res.json({ error: false, quest: result[0]});
        }else {
            res.json({ error: true, quest: [{}]});
        }
    });
});

// checklist/sendres
router.post('/sendres', (req, res) => {
    const resp = req.body.info;
    const user = req.session.user.login;
    const data = diaData()
    updateDayRes(user, data, resp, (error, row)=>{
        if(error){
            return res.json({error: error})
        }
        return res.json({error: false})
    })
});

// checklist/updatePerfilImg
router.post('/updatePerfilImg', (req, res) => {
    if (req.session.user) {
        const user = req.session.user.login;
        const imgData = req.body.foto;
        const nome = req.session.user.login + ".jpg"; // Usando Date.now() para obter a data atual em milissegundos

        // Decodificar a imagem base64
        const base64Data = imgData.replace(/^data:image\/jpeg;base64,/, "");

        // Salvar a imagem na pasta /errors
        fs.writeFile(`./public/images/users/${nome}`, base64Data, 'base64', function(err) {
            if (err) {
                console.error(err);
                return res.json({ error: 'Erro ao salvar a imagem'});
            } else {
                updatePicture(user, "images/users/"+nome, (error, row)=>{
                    if(error){
                        req.session.user.avatar = "images/users/"+nome;
                        return res.status(500).json({ error: 'Erro interno do servidor ao salvar o arquivo no banco de dados' });
                    }
                    return res.json({ error: false});
                });
            }
        });
    } else {
        res.status(403).json({ error: 'Usuário não autenticado' });
    }
});

function updatePicture(user, fileName, cb){
    const query = "UPDATE users SET avatar = ? WHERE login = ?";
    const value = [fileName, user];

    con.query(query, value, function (error, result) {
        if (error) {
            console.log(error);
            return cb(error, null);
        }
        return cb(null, result);
    });
}

function updateDayRes(user, date, res, cb){
    const query = "INSERT INTO inspec (user, date, res) VALUES (?, ?, ?)";

    // Valores a serem inseridos nas colunas
    const value = [user, date, res];

    con.query(query, value, function (error, result) {
        if (error) {
            console.log(error);
            return cb(error, null);
        }
        return cb(null, result);
    });
}

function updateQuest(quest, cb){
    const query1 = "SELECT * FROM checklist";
    const query2 = "UPDATE checklist SET quest = ?";
    const query3 = "INSERT INTO checklist (quest) VALUES (?)";
    // Valores a serem inseridos nas colunas
    const value = [quest];
   
    con.query(query1, function (error, result) {
        if (error) {
            console.log(error);
            return cb(error, null);
        }
        if(result[0]){
            con.query(query2, value, function (error, result) {
                if (error) {
                    console.log(error);
                    return cb(error, null);
                }
                return cb(null, result);
            });
        }else {
            con.query(query3, value, function (error, result) {
                if (error) {
                    console.log(error);
                    return cb(error, null);
                }
                return cb(null, result);
            });
        }
    });

    
}

function isAuth(req, res, next) {
    if (req.session.user) {

        const dataFormatada = diaData()

        const query = `SELECT * FROM inspec WHERE user = ? AND date = ?`
        const value = [req.session.user.login, dataFormatada]

        const query2 = `SELECT * FROM checklist`

        con.query(query, value, function (error, rows) {
            if (error) {
                console.log(error);
            }
            if (rows[0])
                res.redirect('/')
            else {
                con.query(query2, function (error, rows2) {
                    if (error) {
                        console.log(error);
                    }

                    if (rows2[0]) {
                        req.session.quest = rows2[0].quest
                        next()
                    } else {
                        req.session.quest = {}
                        next()
                    }
                });

            }
        });
    } else {
        res.redirect('/')
    }
}

function diaData() {
    const data = new Date();

    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda, se necessário
    const dia = data.getDate().toString().padStart(2, '0'); // Adiciona zero à esquerda, se necessário

    const dataFormatada = `${ano}-${mes}-${dia}`;

    return dataFormatada
}



module.exports = router