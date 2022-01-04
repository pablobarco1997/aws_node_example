const express = require('express'); 
const app     = express();



app.get('/' , (req, res) => {
    res.send('Hola mundo Server: 3000'); 
}); 

const server =  app.listen(3000, () => {
    console.log('server 3000'); 
}); 

