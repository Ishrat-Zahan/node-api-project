//title:routes
//author: Ishrat Zahan

const { sampleHandler} = require('./handelrs/routeHandlers/sampleHandler');
const { userHandler} = require('./handelrs/routeHandlers/userHandler');
const { notFoundHandeler } = require('./handelrs/routeHandlers/notFoundHandeler');

const routes ={
    'sample': sampleHandler,
    'user': userHandler,
};

module.exports = routes;