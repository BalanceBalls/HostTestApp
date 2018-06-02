/*///////////////////////////////////////
//Данный модуль отвечает за идентификацию
//и регистрацию пользователей.
//Функции обращаются к БД для внесения
//или чтения информации
//////////////////////////////////////*/
var mongoose = require('mongoose')
var crypto = require('crypto')
var db = mongoose.connect('mongodb://localhost:27017/SearchHistory')
var User = require('./models/user')

//регистрация пользователя в БД
exports.createUser = function(userData){
	var user = {
		username: userData.name,
		password: hash(userData.password)
	}
	return new User(user).save()
}

exports.getUser = function(id) {
	return User.findOne(id)
}
//проверка пароля при авторизации
exports.checkUser = function(userData) {
	console.log('Check user is called!');
	return User.findOne({username: userData.name})
						 .then(function(doc){
							 if ( doc.password == hash(userData.password) ){
								 console.log("User password is ok");
								 return Promise.resolve(doc)
							 } else {
									return Promise.reject("Error wrong")
								}
							})
}
//хэширование пароля
function hash(text) {
	return crypto.createHash('sha1')
				 .update(text).digest('base64')
}
