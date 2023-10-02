const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'usuario' && password === 'senha') {

        res.redirect('/checklist');
    } else {
        res.send('Credenciais inválidas. Tente novamente.');
    }
});

app.get('/checklist', (req, res) => {
    res.render('checklist');
});

app.listen(port, () => {
    console.log(`Servidor em execução em http://localhost:${port}`);
});
