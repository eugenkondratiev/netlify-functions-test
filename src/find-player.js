const express = require('express');
// const url = require('url');
// const querystring = require('querystring');
const serverless = require('serverless-http');
const { Router } = require('express');

const findPlayerRouter = Router();

const app = express();


const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

findPlayerRouter.get('/:nation/:startPage', urlencodedParser, async (req, res) => {
    console.log("#### GET find-players XXX Route");

    res.json(req.params)
})

findPlayerRouter.get('/', urlencodedParser, async (req, res) => {
    console.log("#### GET find-players Route");
    // const params = url.parse(req.url, true).query;
    // const _q = req.query;
    const { nation: _nation = 170 } = req.query;

    // const _name = params["name"];
    // // console.log(params);
    // console.log("#### body : ", req.body);
    // console.log("#### body json : ", JSON.parse(req.body || {}));

    console.log("####### POST query  : ", req.query);
    console.log("####### POST _nation  : ", _nation);

    const _base = await require('../mongo/get-mongo-data')('allbase', { "nation": +_nation });
    console.log("### info", _base.length)
    res.json(_base)
})

findPlayerRouter.post('/', jsonParser, async (req, res) => {
    console.log("#### POST info Route");
    // const params = url.parse(req.url, true).query;
    // const _q = req.query;
    const { nation: _nation = 170 } = req.query;

    // const _name = params["name"];
    // console.log(params);
    console.log("#### body : ", req.body);
    console.log("#### body json : ", JSON.parse(req.body || {}));

    console.log("####### POST query  : ", req.query);
    console.log("####### POST _nation  : ", _nation);

    // const _base = await require('../mongo/get-mongo-data')('allbase', { "nation": +_nation });
    // console.log("### info", _base.length)
    res.send(200);
})


// module.exports = router
app.use('/.netlify/functions/find-player', findPlayerRouter);

module.exports.handler = serverless(app)