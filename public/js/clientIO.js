

(function(){

}); 


ClientWebIO.IO.on('disconnect', () => {
    
    ClientWebIO.IO.disconnect();
    alert('Ocurrio un error con la connecion al servidor la pagina se refrescara en breve e intentelo de nuevo');
    
    ScriptImportar('ClientIO', true); //remueva el wa cliente
    ScriptImportar('io', true); //remueva la connecion

    console.log(ClientWebIO);

}); 


ClientWebIO.IO.on(ClientWebIO.users + ':FILE_SERVER_ERROR', () => { 

    alert('Error al crear el archivo'); 

}); 



ClientWebIO.IO.on(ClientWebIO.users + ':USUARIO_NO_ASIGNADO', () => { 

    alert('Usuario no asignado'); 

}); 


ClientWebIO.IO.on(ClientWebIO.users + ':FILE_SERVER_WHAT_EXITS', () => { 

    alert('File Creado WHATSAPP'); 

}); 


ClientWebIO.IO.on(ClientWebIO.users + ':SEND_WHATSAPP_QR', (response) => { 

    $("#what_qr_template").addClass('hide'); 
    Generate_qr(response);

}); 