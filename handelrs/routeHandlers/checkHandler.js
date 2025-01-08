// Title: Check Handler
// Author: Ishrat Zahan

const data = require('../../lib/data');
const { hash } = require('../../healpers/utilities');
const { parseJSON, createRandomString } = require('../../healpers/utilities');
const tokenHandler = require('./tokenHandler');
const {maxChecks} = require('../../healpers/environment')


const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method.toLowerCase()) > -1) {
        handler._check[requestProperties.method.toLowerCase()](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed',
        });
    }
};

handler._check = {};

// Define the handlers for different HTTP methods
handler._check.post = (requestProperties, callback) => {
    // Validate inputs
    let protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
            ? requestProperties.body.protocol
            : false;

    let url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;

    let method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'PUT', 'POST', 'DELETE'].indexOf(requestProperties.body.method.toUpperCase()) > -1
            ? requestProperties.body.method.toUpperCase()
            : false;

    let successCodes =
        typeof requestProperties.body.successCodes === 'object' &&
        requestProperties.body.successCodes instanceof Array
            ? requestProperties.body.successCodes
            : false;

    let timeoutSeconds =
        typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
            ? requestProperties.body.timeoutSeconds
            : false;

    if (protocol && url && method && successCodes && timeoutSeconds) {
        let token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;

        // Look up the user phone by reading the token
        data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                let tokenObject = parseJSON(tokenData);
                let userPhone = tokenObject.phone;

                // Look up the user data
                data.read('users', userPhone, (err, userData) => {
                    if (!err && userData) {
                        tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                let userObject = parseJSON(userData);
                                let userChecks =
                                    typeof userObject.checks === 'object' &&
                                    userObject.checks instanceof Array
                                        ? userObject.checks
                                        : [];

                                if (userChecks.length < maxChecks) {
                                    let checkId = createRandomString(20);
                                    let checkObject = {
                                        id: checkId,
                                        userPhone: userPhone,
                                        protocol: protocol,
                                        url: url,
                                        method: method,
                                        successCodes: successCodes,
                                        timeoutSeconds: timeoutSeconds,
                                    };

                                    // Create the check
                                    data.create('checks', checkId, checkObject, (err) => {
                                        if (!err) {
                                            // Add the check ID to the user's object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // Update the user
                                            data.update('users', userPhone, userObject, (err) => {
                                                if (!err) {
                                                    // Return the data about the new check
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, { error: 'Could not update the user with the new check' });
                                                }
                                            });
                                        } else {
                                            callback(500, { error: 'Could not create the new check' });
                                        }
                                    });
                                } else {
                                    callback(400, {
                                        error: 'The user has already reached the maximum number of checks',
                                    });
                                }
                            } else {
                                callback(403, { error: 'Unauthorized' });
                            }
                        });
                    } else {
                        callback(403, { error: 'Unauthorized' });
                    }
                });
            } else {
                callback(403, { error: 'Unauthorized' });
            }
        });
    } else {
        callback(400, { error: 'Missing required fields' });
    }
};

handler._check.get = (requestProperties, callback) => {



};

handler._check.put = (requestProperties, callback) => {

};

handler._check.delete = (requestProperties, callback) => {


};

module.exports = handler;
