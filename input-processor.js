/*///////////////////////////////////////
//Данный модуль формирует ответ сервера
//из данных , полученных с API
//(GettyImages и TwinWord)
//Сформированный ответ передается в routes.js
//////////////////////////////////////*/
var async = require('async');

module.exports = function(request,callback){

  if(!request.body) return response.sendStatus(400);
    console.log(request.body);

    //проверяем ввод
    if (/\s/.test(request.body.wordQuery)) {
      var query = request.body.wordQuery.substr(0,request.body.wordQuery.indexOf(' '));  // It has only whitespace
    }else if (!request.body.wordQuery) {
        var query = "Empty!";
    }else{
      var query = request.body.wordQuery;
    }

    console.log("Trimmed string : -- " + query);

    async.parallel([
    //Функция запроса картинок с API
    function(callback){
      var errMsg = null;
      var completeResp1;
      var imageData = require('./image-loader')(query , function(err,result){
      var imageResp = [];
      if(err){
          console.log("Error loading images ---" + err);
          errMsg = "Error";
          callback(errMsg);//предаем данные в аггрегирующую функцию async.parallel
        }else{
          imageResp.push(result[0]);
          imageResp.push(result[1]);
          console.log('Images acquired');
          callback(null, imageResp);//предаем данные в аггрегирующую функцию async.parallel
        }
     });
   },
   //Функция запроса контекста к слову с API
   function(callback){
       var completeResp2;
       var phraseData = require('./context-searcher')(query, function (err,res){
        var errMsg = null;
        //Массив с примерами предложений
        var parsedJson = [];
        //Если API вернул ошибку
        if(err){
            parsedJson.push("No information for this word");
            parsedJson.push("But, I've found some nice pictures!");
        }else{
          var servResp = res.body;
          //Если API вернул запрошенные данные
          for(var i = 0; i < servResp.example.length; i++){
            parsedJson.push(servResp.example[i]);
          }
          console.log('Sentences acquired');
        }
        callback(null,parsedJson);//предаем данные в аггрегирующую функцию async.parallel
    });
  }],
  //Получаем результат двух предыдущих функций и отправляем в роутер
  function (err, results) {
    if(err){
      console.log(JSON.stringify(err) + ' ERR '  );
      var completeResp = { dataAr : ["Ooops.. No matches for the entry.", " Try again buddy! "] ,
                                       imageAr : ['Error.jpg'],
                                       queryData : query};
      callback(true,completeResp);//Возвращаем данные об ошибке в router.js
    }else{
      //result[0] - массив картинок, result[1] - массив предложений
      var completeResp = { dataAr : results[1] , imageAr : results[0], queryData : query};

      if (results[1].length < 3){
        callback(true,completeResp);//Возвращаем ответ в router.js (только изображения)  | нарушение соглашения о коллбэках!
        console.log('TYPE 1')
      }else { callback(null,completeResp);//Возвращаем ответ в router.js (предложения и изображения)
        console.log('TYPE 2');
      };

      console.log(JSON.stringify(results[0]) + '- 1 RESULT 2 - ' + JSON.stringify(results[1]));
    }
    });
  }
