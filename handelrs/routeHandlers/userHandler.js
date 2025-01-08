// Title: User Handler
// Author: Ishrat Zahan

const data = require('../../lib/data');
const { hash } = require('../../healpers/utilities');
const { parseJSON } = require('../../healpers/utilities');
const tokenHandler = require('./tokenHandler');



const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method.toLowerCase()) > -1) {
        handler._user[requestProperties.method.toLowerCase()](requestProperties, callback);
    } else {
        callback(405, {
            message: 'Method not allowed',
        });
    }
};

handler._user = {};

// Define the handlers for different HTTP methods
handler._user.post = (requestProperties, callback) => {

    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean' ? requestProperties.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure the user doesn't already exist
        data.read('users', phone, (err, user) => {
            if (err) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };

                // Store the user
                data.create('users', phone, userObject, (err) => {
                    if (!err) {
                        callback(200, { message: 'User created successfully' });
                    } else {
                        callback(500, { error: 'Could not create user' });
                    }
                });
            } else {
                callback(400, { error: 'User already exists' });
            }
        });
    } else {
        callback(400, { error: 'Missing required fields' });
    }
};

handler._user.get = (requestProperties, callback) => {

    //check the phone no is valid
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if (phone) {

        //varify token
        let token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {

                //look upthe user
                data.read('users', phone, (err, u) => {

                    const user = { ...parseJSON(u) };
                    if (!err && user) {

                        delete user.password;
                        callback(200, user);

                    } else {

                        callback(404, { error: 'User not found' });
                    }
                })

            } else {
                callback(403, { error: 'Missing or invalid token' })
                return;
            }
        })

    } else {
        callback(400, { error: 'Missing required field' });
        return;
    }


};

handler._user.put = (requestProperties, callback) => {

    //check the phone no is valid
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;


    if (phone) {


        if (firstName || lastName || password) {

            //look up the user
            data.read('users', phone, (err, u) => {
                const userData = { ...u };
                if (!err && user) {

                    if (firstName) {
                        userData.firstNames = firstName
                    }
                    if (lastName) {
                        userData.lastNames = lastName
                    }
                    if (password) {
                        userData.password = hash(password)
                    }

                    //store to the database
                    data.update('users', phone, userData, (err, userData) => {
                        if (err) {
                            callback(500, { error: 'Could not update user' });
                        } else {
                            callback(200, {
                                message: 'User updated successfully'
                            });
                        }
                    });

                } else {
                    callback(404, { error: 'User not found' });

                }

            })
            callback(200, user);

        } else {

            callback(404, { error: 'User not found' });
        }



    } else {
        callback(400, { error: 'Invalid phone number' });
        return;
    }



};

handler._user.delete = (requestProperties, callback) => {

    //check the phone no is valid
    const phone = typeof requestProperties.queryStringObject.phone === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;
    if (phone) {

        data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                data.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User deleted successfully',
                        });
                    } else {
                        callback(500, {
                            error: 'Could not delete user',
                        });
                    }
                });

            } else {
                callback(404, {
                    error: 'User not found',
                });
                return;
            }
        })

    } else {

        callback(400, {
            error: 'There was a problem',
        });

    }

};

module.exports = handler;
