//title:routes
//author: Ishrat Zahan

const { sampleHandler} = require('./handelrs/routeHandlers/sampleHandler');
const { notFoundHandeler } = require('./handelrs/routeHandlers/notFoundHandeler');

const routes ={
    'sample': sampleHandler,
}

module.exports = routes;