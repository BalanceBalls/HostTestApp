/*///////////////////////////////////////
//Данный модуль взаимодействует с API twinword
//(Поиск предложений содержащих запрашиваемое слово).
//Результаты передаются в модуль input-processor
//для последующей обработки
//////////////////////////////////////*/
var unirest = require('unirest');


module.exports =  function(word_request,callback) {

    unirest.get("https://twinword-word-graph-dictionary.p.mashape.com/example/?entry=" + word_request)
      .header("X-Mashape-Key", "1Zvk6ioF6CmshlIyzmqcKYW9ad4zp1O1DmqjsnVICqj818hPHw")
      .header("Accept", "application/json")
      .end(function (result) {
        if(result.body.result_code !== "200"){
          //console.log(result + ' CONTEXT result');
          callback(true);//Возвращаем результат в input-processor
        }else{
        //  console.log(JSON.stringify(result) + ' CONTEXT result 1');
        callback(null, result);
       }
      });
}
