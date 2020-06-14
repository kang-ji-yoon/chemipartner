//app.js
var express = require('express');

var path = require('path');

var cors = require('cors');

var hbs = require('express-handlebars');

var app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var routes = require('./router.js');

app.use(cors());

app.listen(8080, '183.101.91.237', function() {
    console.log('익스프레스 서버를 시작했습니다.' + '80');
});


app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use('/', routes);