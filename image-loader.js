/*///////////////////////////////////////
//Данный модуль взаимодействует с
//API gettyimages. Изображения
//сохраняются на диск. Имена файлов
//состоят из ID картинки из ответа с API
//////////////////////////////////////*/
var unirest = require('unirest');
var fs = require('fs'),
    request = require('request');
var async = require('async');

module.exports =  function(word_request,callback) {

    unirest.get("https://api.gettyimages.com/v3/search/images?phrase=" + word_request)
      .header("Api-Key", "byjfmr3f8c5rgtwekzfuuhka")
      .end(function (result) {

        var parsedValues = JSON.parse(result.raw_body);

        if(parsedValues.result_count == "0"){
          //Если картинок не нашлось, отправляем error
          callback(true);
        }else{
          var linksArray = [];//массив ссылок на картинки из API
          var fnameArray = [];//массив локальных имен скачанных картинок
          //формируем массив fnameArray
          for (var i = 0 ; i < 2 ; i ++){
            linksArray.push(parsedValues.images[i].display_sizes[0].uri);
            var imageID = parsedValues.images[i].id;
            fnameArray.push(imageID + ".png");
          }

          //скачиваем картинки из linksArray
          download(linksArray ,fnameArray, function(){
            //По окончанию скачивания, возвращаем имена скачанных картинок
            callback(null,fnameArray);//Возвращаем результат в input-processor
          });
        }
    });
}

var download = function(uri, filename, callback){
    var links = uri;
    var names = filename;
    request.head(uri, function(err, res, body){
      //Сохраняем картинки с API
      async.parallel([

      function(callback){
        request(links[0]).pipe(fs.createWriteStream('views/images/' + names[0])).on('close', function(){callback(null,true)});
      },function(callback){
          request(links[1]).pipe(fs.createWriteStream('views/images/' + names[1])).on('close', function(){callback(null,true)});
      }],function(err,result){
        if (result[0] == true && result[1] == true){
          callback(uri);//Сообщаем, что результат готов к отправке в input-processor
        };
      });
    });
  };
