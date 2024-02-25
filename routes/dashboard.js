const router = require('express').Router();
const mysql = require('mysql');

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
        if (err){
            setTimeout(handleDisconnect, 2000);
        }else {
            
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
    if(req.session.user.admin == 1) {
        res.render('dashboard-adm',{data: req.session.user, inspec: JSON.stringify(req.session.inspec), check: JSON.stringify(req.session.check)});
    }else{
        res.render('dashboard',{data: req.session.user});
    }
});

// dashboard/logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao encerrar a sessão:', err);
        } else {
            res.redirect('/login'); // Redirecione para a página de login após o logout
        }
    });
});

// dashboard/inspec
router.get('/inspec', (req, res) => {
    if(req.session.user){
        const data = new Date();

        const ano = data.getFullYear();
        const mes = (data.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda, se necessário
        const dia = data.getDate().toString().padStart(2, '0'); // Adiciona zero à esquerda, se necessário

        const dataFormatada = `${ano}-${mes}-${dia}`;

        getIspec(req.session.user.login, dataFormatada, (error, is)=>{
            if(error)
                return res.json({error: error});

            if(is)
                return res.json({error: false});
            else
                return res.json({error: 'Você ainda não fez inspeção hoje !'});

        });
    }
});

function isAuth(req, res, next) {
    req.session.user ? next() : res.redirect('/')
}

function getIspec(login, data, cb) {
    const query = `SELECT * FROM inspec WHERE user = ? AND date = ?`
    const value = [login, data]

    con.query(query, value, function (error, rows) {
        if (error) {
            console.log(error);
            return cb(error, false);
        }
        if(rows[0])
            return cb(null, true);
        else
            return cb(null, false);
    }); 
}

module.exports = router