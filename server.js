require('dotenv').config();
const express = require('express');
const session = require('express-session');
const app = express();
const authRoute = require('./routes/login');
const checklistRoute = require('./routes/checklist');
const dashRoute = require('./routes/dashboard');
const bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));
app.use(session({
    secret: 'some random secret',
    resave: false,
    cookie: {
        maxAge: 60000 * 60 * 24
    },
    saveUninitialized: false,
    name: 'check.oauth2'
}))

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/login', authRoute);
app.use('/dashboard',dashRoute);
app.use('/checklist', checklistRoute);

app.use('/', isAuth);

app.listen(process.env.PORT, () => {
    console.log(`Servidor em execução em ${process.env.WEBSITE}:${process.env.PORT}`);
});

function isAuth(req, res, next) {
    req.session.user ? res.redirect('/dashboard') : res.redirect('/login')
}
