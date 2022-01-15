

const fs = require('fs');

class ClientWhatsapp_ {

    constructor(MysqlConnect){

        this.db = MysqlConnect;

    }

    ListenIOwhat(IO, user_name){

        this.FileCreateWhat(IO, user_name);
    }

    FileCreateWhat(IO, user_name){

        if(user_name != ''){

            let result_file_client_what = fs.readFileSync('./sessiones/wa_client.js', {encoding:'utf8', flag:'r'} , function(err, data){
                if(err){
                    console.log(err);
                }
                else{
                    console.log(data);
                }
            });

            result_file_client_what = result_file_client_what.replace(/sustituir/g, user_name);
            result_file_client_what = result_file_client_what.replace(/client/g, user_name);

            var FILE_CONTENT  = result_file_client_what;
            var FILE_PATH     = './sessiones/whatsapp_client/' + user_name + '.js';

            fs.writeFile(FILE_PATH , FILE_CONTENT ,  (err) => {
                if(err){

                    IO.emit(user_name + ':FILE_SERVER_ERROR');

                }else{

                    IO.emit(user_name + ':FILE_SERVER_WHAT_EXITS');

                    this.GenerarQR(IO,user_name);
                }
            });

        }else{

            // this.connecionSocket.emit(user_name + ':USUARIO_NO_ASIGNADO');

        }

    }


    GenerarQR(IO, user_name){

        const clientWP = require('../../sessiones/whatsapp_client/'+user_name+'.js');
        clientWP.whatsappClient(IO);

    }

    send_message_what_client(IO, user_name, message, phone){

        //se verifica si el archivo de session existe
        if(fs.existsSync('./sessiones/session_json/users_'+user_name+'_session.json')){
            const clientWP = require('../../sessiones/whatsapp_client/'+user_name+'.js');
            clientWP.send_menssage(IO, phone, message);
        }else{
            IO.emit(user_name + ':enviar_mensaje_whatsap', {msg: 'La session no esta creada'})
        }
    }

}

module.exports.ClientWhat_ = ClientWhatsapp_;