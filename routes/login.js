require('dotenv').config();
const router = require('express').Router();
/* const mysql = require('mysql');
const con = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
}); */

router.post('/', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'usuario' && password === 'senha') {

        res.redirect('/checklist');
    } else {
        res.render('login', { error: 'Credenciais inválidas. Tente novamente.' });
    }
});


module.exports = router