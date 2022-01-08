<!-- 

    Ejemplos de scripts de Node.js
    También puedes crear un servidor HTTP básico para cargar un sitio.
    https://help.dreamhost.com/hc/es/articles/360043547431-Ejemplos-de-scripts-de-Node-js

    crear script 
    https://stackoverflow.com/questions/9390445/remove-appended-script-javascript

    Ejemplos de Websocket de Node.js con Socket.io
    https://pharos.sh/ejemplos-de-websocket-de-node-js-con-socket-io/

    desconnet socket node js
    https://stackoverflow.com/questions/5048231/force-client-disconnect-from-server-with-socket-io-and-nodejs 

-->

<?php 
    //print $_SERVER['HTTP_REFERER']; 
    //die(); 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <!-- 
        <script src="http://localhost:3000/socket.io/socket.io.js"></script>
    -->
    <script src="<?= 'http://localhost/aws_node_example/public/js/jquery-qrcode-0.18.0.min.js' ?> "></script>
    <title>Generando qr</title>
</head>
<body>
    
    <div style="margin: 15px ; display: block;">
        <table class="" style="width: 50%;">
            <tr>
                <td><button id="GenerarQR_conectar" onclick="conecctarIO()">Generar QR | Conectar</button></td>
                <td>
                    <div id="QR"></div>
                </td>
            </tr>
        </table>
    </div>

    <div style="margin: 15px ; display: block;">
        <table class="" style="width: 50%;">
            <tr>
                <td><button id="btnEnviarMensaje" onclick="" disabled>Enviar Mensaje</button></td>
                <td>
                    <input type="text" placeholder="numero 593" id="number"  disabled>
                </td>
                <td>
                    <input type="text" placeholder="mensaje" id="msg"  disabled>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>


<script>

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

    var clienteWeb  = {}; 
    var clienteWeb  = {
        db      : '', 
        connIO  : null , 
        IO      : null ,
        sessionData : null ,
        clientInfo : null
    };  
     
    function conecctarIO(){ //funcion para connectar al cliente al servidor 
        if(clienteWeb.connIO!=null){
            
            alert('Ya hay una coneccion establecida');  
        }else{

            if(clienteWeb.db==''){
                
                alert('Ud. no puede iniciar no se detecto un usuario'); 
                return false; 

            }else{

                ImportScript('io'); //se importa el io 
                const socketURL = 'http://localhost:3000'; 
                //dentro de un tiempo determinado se lanza una conneccion al servidor
                setTimeout(()=>{ 
                    //se crear una connecion al servidor 
                    const socket =  io.connect(socketURL);
                    //espero recibir el evento conecc
                    socket.on('listen:connect', (response) => { 
                        clienteWeb.connIO = response.id; 
                        clienteWeb.IO     = socket;
                        if(validFileWhat()){ //se valida el archivo 
                            ImportScript('wa_client'); 
                        }else{
                            alert('Ocurrio un error al inicializar el Cliente Whatsapp!!!'); 
                        }
                        console.log(clienteWeb); 
                    });
                },500);
                
                return true; 
            }
        }

    }

    function validFileWhat(){
        var value = false; 
        $.ajax({
            url: 'validFileWebWhatapp.php', 
            type:'GET', 
            data: { FILE_SYSTEM: 'FILE_SYSTEM_WHATSAP' }, 
            dataType:'json', 
            async:false, 
            cache:false,
            beforeSend: function(){
            },
            complete: function(xhr, status){
            }, 
            success: function(response){
                if(response['FILE']=='FILE_EXIST')
                    value = true; 
                if(response['FILE']=='FALSE_EXIST')
                    value = false;
            }
        }); 
        return value; 
    }

    function ImportScript(response, remove=false){  
        if(response=='io'){ //para esuchar los llamados del servidor  
            if(remove){
                var ElementScript = document.getElementById('socket_client_io');
                ElementScript.remove();  
            }else{
                const script = document.createElement('script'); 
                document.head.appendChild(script); 
                script.src   = 'http://localhost:3000/socket.io/socket.io.js';
                script.id    = 'socket_client_io'
            }
        } 
        if(response=='wa_client'){ //para esuchar los llamados del servidor  
            if(remove){
                var ElementScript = document.getElementById('wa_client_socket');
                ElementScript.remove();  
            }else{
                const script = document.createElement('script'); 
                document.body.appendChild(script); 
                script.src   = 'http://localhost/socket_node/server/generar_qr/wa_client_on_socket.js';
                script.id    = 'wa_client_socket'
            }
        } 
    }

    function Link_qr(base64qr=''){
        if(base64qr!=''){
            $("#QR").empty(); 
            $("#QR").qrcode(qroption(base64qr));
        }
    }

    $(document).ready(function(){    
        
        var URL = new URLSearchParams(window.location.search);
        if(!URL.has('client')){
            alert('No hay cliente asignado'); 
            return false; 
        }else{
            if(URL.get('client')==''){
                alert('No se detecta cliente : ' + (URL.get('client')==''?'vacio':URL.get('client')));
                return false; 
            }
            alert('El cliente exite ' + URL.get('client')); 
            clienteWeb.db = URL.get('client'); 
            return true; 
        } 
 

    }); 
</script>