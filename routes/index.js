const { Router } = require('express');
const router = Router();
const fs = require('fs')
const path = require('path');
const basename = path.basename(module.filename);


router.get('/', (req, res) => {
    res.send('Hive API')
})

// Reads current directory and adds routes to router
fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0)
            && (file !== basename)
            && (file.slice(-3) === '.js')
            && (file.split('.').length === 2)
    })
    .forEach(file => {
        file = file.split('.')
        const route = '/' + file[0]
        router.use(route, require('.' + route))
    });

module.exports = router;