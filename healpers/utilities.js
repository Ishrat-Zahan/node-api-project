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

// Export utilities
module.exports = utilities;
