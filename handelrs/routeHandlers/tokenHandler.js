// Title: Token Handler
// Author: Ishrat Zahan

const data = require('../../lib/data');
const { hash } = require('../../healpers/utilities');
const { createRandomString } = require('../../healpers/utilities');
const { parseJSON } = require('../../healpers/utilities');


const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method.toLowerCase()) > -1) {
        handler._token[requestProperties.method.toLowerCase()](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed',
        });
    }
};

handler._token = {};

// Define the handlers for different HTTP methods
handler._token.post = (requestProperties, callback) => {
    // Validate phone and password
    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone && password) { // Use '&&' instead of '&'
        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                const hashedPassword = hash(password);

                if (hashedPassword === parseJSON(userData).password) {
                    const tokenId = createRandomString(20);
                    const expires = Date.now() + 60 * 60 * 1000;
                    const tokenObject = {
                        phone,
                        expires,
                        id: tokenId,
                    };

                    // Store the token
                    data.create('tokens', tokenId, tokenObject, (err) => {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {
                                message: 'Could not create token',
                            });
                        }
                    });
                } else {
                    callback(403, {
                        message: 'Incorrect password',
                    });
                }
            } else {
                callback(404, {
                    message: 'User not found',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Missing required fields',
        });
    }
};


handler._token.get = (requestProperties, callback) => {


};

handler._token.put = (requestProperties, callback) => {




};

handler._token.delete = (requestProperties, callback) => {


};

module.exports = handler;
