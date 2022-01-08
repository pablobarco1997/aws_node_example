
//const txt           = require('../../sessiones/whatsapp_client/prueba_002.js');
const fs            = require('fs'); 
const socket        = require('socket.io');


class ClassIOsocket{
    

    constructor(server){
        
        this.IO = socket(server, {
            cors: {
                origin: '*',
                methods: ["GET", "POST"] 
              }
        }); 

        this.connecionSocket = null; 
    }

    RunnigServerIO(){

        this.IO.on('connection' , (socket) => { 

            this.connecionSocket = socket; 

            console.log('Nuevo Cliente conneccion ' + socket.id);

            socket.emit('server:connect', {response: 'conectado'}); 

            socket.on('File:usersWhat' , (response) => {

                console.log(response); 
                if(response.users != ''){

                    this.FileCreateWhat(response.users);
                } 

            }); 

        }); 

    }


    FileCreateWhat(user_name){

        if(user_name != ''){
            
            let result_file_client_what = fs.readFileSync('./sessiones/wa_client.txt', 'utf8');
            result_file_client_what = result_file_client_what.replace(/sustituir/g, user_name); 
            result_file_client_what = result_file_client_what.replace(/client/g, user_name); 

            var FILE_CONTENT  = result_file_client_what;
            var FILE_PATH     = './sessiones/whatsapp_client/' + user_name + '.js'; 

            fs.writeFile(FILE_PATH , FILE_CONTENT ,  (err) => {
                if(err){

                   this.connecionSocket.emit(user_name + ':FILE_SERVER_ERROR'); 

                }else{

                    this.connecionSocket.emit(user_name + ':FILE_SERVER_WHAT_EXITS');

                    this.GenerarQR(user_name); 
                }
            }); 

        }else{

            // this.connecionSocket.emit(user_name + ':USUARIO_NO_ASIGNADO'); 
        
        }

        
    }


    GenerarQR(user_name){

        const clientWP = require('../../sessiones/whatsapp_client/' + user_name ); 
        clientWP.whatsappClient(this.connecionSocket); 

    }

}

module.exports.ModuleSocket = ClassIOsocket; 