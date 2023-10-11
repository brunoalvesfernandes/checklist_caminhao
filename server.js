require('dotenv').config();
const express = require('express');
const app = express();
const authRoute = require('./routes/login');
const checklistRoute = require('./routes/checklist');


app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('login', { error: '' });
});

app.use('/login', authRoute);

app.use('/checklist', checklistRoute);

app.listen(process.env.PORT, () => {
    console.log(`Servidor em execução em ${process.env.WEBSITE}:${process.env.PORT}`);
});
