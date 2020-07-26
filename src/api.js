const express = require('express');
const serverless = require('serverless-http');
const { Router } = require('express');

const app = express();

const mainRouter = express.Router() ;

mainRouter.get('/pefl', (req,res)=>{
    console.log("#### GET main Route")
    res.json({
        "msg": "PEFL is the best"
    })
})

mainRouter.get('/', (req,res)=>{
    console.log("#### GET main Route")
    res.json({
        "msg": "This API works on netlify"
    })
})

app.use('/.netlify/functions/api',mainRouter);

module.exports.handler = serverless(app)