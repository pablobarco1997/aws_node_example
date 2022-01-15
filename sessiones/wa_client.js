
const users_IO      = 'sustituir';
const fs            = require('fs');
const { Client }    = require('whatsapp-web.js');
let client = null;

let puppeteer_args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu'
];

function clintWhatsapp(IO){

    console.log('Iniciado cliente whatsapp');

    client   =  new Client({
        puppeteer: {
            headless: true ,
            args: puppeteer_args
        },
    });

    client.on('qr', (qr) => {
        console.log(qr); 
        IO.emit(users_IO + ':SEND_WHATSAPP_QR', qr);

    });

    client.on('authenticated', (sessionD) => {

        console.log(sessionD); 
        var pathSessionUser = './sessiones/session_json/users_' + users_IO + '_session.json'; 
        fs.writeFile(pathSessionUser, JSON.stringify(sessionD), (err) => {
            if (err) {
                console.log(err); 
                IO.emit(users_IO + ':send_what_session_authe', {msg: 'Ocurrio Consulte con soporte o intenlo de nuevo'} );
            }else{
                    //se envia la informacion del cliente para la actualizaion
                    IO.emit(users_IO + ':send_what_session_authe', {msg: 'Información Actualizada'} ); 
            }
        }); 

    });

    client.on('ready', () => {

        //se envia la informacion del cliente para la actualizaion
        var me_contact = {
            pushname : client.info.pushname , 
            me: client.info.me
        };

        IO.emit(users_IO + ':send_what_session_authe', {msg: 'Cliente listo para usar whatsapp'} );
        clDestroy(); 

    });

    client.on('message', msg => {
        if (msg.body == '!ping') {
            msg.reply('pong');
        }
    }); 

    client.initialize();
}

function send_menssage(IO, number, msg_){
    
    const contry_code        = "593"; 
    const number_cli         = number.toString().replace(/[- )(]/g, "");  //remueve caracteres imnecesarios
    const code               = "@c.us"; 
    const chat_id            = contry_code + number_cli + code;

    var otraSession     = require('../session_json/users_' + users_IO + '_session.json');

    console.log(otraSession);

    client      = new Client({
        puppeteer: {
            headless: true ,
            args: puppeteer_args
        },
        session: otraSession
    });

    const msg = msg_; 

    client.on('ready', () => {
        console.log('ya esta la session'); 
        client.sendMessage(chat_id, msg)
            .then(response => {
                if(response.id.fromMe){
                    IO.emit(users_IO + ':enviar_mensaje_whatsap' , {msg: 'Mensaje Enviado' });
                    console.log('Mensage  enviado');  
                }else{
                    console.log('Mensage no enviado');
                    IO.emit(users_IO + ':enviar_mensaje_whatsap' , {msg: 'Mensaje No Enviado' });
                }
                clDestroy(); //se destroye la session
        }); 
    }); 

    client.on('auth_failure', () => {
        console.log("Ocurrio un error de autenticacion");
        IO.emit(users_IO + ':enviar_mensaje_whatsap' , {msg: 'Ocurrio un error con la autenticacion' });
    }); 

    client.initialize();

}

async function clDestroy(arg='', Timer_ = 2000){
    setTimeout(() => {
        if(client != null){
            client.removeAllListeners();
            client.destroy();
            console.log('session destroy');
        }
      }, Timer_);
}

//asycn remove eventos
async function cerrarSessionClent( Timer_ = 1000){
    setTimeout(() => {
        if(client != null){
            client.removeAllListeners();
            if(Timer_ != 1000){
                console.log('session cerrada limit de tiempo');
            }
        }
      }, Timer_);
}


module.exports.whatsappClient    = clintWhatsapp; 
module.exports.destroyClientWhat = cerrarSessionClent; 
module.exports.send_menssage     = send_menssage; 

