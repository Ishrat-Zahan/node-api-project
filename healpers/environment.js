//title:Environment
//author: Ishrat Zahan


const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'secretKey',
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'secretKeyProduction',
};


//determine which environment was passed
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';


//export corresponding environment object
const environtmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

//export the environment object
module.exports = environtmentToExport;