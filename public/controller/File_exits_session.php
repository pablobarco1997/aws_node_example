

<?php

define('HOST_LOCAL', $_SERVER['SERVER_NAME']);

if(HOST_LOCAL == 'localhost'){

    define('HTTP_HOST' , 'http://'.$_SERVER['SERVER_NAME'] );
    define('DNS_SERVER' , 'http://'.$_SERVER['SERVER_NAME'] );

    define('DOCUMENT_ROOT' , $_SERVER['DOCUMENT_ROOT']);

}else{

    define('HTTP_HOST' , 'http://'.$_SERVER['SERVER_NAME'].'/node_example' );
    define('DNS_SERVER' , 'http://'.$_SERVER['SERVER_NAME'] );
    define('DOCUMENT_ROOT' , $_SERVER['DOCUMENT_ROOT'] . '/node_example');

}


if(isset($_GET['accion']) && isset($_GET['file_exits'])){

    if($_GET['accion'] == 'VALID_FILE' && $_GET['file_exits'] != '' ){

        $success = "";
        $path = DOCUMENT_ROOT . '/sessiones/session_json/'.$_GET['file_exits'];
        if(file_exists($path)){
            $success  = "exits";
        }

        $ouput = array(
            'success' => $success
        );

        echo $ouput;
        die();
    }
}


?>