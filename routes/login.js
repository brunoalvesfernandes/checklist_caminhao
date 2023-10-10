const router = require('express').Router()

router.post('/', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'usuario' && password === 'senha') {

        res.redirect('/checklist');
    } else {
        res.render('login', { error: 'Credenciais inválidas. Tente novamente.' });
    }
});


module.exports = router