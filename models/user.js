/*///////////////////////////////////////
//Модель данных для пользователя
//Состоит из полей:
// - имя пользователя
// - пароль
//////////////////////////////////////*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;
