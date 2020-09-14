const express = require('express');
// const url = require('url');
// const querystring = require('querystring');
const serverless = require('serverless-http');
const { Router } = require('express');

const basesRouter = Router();

const app = express();
const DEFAULT_PLAYERS_LIMIT = 40;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

basesRouter.get('/clubs/', urlencodedParser, async (req, res) => {
    console.log("#### GET clubs Route");
    let _resp = null;
    // const { nation } = req.params;

    try {
        const { id, name, count } = req.query;
        // const _count = count || (!limit && !_start);
        // const _limit = _count ? false : (limit || DEFAULT_PLAYERS_LIMIT);
        // console.log("####### get clubsquery  : ", req.query);
        // console.log("####### _limit _start _count  : ", _limit, _start ,_count);

        // console.log("####### get nation params : ", req.params, "  nation = ", nation, +nation, +nation ? { "nation": +nation } : {});
        console.log("#### GET clubs nation  Route");
        const _query = {};
        id ? _query._id = parseInt(id) : undefined
        name ? _query.name = name : undefined
        const answer = await require('../mongo/get-mongo-data')(
            'clubs',
            _query,
            { limit: 7000 }
        );

        // console.log("### resp info", answer);

        // console.log("### resp info", answer && answer.data.length);

        _resp = answer;
        // _resp = _count ? answer.length : answer
    } catch (error) {
        _resp = error.message;
        console.log("/clubs/ error", error)
    }
    finally {
        console.log("### finally resp ", _resp)

        res.status(200).json(_resp)

    }

})

basesRouter.get('/nations/', urlencodedParser, async (req, res) => {
    console.log("#### GET nations Route");
    let _resp = null;
    // const { nation } = req.params;

    try {
        const { id, name, count } = req.query;
        // const _count = count || (!limit && !_start);
        // const _limit = _count ? false : (limit || DEFAULT_PLAYERS_LIMIT);
        // console.log("####### get clubsquery  : ", req.query);
        // console.log("####### _limit _start _count  : ", _limit, _start ,_count);

        // console.log("####### get nation params : ", req.params, "  nation = ", nation, +nation, +nation ? { "nation": +nation } : {});
        console.log("#### GET nations nation  Route");
        const _query = {};
        id ? _query._id = parseInt(id) : undefined
        name ? _query.name = name : undefined
        const answer = await require('../mongo/get-mongo-data')(
            'nations',
            _query,
            { limit: 300 }
        );
        _resp = answer;
    } catch (error) {
        _resp = error.message;
        console.log("/nations/ error", error)
    }
    finally {
        console.log("### finally resp ", _resp)
        res.status(200).json(_resp)
    }
})


basesRouter.get('/', urlencodedParser, async (req, res) => {
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


// module.exports = router
app.use('/.netlify/functions/info', basesRouter);

module.exports.handler = serverless(app)