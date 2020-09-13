const express = require('express');
// const url = require('url');
// const querystring = require('querystring');

const serverless = require('serverless-http');
const { Router } = require('express');

const app = express();

const bodyParser = require('body-parser');

// const jsonParser = bodyParser.json()

// const urlencodedParser = bodyParser.urlencoded({ extended: false })

const mainRouter = express.Router();

mainRouter.get('/pefl', (req, res) => {
    console.log("#### GET main Route")
    res.json({
        "msg": "PEFL is the best"
    })
})

mainRouter.get('/info', async (req, res) => {
    console.log("#### GET info Route");
    try {
        const _info = await require('../mongo/get-mongo-data')('info', { host: { $exists: true } });
        console.log("### info", _info)
        res.json(_info)
    } catch (error) {
        console.log("mongo-error : ", error);
        res.status(500).json(`mongo-error : ${error}`)
    } 
})

mainRouter.get('/pairs', async (req, res) => {
    console.log("#### GET pairs Route");
    try {
        const _pairs = await require('../mongo/get-mongo-data')('info', { pairs: { $exists: true } });
        console.log("### pairs", _pairs)
        res.json(_pairs)
    } catch (error) {
        console.log("mongo-error : ", error);
        res.status(500).json(`mongo-error : ${error}`);
    }

})

mainRouter.get('/db-test', async (req, res) => {
    console.log("#### GET db-test Route");
    const MongoClient = require("mongodb").MongoClient;
    const dotenv = require('dotenv');
    dotenv.config();

    const URI = process.env.MONGODB_URI;
    const DB_NAME = process.env.MONGODB_DB_NAME;
    let _data = null;
    let client = null;

    try {
        client = await MongoClient.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
        const dataBase = await client.db(DB_NAME);
        _data = await dataBase.collection('info').find({ host: { $exists: true } }).toArray();
        // _data = client.db;
        console.log("### info", _data);
    } catch (error) {
        console.log("mongo-error : ", error);
        _data = "mongo-error : " + error;
        res.status(500).json(_data)
    } finally {
        client.close();
        res.json(_data)
    }


})

mainRouter.get('/env-test', async (req, res) => {

    const dotenv = require('dotenv');
    dotenv.config();

    console.log("#### GET env-test Route");

    const { MONGODB_URI, MONGODB_DB_NAME } = process.env;
    const data2 = { MONGODB_URI, MONGODB_DB_NAME }
    res.json({ "env": ["MONGODB_URI", "MONGODB_DB_NAME"] })

})

mainRouter.get('/', (req, res) => {
    console.log("#### GET main Route")
    res.json({
        "msg": "This API works on netlify"
    })
})

app.use('/.netlify/functions/api', mainRouter);

module.exports.handler = serverless(app)