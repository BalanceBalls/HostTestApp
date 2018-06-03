/*///////////////////////////////////////
//Модуль с маршрутами для GET/POST запросов.
//Данный модуль подключается в файле index.js
//////////////////////////////////////*/
const express = require ('express');
const router = express.Router();
const SearchItem = require('../models/searchRequest');
const api = require('../auth-functions');

//Маршрут к главной странице
router.get('/', function(req, res) {
  //Если авторизован
  if(req.session.user){
    //Выводим из БД историю поиска
    SearchItem.find({ author : req.session.user.name }).then(function(result){
      res.render('pages/index', {dbData : result, user: req.session.user});
      });
	} else {
    //Если не авторизован - направляем на страницу авторизации
		res.render('pages/login');
	}
});

//Запрос поиска информации по слову
router.post("/", function (request, response) {
  //Если авторизован
  if(request.session.user){
    //Считываем запрос
    var responseEntity = response;
    //Обращаемся к API
    var completeResponse = require('../input-processor')(request , function(err, apiResponse){
      //Если запрос выполнен не полностью или выполнен неудачно , не сохраняем его в БД; Выводим старые записи
      SearchItem.find({ author : request.session.user.name }).then(function(result){
        responseEntity.render('pages/index', {dbData : result , currentRequest : apiResponse, user: request.session.user});
      });
      if(!err){
        //Если запрос успешен, сохраняем результат в БД
        apiResponse["author"] = request.session.user.name;
        SearchItem.create(apiResponse).then(function(apiResponse){
          console.log("Search query has been saved to DB");
        });
      }
    });
  }
});

//Маршрут к странице авторизации
router.get('/login', function(req,res){
   res.render('pages/login');
});
//Маршрут к странице регистрации
router.get('/register', function(req,res){
   res.render('pages/register');
});

//Авторизация пользователя
router.post('/login', function(req, res, next) {
  //Если авторизован - направляем на главную
	if (req.session.user) return res.redirect('/')

  console.log(req.body + 'post login called');
  //проверяем по БД данные пользователя
	api.checkUser(req.body)
		.then(function(user){
			if(user){
        console.log('Setting session -/ ' + req.session.user );
        //Записываем данные в сессию
				req.session.user = {id: user._id, name: user.username};
        //Направляем на главную
				res.redirect('/');
			} else {
				return next(error);
			}
		})
		.catch(function(error){
      //можно поиграть с res.status(422).send({error: err.message});
      res.redirect('/login');
      return next(error)
		})

});
//Регистрация нового пользователя
router.post('/register', function(req, res, next) {
  api.createUser(req.body)
  	.then(function(result){
  		console.log("User created")
      //Перенаправляем на страницу авторизации , в случае успешной регистрации
      res.redirect('/login')
  	})
  	.catch(function(err){
  		if (err.toJSON().code == 11000){
  			res.status(500).send("Ooops")
  		}
  	})
});

//Выход из аккаунта
router.get('/logout', function(req, res, next) {
	if (req.session.user) {
		delete req.session.user;
		res.render('pages/login')
	}
});

module.exports = router;
