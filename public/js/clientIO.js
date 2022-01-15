

socket.on('disconnect', () => {

    socket.disconnect();
    alert('Ocurrio un error con la connecion al servidor la pagina se refrescara en breve e intentelo de nuevo');

    console.log(ClientWebIO);

});

socket.on(ClientWebIO.users + ':Connect', (response) => {

    alert('Nuevo Cliente Conectado Nombre de db : ' + response.namedb_);

});


socket.on(ClientWebIO.users + ':all' , (response) => {

    alert("Todos los usuario conectado a " + response.response);

});



socket.on(ClientWebIO.users + ':FILE_SERVER_ERROR', () => {

    alert('Error al crear el archivo'); 

});



socket.on(ClientWebIO.users + ':USUARIO_NO_ASIGNADO', () => {

    alert('Usuario no asignado'); 

});


socket.on(ClientWebIO.users + ':FILE_SERVER_WHAT_EXITS', () => {

    alert('File Creado WHATSAPP'); 

});


socket.on(ClientWebIO.users + ':SEND_WHATSAPP_QR', (response) => {

    $("#what_qr_template").addClass('hide'); 
    Generate_qr(response);

});

socket.on(ClientWebIO.users + ':send_what_session_authe' , (response) => {

    alert(response.msg);
    $("#what_qr_template").removeClass('hide');
    Generate_qr(null, true);
});


socket.on(ClientWebIO.users + ':enviar_mensaje_whatsap' , (response) => {

    alert(response.msg);
});