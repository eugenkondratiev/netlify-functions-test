const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');

const serverless = require('serverless-http');
const { Router } = require('express');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mainRouter = express.Router();

mainRouter.get('/pefl', (req, res) => {
    console.log("#### GET main Route")
    res.json({
        "msg": "PEFL is the best"
    })
})

mainRouter.get('/info', async (req, res) => {
    console.log("#### GET info Route");

    const _info = await require('../mongo/get-mongo-data')('info', { players: { $exists: true } });
    console.log("### info", _info)
    res.json(_info)
})

mainRouter.get('/find-players', async (req, res) => {
    console.log("#### GET info Route");
    // const params = url.parse(req.url, true).query;
    // const _q = req.query;
    const { nation: _nation = 170 } = req.query;

    // const _name = params["name"];
    // console.log(params);
    console.log("#### body : ", body);

    console.log("####### query  : ", req.query);
    console.log("####### _nation  : ", _nation);




    const _base = await require('../mongo/get-mongo-data')('allbase', { "nation": +_nation });
    console.log("### info", _base.length)
    res.json(_base)
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
        _data = await dataBase.collection('info').find({ players: { $exists: true } }).toArray();
        _data = client.db;
        console.log("### info", _data);
    } catch (error) {
        console.log("mongo-error : ", error);
        _data = "mongo-error : " + error;
    } finally {
        client.close();
        res.json(_data)
        // res.status(200).jsonp(_data)
    }


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