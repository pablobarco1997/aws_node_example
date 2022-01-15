
const mysql = require('mysql');

module.exports.query_ = function (query_, database , callback) {

    try {

        let conf    = {
            host        :  'localhost',
            database    :  database,
            user        :  'root',
            password    :  '',
        };

        var connection = mysql.createConnection(conf);

        connection.connect(function (err) {

            if (err) {
                console.error('Error de conexion: ' + err.stack);
                return;
            }

            console.log('Conectado con el identificador ' + connection.threadId);

        });

        connection.query(query_, function(err, result, fields) {

            if(err)
                throw err;


            callback(err, result, fields);

        });

        connection.end();

    }catch (ex) {
        
    }
};