//recebendo o pacote sendo uma constante parta receber o require express
const express = require('express');  
// pacotes body-parser, nesse caso esta importando esse pacote
const bodyParser = require('body-parser');

//iniciando a função express(core da aplicação)
const app = express();
// primeira apicação para que ele entenda quando enviar o api em pactote jason
app.use(bodyParser.json())
// essa aplicação é para que ele entenda que o pacote que ele está recebendo parametros via URL
app.use(bodyParser.urlencoded({extended: false }));

require('./app/controller/index')(app);
//Porta que queremos ouvir
app.listen(3000);