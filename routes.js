//title:routes
//author: Ishrat Zahan

const { sampleHandler} = require('./handelrs/routeHandlers/sampleHandler');
const { userHandler} = require('./handelrs/routeHandlers/userHandler');
const { tokenHandler} = require('./handelrs/routeHandlers/tokenHandler');
const { notFoundHandeler } = require('./handelrs/routeHandlers/notFoundHandeler');

const routes ={
    'sample': sampleHandler,
    'user': userHandler,
    'token': tokenHandler,
};

module.exports = routes;