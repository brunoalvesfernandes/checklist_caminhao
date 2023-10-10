const router = require('express').Router()

router.get('/', (req, res) => {
    res.render('checklist');
});


module.exports = router