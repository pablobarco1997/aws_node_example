
const express       = require('express');
const cors          = require('cors');  
const socket        = require('./modules/socket.io_/io.js');
const MysqlLink     = require('./modules/mysql/mysql_.js');

const app           = express();

//Control de accesos HTTP o CORS
const cors_setting = {
    origin               : '*',
    //origin               : 'http://ec2-18-117-195-56.us-east-2.compute.amazonaws.com/', 
    credentials          : true,            //access-control-allow-credentials:true
    optionSuccessStatus  : 200
}; 

app.get('/', (req, res) => {
    console.log('Hola'); 
}); 

app.use(cors(cors_setting)); 

app.set('port' , 3000); 

app.use(express.urlencoded({extended: false})); 

app.use(express.json()); 


const server = app.listen(app.set('port'), () => {
    console.log('Desde la carpeta Server runing port ' + app.set('port')); 
}); 


//import mysql
const db   = MysqlLink;

//Connect Socket
const IO =  new socket.ModuleSocket(server, db);

IO.RunnigServerIO();

process.on('unhandledRejection', function(err){
    console.log(err); 
}); 

