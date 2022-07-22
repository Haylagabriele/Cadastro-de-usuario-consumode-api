// // ROTA DE REGISTRO
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const mailer = require('../../modules/mailer')

// const authConfig = require('../../config/auth.json')

// const User = require('../models/User');

// // classe para definir as rotas só para usuarios
// const router = express.Router();

// function genarateToken(params = {}) {
//  return jwt.sign(params, authConfig.secret,{
//     expiresIn: 86400, 
//     });
    
// }

// // rotas de cadastro para tratar promisses async await
// router.post('/register', async( req, res)=>{
//   const {email} = req.body; 
//   // criar um novo usuario quando ele chamar essa rota
//   try{
//    if (await User.findOne({email}))
//    return res.status(400).send({error: 'user already exists'});
//    // o wait espera o user ser criado
//     // nesse caso ele vai pegar tudo que o usuario esta enviando para esse usuario.create
//     const user = await User.create(req.body);
//     User.password = undefined;

//     return res.send({
//       user,
//       token:genarateToken({id: user.id}),
//     });
//   } catch (err) {
//     return res.status(400).send({ error : 'Registration failed'});// tratamento de erro, caso ocorrar alguma falha no registro o sistema irá mostrar

//   }

// });

// // rota de autenticação
// router.post('/authenticate', async(req, res)=>{
//   const { email, password} = req.body;
//    const user = await User.findOne({ email}).select('+password');

//    if(!user)
//    return res.status(400).send({ error: 'User not found'});

//    if (!await bcrypt.compare(password, user.password))
//    return res.status(400).send({ error: 'invalid password'});
//    user.password = undefined;

// // gerador de Token

// // para apliação ser segura devemos gerar um rest unico para aplicação

//    res.send({ 
//     user,
//     token: genarateToken({ id: user.id}),
//   });

// });

// router.post('/forgot_password', async(req, res)=>{
// const { email } = req.body;

// try{
//   const user = await User.findOne({email});

//   if (!user)
//   return res.status(400).send({ error: 'User not found'});

//   const token = crypto.randomBytes(20).toString('hex');

//   const now = new Date();
//   now.setHours(now.getHours() + 1);

//   await User.findByIdAndUpdate(user.id,{
//     '$set':{
//       passwordResetToken: token,
//       passwordResetExpires:now,
//     }
//   });

//   mailer.sendMail({
//     to: email,
//     from:'haylagabriele@gmail.com',
//     template: 'auth/forgot_password', 
//     context: {token},
//   },(err) => {
//     if (err)
//     return res.status(400).send({error: 'cannot send forgot password email'});
//     return res.send();
   
//   });

// } catch(err){
//   console.log(err);
// res.status(400).send({ error: 'Erro on forgot password , try again'});
// }
// });

// module.exports = app => app.use('/auth', router);
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { jwt_key } = require('../../.env')
const crypto = require('crypto')
const mailer = require('../../modules/mailer')

module.exports = app => {
  
  const { User } = app.app.models.User

  // generate token
  const generateToken = (params = {}) => {
    return jwt.sign(params, jwt_key, {
      expiresIn: 86400
    })
  }

  // register
  const register = async (req, res) => {
    const { email } = req.body

    try {
      if(await User.findOne({ email })) {
        return res.status(400).send({ error: 'User already exists.' })
      }

      const user = new User(req.body)
      await user.save()

      user.password = undefined

      return res.send({ 
        user, 
        token: generateToken({ id: user.id })
      })

    } catch(err) {
      return res.status(400).send({ error: 'Registration failed.' })
    }
  }

  // authenticate
  const auth = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    
    if(!user) {
      return res.status(400).send({ error: 'User not found.' })
    }

    if(!await bcrypt.compare(password, user.password)) {
      return res.status(400).send({ error: 'Invalid password.' })
    }

    user.password = undefined 

    res.send({ 
      user, 
      token: generateToken({ id: user.id })
    })
  }

  // user profile
  const userProfile = async (req, res) => {
    res.send({ ok: true, user: req.userId})
  }

  // forgot password
  const forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
      const user = await User.findOne({ email })

      if(!user)
        return res.status(400).send({ error: 'User not found.'} )

      const token = crypto.randomBytes(20).toString('hex')

      const now = new Date()
      now.setHours(now.getHours() + 1)

      await User.findByIdAndUpdate(user.id, {
        '$set': {
          passwordResetToken: token,
          passwordResetExpires: now
        }
      })

      mailer.sendMail({
        from: 'rodrigoengj@gmail.com',
        to: email,
        subject: 'Link para Resetar sua Senha ✔',
        text: `Utilize o token ${ token } para resetar sua senha`,
      }, (err) => {
        if(err)
          return res.status(400).send({ error: 'Cannot send forgot password email' })

        return res.status(200).send({ message: "Email send successfully" })
      })
      
    } catch(err) {
      console.log(err)
      return res.status(400).send({ error: 'Error on forgot password, try again' })
    }
  }

  // reset password
  const resetPassword = async (req, res) => {
    const { email, token, password } =  req.body

    try {
      const user = await User.findOne({ email })
        .select('+passwordResetToken passwordResetExpires')

      if(!user)
        return res.status(400).send({ error: 'User not found.' })

      if(token !== user.passwordResetToken)
        return res.status(400).send({ error: 'Token invalid.' })

      const now = new Date()

      if(now > user.passwordResetExpires) 
        return res.status(400).send({ error: 'Token expired, generate a new token.'})

      user.password = password

      await user.save()

      res.status(200).send({ message: 'Updated password'})
    } catch (err) {
      res.status(400).send({ error: 'Cannot reset password, try again.' })
    }
  }

  return { register, auth, userProfile, forgotPassword, resetPassword }
}