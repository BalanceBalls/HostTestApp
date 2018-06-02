/*///////////////////////////////////////
//Модель данных для поискового запроса
//Состоит из полей:
// - предложения содержащие запрашиваемое слово
// - изображения, соотносящиеся с запрашиваемым словом
// - запрашиваемое слово
//////////////////////////////////////*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create ninja Schema & model
const SearchItemSchema = new Schema({
    dataAr: {
        type: Array,
        required: [true, 'Data array is required']
    },
    imageAr: {
        type: Array,
        required: [true, 'Image array is required']
    },
    queryData: {
        type: String,
        required: [true, 'Query data field is required']
    }
    // add in geo location
});

const SearchItem = mongoose.model('searchItem', SearchItemSchema);

module.exports = SearchItem;
