
const what      = require('../whatClient/ClassWhatsappClient.js');

class createClientIO {

    constructor(MysqlConnect){

        this.db = MysqlConnect;
        this.whatClient = new  what.ClientWhat_(MysqlConnect);
    }

    nuevoClientConnect(IO, data = {  userClinica: "" , numberPhone:"",  io_id: "" }){

        var Mysql = this.db;
        let Linka = "DELETE FROM `clinica_connect_io_db` WHERE (`rowid` > 0) and clinica_name_db = '"+data.userClinica+"' ";
        Mysql.query_(Linka, 'sch_developers' , function (err, result, fields) {
            if(!err){
                let Linkb = "INSERT INTO clinica_connect_io_db (clinica_name_db, number_phone , connect_io) VALUES ('"+data.userClinica+"', '"+data.numberPhone+"' , '"+data.io_id+"' )";
                Mysql.query_(Linkb, 'sch_developers', function (err, result, fields) {
                    // console.log(result);
                });
            }else{

            }
        });

    }

    //inicializa el cliente whatsapp
    initializeWhatClient(IO, dataIO){
        this.whatClient.ListenIOwhat(IO, dataIO['namedb_']);
    }


    //se envia los mensaje para los clientes seleccionados
    SendMessage(IO, dataIO, dataPhone = {message: null , phone: null }){
        this.whatClient.send_message_what_client(IO, dataIO['namedb_'], dataPhone.message, dataPhone.phone );
    }


}

module.exports.createClient = createClientIO;