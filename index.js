const app = require('express')()
const consign = require('consign')
const mongoose = require('mongoose')

require('./config/mongodb')

app.mongoose = mongoose

consign()
    .then('./api')
    .then('./config/middlewares.js')
    .then('./config/routes.js')
    .into(app)

app.listen(3000, () => {
    console.log('Backend executando...')
})