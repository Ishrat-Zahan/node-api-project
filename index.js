//title:uptime monitoring application
//author: Ishrat Zahan


const http = require('http');
const {handleReqRes} = require('./healpers/handleReqRes'); 
const environtment = require('./healpers/environment');
const data = require('./lib/data');


const app = {};

//testing file system
// data.create('test','newfile',{name:'Bangladesh', language:'English'},(err)=>{
//     console.log(err);
// })

// data.read('test','newfile',(err, data)=>{
//     console.log(err,data);
// });

// data.update('test','newfile',{name:'Ishrat', language:'Bangla'},(err)=>{
//     console.log(err);
// })

// data.delete('test','newfile',(err)=>{
//     console.log(err);
// });


app.createServer = ()=>{
    const server = http.createServer(app.handleReqRes);
    server.listen(environtment.port, ()=>{
        // console.log(`environment variable is ${process.env.NODE_ENV}`)
        console.log(`Server is running on port ${environtment.port}`);
    });
};


app.handleReqRes = handleReqRes; 

app.createServer();