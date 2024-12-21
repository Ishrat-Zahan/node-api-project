//title:Sample Handler
//author: Ishrat Zahan

const handler = {};

handler.sampleHandler = (requestProperties, callback ) => {
    
    callback(200,{
        message: 'this is a sample'
    });
};

module.exports = handler;