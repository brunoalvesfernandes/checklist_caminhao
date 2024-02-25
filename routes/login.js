require('dotenv').config();
const router = require('express').Router();
const crypto = require('crypto');

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
            // Código para criar a tabela 'usuarios' se não existir
            const createTablesQuery = `
                CREATE TABLE IF NOT EXISTS users (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    login varchar(255) NOT NULL,
                    password varchar(255) NOT NULL,
                    firstName varchar(255) DEFAULT NULL,
                    lastName varchar(255) DEFAULT NULL,
                    truck varchar(255) DEFAULT NULL,
                    token varchar(255) DEFAULT NULL,
                    avatar varchar(255) DEFAULT NULL,
                    admin int(11) NOT NULL DEFAULT 0,
                    PRIMARY KEY (id)
                );
                CREATE TABLE IF NOT EXISTS inspec (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    user varchar(255) DEFAULT NULL,
                    date date DEFAULT NULL,
                    res longtext DEFAULT NULL,
                    PRIMARY KEY (id)
                );
                CREATE TABLE IF NOT EXISTS checklist (
                    id int(11) NOT NULL AUTO_INCREMENT,
                    type varchar(255) DEFAULT NULL,
                    quest longtext DEFAULT NULL,
                    PRIMARY KEY (id)
                );
            `;
    
            const tableCheckQuery = `
                SELECT COUNT(*)
                FROM information_schema.tables
                WHERE table_schema = ? AND table_name = 'users'
            `;
    
            con.query(tableCheckQuery, [process.env.DATABASE], function(err, result) {
                if (err) {
                    console.error("Erro ao verificar a existência da tabela 'users':", err);
                } else {
                    if (result[0]['COUNT(*)'] === 0) {
                        // A tabela 'users' não existe, então a criamos
                        con.query(createTablesQuery, function(err, createResult) {
                            if (err) {
                                console.error("Erro ao criar as tabelas : ", err);
                            } else {
                                console.log("Criando as tabelas, por favor aguarde...");
                                setTimeout(function() {
                                    console.log('\x1b[32m%s\x1b[0m', "Tabela 'users' criada com sucesso.");
                                    setTimeout(function() {
                                        console.log('\x1b[32m%s\x1b[0m', "Tabela 'inspec' criada com sucesso.");
                                        setTimeout(function() {
                                            console.log('\x1b[32m%s\x1b[0m', "Tabela 'checklist' criada com sucesso.");
                                        }, 2000);
                                    }, 2000);
                                }, 2000);
                            }
                        });
                    } else {
                        //console.log("A tabela 'users' já existe.");
                    }
                }
            });
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
    if (req.session.error) {
        res.render('login', {
            error: req.session.error,
            errorTime: 8
        });
    } else {
        res.render('login', {
            error: '',
            errorTime: 0
        });
    }
});

router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Criptografa a senha fornecida pelo usuário com MD5
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    getUserLogin(username, hashedPassword, (error, row)=>{
        if(error){
            req.session.error = "Login ou senha inválida. Tente novamente."
            res.redirect('/login');
        }
        
        let avatar = './images/pp.png'
        if(row[0].avatar != null){
            avatar = row[0].avatar
        }

        if(row.length > 0){
            const user = {
                token: row[0].token,
                login: row[0].login,
                firstName: row[0].firstName,
                lastName: row[0].lastName,
                truck: row[0].truck,
                avatar: avatar,
                admin: row[0].admin
            };

            req.session.user = user;

            // Usando as funções Promise
            Promise.all([getDadosInspec(), getDadosCheck()])
                .then(([inspecData, checkData]) => {
                    if (inspecData && inspecData.length > 0) {
                        // Se inspecData não está vazio
                        req.session.inspec = inspecData;
                    } else {
                        // Se inspecData está vazio ou não existe
                        req.session.inspec = {};
                    }
                    
                    if (checkData && checkData.length > 0) {
                        // Se checkData não está vazio
                        req.session.check = checkData;
                    } else {
                        // Se checkData está vazio ou não existe
                        req.session.check = {};
                    }
                    res.redirect('/dashboard');
                })
                .catch(error => {
                    console.error('Erro ao obter dados:', error);
                    req.session.inspec = {};
                    req.session.check = {};
                    res.redirect('/dashboard');
                });
        }else {
            req.session.error = "Login ou senha inválida. Tente novamente."
            res.redirect('/login');
        }
    })
});

function getUserLogin(username, pass, cb) {
    const query = `SELECT * FROM users WHERE login = ? AND password = ?`;
    const value = [username, pass]

    con.query(query, value, function (error, rows) {
        if (error) {
            console.log(error);
            return cb(error, null);
        }
        return cb(null, rows);
    });
}
// Função para obter dados da tabela 'inspec' e retornar uma Promise
function getDadosInspec() {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM inspec`;
        con.query(query, function (error, rows) {
            if (error) {
                console.error('Erro ao obter dados da tabela inspec:', error);
                reject(error); // Rejeitar a Promise em caso de erro
            } else {
                resolve(rows); // Resolver a Promise com os dados obtidos
            }
        });
    });
}

// Função para obter dados da tabela 'checklist' e retornar uma Promise
function getDadosCheck() {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM checklist`;
        con.query(query, function (error, rows) {
            if (error) {
                console.error('Erro ao obter dados da tabela checklist:', error);
                reject(error); // Rejeitar a Promise em caso de erro
            } else {
                resolve(rows); // Resolver a Promise com os dados obtidos
            }
        });
    });
}

function isAuth(req, res, next) {
    req.session.user ? res.redirect('/dashboard') : next()
}

module.exports = router