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

findPlayerRouter.get('/:nation/', urlencodedParser, async (req, res) => {
    console.log("#### GET find-players XXX Route");
    let _resp = null;
    const { nation} = req.params;

    try {
        const { limit: _limit = 100, start: _start = 0} = req.query;
        console.log("####### get nation query  : ", req.query);
        console.log("####### get nation params : ", req.params, "  nation = ", nation, +nation, +nation ? { "nation": +nation } : {});
    console.log("#### GET find-players nation  Route");

        const _resp = await require('../mongo/get-mongo-data')('allbase', +nation ? { "nation": +nation } : {}, { limit: +_limit || 100, start: _start || 0 });
        console.log("### info", _resp && _resp.length)
    } catch (error) {
        _resp = error.message;
    }
    finally {

    }

    res.json(_resp)
})

findPlayerRouter.get('/', urlencodedParser, async (req, res) => {
    console.log("#### GET find-players Route");
    // const params = url.parse(req.url, true).query;
    // const _q = req.query;
    const { limit: _limit = 10, start: _start = 100 } = req.query;

    // const _name = params["name"];
    // // console.log(params);
    // console.log("#### body : ", req.body);
    // console.log("#### body json : ", JSON.parse(req.body || {}));

    console.log("####### POST query  : ", req.query);
    // console.log("####### POST _nation  : ", _nation);

    const _base = await require('../mongo/get-mongo-data')('allbase', {}, { limit: +_limit || 10, start: _start || 100 });
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