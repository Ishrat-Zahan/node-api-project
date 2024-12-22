//title:Sample Handler
//author: Ishrat Zahan

const handler = {};

handler.aboutHandler = (requestProperties, callback ) => {
    
    callback(200,{
        message: 'this is a about'
    });
};

module.exports = handler;