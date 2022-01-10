const users_IO      = 'prueba_002';  
const fs            = require('fs');
const { Client }    = require('whatsapp-web.js');
let prueba_002; 

function clintWhatsapp(IO){

    var acuSessionEventRemove = 0; 

    console.log('Iniciado prueba_002e whatsapp');

    prueba_002   =  new Client();

    prueba_002.on('qr', (qr) => {
        console.log(qr); 
        IO.emit(users_IO + ':SEND_WHATSAPP_QR', qr); 

        if(acuSessionEventRemove == 1){
            //se remueven los eventos dentro de 20s
            cerrarSessionClent(20000);
        } 

        acuSessionEventRemove++; 
    });

    prueba_002.on('authenticated', (sessionD) => {

        console.log(sessionD); 
        var pathSessionUser = './sessiones/session_json/users_' + users_IO + '_session.json'; 
        fs.writeFile(pathSessionUser, JSON.stringify(sessionD), (err) => {
            if (err) {
                console.log(err); 
                IO.emit(users_IO + ':send_what_session_authe', {msg: 'Ocurrio Consulte con soporte'} );
            }else{
                    //se envia la informacion del prueba_002e para la actualizaion
                    IO.emit(users_IO + ':send_what_session_authe', {msg: 'Información Actualizada'} ); 
            }
        }); 

    });

    prueba_002.on('ready', () => {

        //se envia la informacion del prueba_002e para la actualizaion
        var me_contact = {
            pushname : prueba_002.info.pushname , 
            me: prueba_002.info.me
        } 

        IO.emit(users_IO + ':send_what_session_authe', {accion:'contact', contact: me_contact, use: users_IO} )
        clDestroy(); 

    });

    prueba_002.on('message', msg => {
        if (msg.body == '!ping') {
            msg.reply('pong');
        }
    }); 

    prueba_002.initialize();
}

function send_menssage(number, msg_){
    
    const contry_code        = "593"; 
    const number_cli         = number.toString().replace(/[- )(]/g, "");  //remueve caracteres imnecesarios
    const code               = "@c.us"; 
    const chat_id            = contry_code + number_cli + code; 

    var pathSessionUser = './sessiones/session_json/users_' + users_IO + '_session.json'; 
    var otraSession     = require(pathSessionUser);

    prueba_002      = new Client({
        session: otraSession
    });

    const msg = msg_; 

    prueba_002.on('ready', () => {
        console.log('ya esta la session'); 
        prueba_002.sendMessage(chat_id, msg)
            .then(response => {
                if(response.id.fromMe){
                    clDestroy(); //se destroye la session 
                    console.log('Mensage  enviado');  
                }else{
                    console.log('Mensage no enviado'); 
                }
        }); 
    }); 

    prueba_002.on('auth_failure', () => {
        console.log("Ocurrio un error de autenticacion");  
    }); 

    prueba_002.initialize();

}

async function clDestroy(arg='', Timer_ = 2000){
    setTimeout(() => {
        prueba_002.removeAllListeners();
        prueba_002.destroy(); 
        console.log('session destroy'); 
      }, Timer_);
}

//asycn remove eventos
async function cerrarSessionClent( Timer_ = 1000){
    setTimeout(() => {
        prueba_002.removeAllListeners();
        if(Timer_ != 1000){
            console.log('session cerrada limit de tiempo');
        }  
      }, Timer_);
}


module.exports.whatsappClient    = clintWhatsapp; 
module.exports.destroyClientWhat = cerrarSessionClent; 
module.exports.send_menssage     = send_menssage; 

