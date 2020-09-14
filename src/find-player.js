const express = require('express');
// const url = require('url');
// const querystring = require('querystring');
const serverless = require('serverless-http');
const { Router } = require('express');

const findPlayerRouter = Router();

const app = express();
const DEFAULT_PLAYERS_LIMIT = 40;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

findPlayerRouter.get('/:nation/', urlencodedParser, async (req, res) => {
    console.log("#### GET find-players XXX Route");
    let _resp = null;
    const { nation } = req.params;

    try {
        const { limit, start: _start = false, count} = req.query;
        const _count = count || (!limit && !_start);
        const _limit = _count ? false : (limit || DEFAULT_PLAYERS_LIMIT);
        console.log("####### get nation query  : ", req.query);
        console.log("####### _limit _start _count  : ", _limit, _start ,_count);

        console.log("####### get nation params : ", req.params, "  nation = ", nation, +nation, +nation ? { "nation": +nation } : {});
        console.log("#### GET find-players nation  Route");

        const answer = await require('../mongo/get-mongo-data')(
            'allbase',
            +nation ? { "nation": nation } : {},
            { limit: +_limit || false, start: _start || false}
        );

        console.log("### resp info", answer );

        // console.log("### resp info", answer && answer.data.length);
        
        _resp = _count ? answer.count : answer;
        // _resp = _count ? answer.length : answer
    } catch (error) {
        _resp = error.message;
        console.log("/:nation/ error", error)
    }
    finally {
        console.log("### finally resp ", _resp)

        res.json(_resp)

    }

})

findPlayerRouter.get('/', urlencodedParser, async (req, res) => {
    console.log("#### GET find-players Route");
    // const params = url.parse(req.url, true).query;
    // const _q = req.query;
    const { limit: _limit = 20, start: _start = false } = req.query;

    // const _name = params["name"];
    // // console.log(params);
    // console.log("#### body : ", req.body);
    // console.log("#### body json : ", JSON.parse(req.body || {}));

    console.log("####### POST query  : ", req.query);
    // console.log("####### POST _nation  : ", _nation);

    const _base = await require('../mongo/get-mongo-data')('allbase', {}, { limit: +_limit || 20, start: _start || false });
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