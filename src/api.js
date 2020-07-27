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
    mongoClient.client.close();
    res.json(data2)
})

mainRouter.get('/env-test', async (req, res) => {

    const dotenv = require('dotenv');
    dotenv.config();

    console.log("#### GET env-test Route");

    const { MONGODB_URI, MONGODB_DB_NAME } = process.env;
    const data2 = { MONGODB_URI, MONGODB_DB_NAME }
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