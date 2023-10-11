require('dotenv').config();
const router = require('express').Router();
const crypto = require('crypto');

const mysql = require('mysql');
const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

con.connect(function(err) {
    if (err){
        console.log('\x1b[31m%s\x1b[0m', "Erro ao se conectar com o banco de dados!");
    }
    // Código para criar a tabela 'usuarios' se não existir
    const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        login VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        truck VARCHAR(255) NOT NULL,
        admin INT NOT NULL DEFAULT 0
    )`;

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
                con.query(createTableQuery, function(err, createResult) {
                    if (err) {
                        console.error("Erro ao criar a tabela 'users':", err);
                    } else {
                        console.log("Criando a tabela, por favor aguarde...");
                        setTimeout(function() {
                            console.log('\x1b[32m%s\x1b[0m', "Tabela 'users' criada com sucesso.");
                        }, 2000);
                    }
                });
            } else {
                //console.log("A tabela 'users' já existe.");
            }
        }
    });

});

router.post('/', (req, res) => {
    const { username, password } = req.body;

    // Criptografa a senha fornecida pelo usuário com MD5
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');

    // Consulta ao banco de dados para encontrar o usuário correspondente
    const query = `SELECT * FROM users WHERE login = ? AND password = ?`;
    con.query(query, [username, hashedPassword], function(err, results) {
        if (err) {
            res.render('login', { error: 'Não existe nenhum usuario com essas credenciais.' });
        } else {
            // Verifica se algum registro foi encontrado
            if (results.length > 0) {
                // As credenciais estão corretas, redireciona para a página '/checklist'
                res.redirect('/checklist');
            } else {
                // Credenciais inválidas, exibe uma mensagem de erro
                res.render('login', { error: 'Login ou senha inválida. Tente novamente.' });
            }
        }
    });
});

module.exports = router