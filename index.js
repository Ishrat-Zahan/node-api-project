//title:uptime monitoring application
//author: Ishrat Zahan


const http = require('http');


const {handleReqRes} = require('./healpers/handleReqRes'); 


const app = {};

app.config = {
    port:3000
};

app.createServer = ()=>{
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, ()=>{
        // console.log(`environment variable is ${process.env.NODE_ENV}`)
        console.log(`Server is running on port ${app.config.port}`);
    });
};


app.handleReqRes = handleReqRes; 

app.createServer();