//title: Not Found Handler
//author: Ishrat Zahan

const handler = {};

handler.notFoundHandeler = (requestProperties, callback) => {
    callback(404, {
        message: 'not found',
    });
};

module.exports = handler.notFoundHandeler; // Correctly export the `notFoundHandeler` function
