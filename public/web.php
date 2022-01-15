
<?php 

/*
define('HTTP_HOST' , 'http://'.$_SERVER['SERVER_NAME'].'/node_example' ); 
define('DNS_SERVER' , 'http://'.$_SERVER['SERVER_NAME'] );
*/ 



define('HOST_LOCAL', $_SERVER['SERVER_NAME']); 

if(HOST_LOCAL == 'localhost'){

    define('HTTP_HOST' , 'http://'.$_SERVER['SERVER_NAME'] ); 
    define('DNS_SERVER' , 'http://'.$_SERVER['SERVER_NAME'] );

}else{

    define('HTTP_HOST' , 'http://'.$_SERVER['SERVER_NAME'].'/node_example' ); 
    define('DNS_SERVER' , 'http://'.$_SERVER['SERVER_NAME'] );

}


?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

    <script src="<?= HTTP_HOST.'/aws_node_example/public/js/jquery-qrcode-0.18.0.min.js' ?> "></script>

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    <!-- Latest compiled and minified JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

    <!--socket  3000-->
    <script src="<?= DNS_SERVER .':3000/socket.io/socket.io.js' ?>"></script>

    <title>QR</title>
</head>
<body>
    

<div class='container'>
    <div class='form-group' style='margin-top:30px'>
        <blockquote>

            <h3  class="text-center text-bold " style="font-size: 2rem">
                Escanea qr de Whatsapp
                <small>Actualizar codigo qr</small>
                <a class="btn btn-xs btn-default" href="#" role="button" id="btWhatsappQr" > 
                    <i class="fab fa-whatsapp" style='font-size: 3rem'></i>
                </a>

                <button class="btn btn-xs btn-default" id="SendExampleWhatClient">Enviar mensaje de prueba 0987722863</button>
            </h3>

            <p class="text-center">
                <i style="padding: 30px" id="what_qr_template" class=" fab fa-5x fa-whatsapp"></i>
            </p>

            <div id="qr_template"  style='width: 400px; margin: 0px auto;'></div>

            <small class="text-center">Esta acción habilita el envió de WhatsApp a los modulos Asociados</small>


        </blockquote>
    </div>
</div>


</body>
</html>


<script>

    var URL = new URLSearchParams(window.location.search);

    $(document).ready(function () {

        if( !URL.has('client') || !URL.has('number_phone') ){
                alert('Ingrese un usuario por la URL client=? && number_phone=?');
            return false;
        }

    });

    var ClientWebIO  =  { users: URL.get('client') ,  IO: null , url: "<?= HTTP_HOST ?>" + ":3000", phone: URL.get('number_phone')};

    const URLIO = "<?= DNS_SERVER ?>" + ":3000";

    var parametrosIOConnect = {
        namedb_: ClientWebIO.users ,
        numberPhone :  ClientWebIO.phone
    };

    const socket =  io.connect(URLIO, { query: 'dataUserClinica=' + JSON.stringify(parametrosIOConnect) } );

    const  qroption = (texto) => {

            return {
                render: 'div',
                minVersion: 1,
                maxVersion: 40,
                ecLevel: 'L',
                left: 0,
                top: 0,
                size: 400,
                fill: '#000',
                background: null,
                text: texto,
                radius: 0,
                quiet: 0,
                mode: 0,
                mSize: 0.1,
                mPosX: 0.5,
                mPosY: 0.5,
                label: 'no label',
                fontname: 'sans',
                fontcolor: '#000',
                image: null
            }
    }; 

    function fetchConnectionIO(){

        // ScriptImportar('io');

        // if(FileExistSession(ClientWebIO.users) != null){
        //     alert('Ya una session establecida | Si tiene inconvenientes con el envio de mensajes. actualize la session escaneado whatsapp qr');
        // }

        //socket.emit('File:usersWhat' , { users: ClientWebIO.users });

        socket.emit(ClientWebIO.users + ':app_whatsapp');

        /*
        setTimeout(() => {
            socket.on('server:connect', (response) => {
                ClientWebIO.IO     = socket;
                ScriptImportar('ClientIO'); //se importa script para listen server
                socket.emit('File:usersWhat' , { users: ClientWebIO.users });
                alert('cliente conectado ' + response.response);
            });
        }, 1000);
        */

    }
    
    function FileExistSession(userNameClient) {
        var file_exits = null;
        var File_user_session = "users_" + userNameClient + "_session.json";
        $.ajax({
            url: "<?= HTTP_HOST ?>/aws_node_example/public/controller/File_exits_session.php",
            dataType : "json",
            data: {'accion': 'VALID_FILE' , 'file_exits' : File_user_session},
            type : "GET",
            cache: false,
            async: false,
            complete: function(xhr, status){ },
            success: function (response) {
                if(response['success'] == 'exits'){
                    file_exits = response['success'];
                }
            }
        });
        return file_exits;
    }

    function ScriptImportar(script='', remove=false){
        
        if(script=='io'){ //para esuchar los llamados del servidor  

            /*
            if(remove){

                var ElementScript = document.getElementById('socket_client_io');
                ElementScript.remove();  
            
            }else{
            
                const script = document.createElement('script'); 
                document.head.appendChild(script); 
                script.src   = "< ?= DNS_SERVER ?>" + ":3000/socket.io/socket.io.js";
                script.id    = 'socket_client_io'
            }
            */
        }

        if(script=='ClientIO'){ //para esuchar los llamados del servidor  

            if(remove){

                var ElementScript = document.getElementById('wa_client_socket');
                ElementScript.remove();  
            
            }else{
            
                const script = document.createElement('script'); 
                document.body.appendChild(script); 
                script.src   = "<?= HTTP_HOST ?>" + "/aws_node_example/public/js/clientIO.js";
                script.id    = 'wa_client_socket'
            }
        } 

    }

    function Generate_qr(base64=null, remove=false){
        if(base64!=null){
            $("#qr_template").empty(); 
            $("#qr_template").qrcode(qroption(base64));
        }else{
            if(remove){
                $("#qr_template").empty();
            }
        }
    }

    $("#btWhatsappQr").click(function(){

        fetchConnectionIO(); 
    });

    $("#SendExampleWhatClient").click(function () {

        socket.emit(ClientWebIO.users + ':enviar_mensaje_whatsap', {
            phone: 987722863 ,
            msg: 'Hola mensaje de prueba de confirmacion funcional'
        });

    })


</script>

<!--ClientIO js-->
<script src="<?= DNS_SERVER ?>/aws_node_example/public/js/clientIO.js"></script>