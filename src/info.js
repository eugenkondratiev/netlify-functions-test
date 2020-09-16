const express = require('express');
const serverless = require('serverless-http');
const { Router } = require('express');

const basesRouter = Router();

const app = express();
const DEFAULT_PLAYERS_LIMIT = 40;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json()
const getMongoData = require('../mongo/get-mongo-data');

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
        const answer = await getMongoData(
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
        console.log("#### GET nations nation  Route");
        const _query = {};
        id ? _query._id = parseInt(id) : undefined
        name ? _query.name = name : undefined
        const answer = await getMongoData(
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


basesRouter.get('/bor/:letter/', urlencodedParser, async (req, res) => {
    console.log("#### GET bor Route");
    let _resp = null;
    const { letter } = req.params;
    try {
        // const { id, name, count } = req.query;
        console.log("#### GET bor  Route");
        const _query = {};
        // id ? _query._id = parseInt(id) : undefined
        (letter && letter !== 'all') ? _query._id = letter.toLocaleLowerCase() : undefined
        const answer = await getMongoData(
            'players-bor',
            _query,
            { limit: 300 }
        );
        _resp = answer;
    } catch (error) {
        _resp = error.message;
        console.log("/bor/ error", error)
    }
    finally {
        console.log("### finally resp ", _resp)
        res.status(200).json(_resp)
    }
})



basesRouter.get('/', urlencodedParser, async (req, res) => {
    console.log("#### GET host record");
    console.log("####### POST query  : ", req.query);
    const _host = await getMongoData('info', { host: { $exists: true } }, {});
    console.log("### host", _host)
    res.json(_host)
})

// module.exports = router
app.use('/.netlify/functions/info', basesRouter);

module.exports.handler = serverless(app)