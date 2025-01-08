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

    //check the id no is valid
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if (id) {

        //look upthe user
        data.read('tokens', id, (err, tokenData) => {

            const token = { ...parseJSON(tokenData) };
            if (!err && token) {
                callback(200, token)

            } else {

                callback(404, { error: 'token not found' });
            }
        })


    } else {
        callback(400, { error: 'Missing required field' });
        return;
    }



};

handler._token.put = (requestProperties, callback) => {
    const id = typeof requestProperties.body.id === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;
    const extend = typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true ? true : false;

    if (id && extend) {

        //look upthe user
        data.read('tokens', id, (err, tokenData) => {

            let tokenObject = parseJSON(tokenData);

            if (tokenObject.expires > Date.now()) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;

                //store the update token
                data.update('tokens', id, tokenObject, (err) => {
                    if (!err) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, { error: 'Could not update token' });
                    }
                });

            } else {
                callback(404, { error: 'token not found' });
                return;
            }
        });

    } else {
        callback(400, { error: 'Missing required fields' });
        return;
    }

};

handler._token.delete = (requestProperties, callback) => {
    // Check if the token ID is valid
    const id = typeof requestProperties.queryStringObject.id === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id.trim() : false;

    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete('tokens', id, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'Token deleted successfully',
                        });
                    } else {
                        callback(500, {
                            error: 'Could not delete token',
                        });
                    }
                });
            } else {
                callback(404, {
                    error: 'Token not found',
                });
            }
        });
    } else {
        callback(400, {
            error: 'Invalid token ID',
        });
    }
};


handler._token.verify = (id, phone, callback) => {
    data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            const token = parseJSON(tokenData);
            if (token.phone === phone && token.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;

