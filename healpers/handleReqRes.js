//title:uptime monitoring application
//author: Ishrat Zahan

const handler = {};


const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const {notFoundHandeler} = require('../handelrs/routeHandlers/notFoundHandeler')


handler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    // console.log(parsedUrl);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    // console.log(trimmedPath);
    const method = req.method.toLowerCase();
    // console.log(method);
    const queryStringObject = parsedUrl.query;
    // console.log(queryStringObject);
    const headersObject = req.headers;
    // console.log(headersObject);

    const requestProperties ={
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,

    }

    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimmedPath] ?  routes[trimmedPath] : notFoundHandeler;

    chosenHandler(requestProperties,(statusCode, payload)=> {
        statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
        payload = typeof(payload) === 'object'? payload : {};

        const payloadString = JSON.stringify(payload);

        res.writeHead(statusCode);
        res.end(payloadString);

    });

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);

    });

    req.on('end', () => {
        realData += decoder.end();
        // console.log(realData);

        res.end('Hello ishrat');
    })


};

module.exports = handler;