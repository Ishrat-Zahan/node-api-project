//title:Sample Handler
//author: Ishrat Zahan

const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Not Found',
    });
};

module.exports = handler;