
// const mongoose = require('../../database');
// const bcrypt  = require('bcryptjs');

// //Schema é os campos da tabela
// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     require: true,
//   },
//   email:{
//     type: String,
//     unique: true,
//     required: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,// obrigatório
//     select: false,// quando buscar um usuario: para não vim num array de usuario
//   },
//   passwordResetToken: {
//     type: String,
//     select: false,
//   },
//   passwordResetExpires: {
//     type: Date,
//     select: false,

//   },
//   //Anotar a data até quando o registro foi criado
//   createdAt:{
//     type : Date,
//     default : Date.now,
//   },

// });

// UserSchema.pre('save', async function(next) {
//   const hash = await bcrypt.hash(this.password, 10);
//   this.password = hash;

//   next();
// });

// // criando uma constante User, recebendo o mongooge model, recebendo por parametro o model , e o schema
// const User = mongoose.model('User' , UserSchema);
// // transportar o usuario com o model expeorts
// module.exports = User;
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

module.exports = () => {
  const UserSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      select: false
    },
    passwordResetToken: {
      type: String,
      select: false
    },
    passwordResetExpires: {
      type: Date,
      select: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    }
  })

  // encriptando senha antes de salvar no banco
  UserSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, 10)
    }

    next()
  })

  const User = mongoose.model('User', UserSchema)

  return { User }
}