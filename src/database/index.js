//Criando uma constante mongoose
const mongoose = require('mongoose');

//Criação de consexão ao banco de dados, passando por parametro useMongoCliente para conectar ao mongo
mongoose.connect('mongodb://localhost/noderest');
// classe de promise
mongoose.Promise = global.Promise;

module.exports = mongoose;
