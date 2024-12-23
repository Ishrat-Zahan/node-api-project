// Title: User Handler
// Author: Ishrat Zahan

const data = require('../../lib/data');
const { hash } = require('../../healpers/utilities');
const { parseJSON } = require('../../healpers/utilities');


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

    if(phone){

        //look upthe user
        data.read('users',phone,(err,u) => {
            
            const user ={ ... parseJSON(u)};
            if(!err && user) {

                delete user.password;
                callback(200, user);

            }else{

                callback(404, {error: 'User not found'});
            }
        })


    }else{
        callback(400, {error: 'Missing required field'});
        return;
    }



};

handler._user.put = (requestProperties, callback) => {
    callback(200, {
        message: 'PUT request was successful',
    });
};

handler._user.delete = (requestProperties, callback) => {
    callback(200, {
        message: 'DELETE request was successful',
    });
};

module.exports = handler;
