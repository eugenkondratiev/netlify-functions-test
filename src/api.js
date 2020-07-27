const express = require('express');
const serverless = require('serverless-http');
const { Router } = require('express');

const app = express();

const mainRouter = express.Router();

mainRouter.get('/pefl', (req, res) => {
    console.log("#### GET main Route")
    res.json({
        "msg": "PEFL is the best"
    })
})

mainRouter.get('/info', async (req, res) => {
    console.log("#### GET info Route");
    const mongoClient = await require('../mongo/db-mongo')();
    const data2 = await mongoClient._db.collection("info").find({ players: { $exists: true } }).toArray();

    res.json(data2)
})


mainRouter.get('/', (req, res) => {
    console.log("#### GET main Route")
    res.json({
        "msg": "This API works on netlify"
    })
})

app.use('/.netlify/functions/api', mainRouter);

module.exports.handler = serverless(app)