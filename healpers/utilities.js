// Title: Utilities
// Author: Ishrat Zahan

const crypto = require('crypto');
const environment = require('./environment');

const utilities = {};

// Parse JSON to Object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};

// Hash function
utilities.hash = (string) => {
    if (typeof string === 'string' && string.length > 0) {
        return crypto
            .createHmac('sha256', environment.secretKey) // Use secretKey from environment
            .update(string)
            .digest('hex');
    } else {
        return false; // Explicitly return false for invalid input
    }
};
// create random string
utilities.createRandomString = (strlength) => {

    let length = strlength
    length = typeof (strlength) === 'number' && strlength > 0 ? strlength : false;

    if (length) {
        let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';

        for (let i = 1; i <= length; i++) {
            let randomChar = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
            output += randomChar;
        }

        return output;

    } else {
        return false;
    }
};

// Export utilities
module.exports = utilities;
