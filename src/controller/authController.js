const express = require('express');

const User = require('../models/User');

// classe para definir as rotas só para usuarios
const router = express.Router();

// rotas de cadastro para tratar promisses async await
router.post('/register', async( req, res)=>{
  const {email} = req.body; 
  // criar um novo usuario quando ele chamar essa rota
  try{
   if (await User.findOne({email}))
   return res.status(400).send({error: 'user already exists'});
   // o wait espera o user ser criado
    // nesse caso ele vai pegar tudo que o usuario esta enviando para esse usuario.create
    const user = await User.create(req.body);
    User.password = undefined;

    return res.send({user});
  } catch (err){
    return res.status(400).send({ error : 'Registration failed'});// tratamento de erro, caso ocorrar alguma falha no registro o sistema irá mostrar

  }

});

module.exports = app => app.use('/auth', router);