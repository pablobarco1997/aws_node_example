

/*
    Solution - Running as root without --no-sandbox is not supported
    https://github.com/pedroslopez/whatsapp-web.js/issues/344


    Enviar parametros por socket io cliente
    https://www.it-swarm-es.com/es/javascript/socket.io-parametros-en-la-conexion/1048210368/

    //usuario especifico o varios usuarios
    https://es.stackoverflow.com/questions/100729/enviar-mensaje-a-un-usuario-en-especifico-en-nodejs-socket-io

 */

const fs            = require('fs'); 
const socket        = require('socket.io');
const ClientesIO    = require('../io_client_connect/clientes_io.js');

class ClassIOsocket{
    

    constructor(server, MysqlConnect){
        
        this.IO = socket(server, {
            cors: {
                origin: '*',
                methods: ["GET", "POST"] 
              }
        }); 

        this.connecionSocket = null;
        this.db = MysqlConnect;
        const IOClientes       = new ClientesIO.createClient(MysqlConnect);
        this.IOclientesConnect = IOClientes;


        //this.ClientWhat_ =  new WhatClient_.ClientWhat_(MysqlConnect);

    }


    RunnigServerIO(){

        this.IO.on('connection' , (socket) => {

            //Inicializa el socket
            let dataIO      = JSON.parse(socket.handshake.query.dataUserClinica);
            let user_db     = dataIO['namedb_'];
            let numberPhone = dataIO['numberPhone'];

            //this.ClientWhat_.listenIOwhat(socket); //se listen  whatsapp
            this.connecionSocket = socket;

            //se recrea la coneccion del cliente Se registra la Coneccion con Mysql
            /*this.IOclientesConnect.nuevoClientConnect(socket, {
                userClinica: user_db ,
                numberPhone: numberPhone,
                io_id: socket.id
            }); */

            console.log('Nuevo Cliente conneccion ' + socket.id + " db " + user_db);

            //se inicializa el whatsapp para el usuario
            socket.on(user_db + ':app_whatsapp' , () => {
                this.IOclientesConnect.initializeWhatClient(socket, dataIO);
            });

            //enviar a todos los usuarios
            // socket.on(user_db + ':enviar_mensaje_whatsap' , () => {
            //     this.IO.sockets.emit(user_db + ':Connect' , { namedb_ : user_db});
            // });


            //fetch message send whatsapp
            socket.on(user_db + ':enviar_mensaje_whatsap' , (response) => {
                let message = response.msg;
                let phone   = response.phone;
                this.IOclientesConnect.SendMessage(socket, dataIO, {message: message, phone : phone });
            });


            //solo al que se desconecto socket
            socket.on('disconnect', (reason) => {

                console.log(`client disconnect ${socket.id} due to ${reason} name_db_clinica: ${user_db}`);

                //se cierra session del evento Whatsap
                this.onCloseEventsWhat(user_db);
            });


        });

    }

    //cerrar session o evento del cliente
    onCloseEventsWhat(user_name){

        if(fs.existsSync('./sessiones/whatsapp_client/' + user_name + '.js')){

            const clientWP = require('../../sessiones/whatsapp_client/' + user_name + '.js');
            // clientWP.destroyClientWhat(this.connecionSocket);
        }

    }



}

module.exports.ModuleSocket = ClassIOsocket; 