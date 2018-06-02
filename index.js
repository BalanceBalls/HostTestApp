/*///////////////////////////////////////
//Файл инициализации.
//Запускает сервер. Подключает БД.
//Настраивает и инициализирует Express
//////////////////////////////////////*/
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const port = 3000
const mongoose = require('mongoose');

var session = require('express-session')
var MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://localhost:27017/SearchHistory');
mongoose.Promise = global.Promise;

var routes = require('./routes/routes');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('views'));

app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use(session({
  secret: 'sssshhh',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({url: 'mongodb://localhost:27017/SearchHistory'})
}))

app.use('/', routes);

app.use(function(err, req, res, next){
    console.log(err); // to see properties of message in our console
    res.status(422).send({error: err.message});
});
//Слушаем указанный порт
app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});

/*
  Идеи:
  1) Сделать юзерам отдельную историю поиска
  2) Lazy load

  Applicationhost_test
  Key: byjfmr3f8c5rgtwekzfuuhka
  Secret: pqUFG4AHEz2XwZb9qwhZPAnMBJTRw2RVFvuSC4xaE4HCU

  curl -X GET -H "Api-Key: byjfmr3f8c5rgtwekzfuuhka" https://api.gettyimages.com/v3/search/images?phrase=kitties
*/
