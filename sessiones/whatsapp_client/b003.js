
const users_IO      = 'b003';
const fs            = require('fs');
const { Client }    = require('whatsapp-web.js');
let b003 = null;

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

    console.log('Iniciado b003e whatsapp');

    b003   =  new Client({
        puppeteer: {
            headless: true ,
            args: puppeteer_args
        },
    });

    b003.on('qr', (qr) => {
        console.log(qr); 
        IO.emit(users_IO + ':SEND_WHATSAPP_QR', qr);

    });

    b003.on('authenticated', (sessionD) => {

        console.log(sessionD); 
        var pathSessionUser = './sessiones/session_json/users_' + users_IO + '_session.json'; 
        fs.writeFile(pathSessionUser, JSON.stringify(sessionD), (err) => {
            if (err) {
                console.log(err); 
                IO.emit(users_IO + ':send_what_session_authe', {msg: 'Ocurrio Consulte con soporte o intenlo de nuevo'} );
            }else{
                    //se envia la informacion del b003e para la actualizaion
                    IO.emit(users_IO + ':send_what_session_authe', {msg: 'Información Actualizada'} ); 
            }
        }); 

    });

    b003.on('ready', () => {

        //se envia la informacion del b003e para la actualizaion
        var me_contact = {
            pushname : b003.info.pushname , 
            me: b003.info.me
        };

        IO.emit(users_IO + ':send_what_session_authe', {msg: 'Cliente listo para usar whatsapp'} );
        clDestroy(); 

    });

    b003.on('message', msg => {
        if (msg.body == '!ping') {
            msg.reply('pong');
        }
    }); 

    b003.initialize();
}

function send_menssage(IO, number, msg_){
    
    const contry_code        = "593"; 
    const number_cli         = number.toString().replace(/[- )(]/g, "");  //remueve caracteres imnecesarios
    const code               = "@c.us"; 
    const chat_id            = contry_code + number_cli + code;

    var otraSession     = require('../session_json/users_' + users_IO + '_session.json');

    console.log(otraSession);

    b003      = new Client({
        puppeteer: {
            headless: true ,
            args: puppeteer_args
        },
        session: otraSession
    });

    const msg = msg_; 

    b003.on('ready', () => {
        console.log('ya esta la session'); 
        b003.sendMessage(chat_id, msg)
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

    b003.on('auth_failure', () => {
        console.log("Ocurrio un error de autenticacion");
        IO.emit(users_IO + ':enviar_mensaje_whatsap' , {msg: 'Ocurrio un error con la autenticacion' });
    }); 

    b003.initialize();

}

async function clDestroy(arg='', Timer_ = 2000){
    setTimeout(() => {
        if(b003 != null){
            b003.removeAllListeners();
            b003.destroy();
            console.log('session destroy');
        }
      }, Timer_);
}

//asycn remove eventos
async function cerrarSessionClent( Timer_ = 1000){
    setTimeout(() => {
        if(b003 != null){
            b003.removeAllListeners();
            if(Timer_ != 1000){
                console.log('session cerrada limit de tiempo');
            }
        }
      }, Timer_);
}


module.exports.whatsappClient    = clintWhatsapp; 
module.exports.destroyClientWhat = cerrarSessionClent; 
module.exports.send_menssage     = send_menssage; 

