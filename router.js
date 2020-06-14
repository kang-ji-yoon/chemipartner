var router = require('express').Router();

var cors = require('cors');

var path = require('path');

var express = require('express');

var app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

var fs = require('fs');

var bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var jwt = require("jsonwebtoken");

app.use(cors());

var moment = require('moment');

router.get('/', (req, res, next) =>{
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

router.route('/tokenrn').post((req, res)=>{
  console.log('tokenrn 처리함');

  console.log(req.query);

  console.log(req.query.token);

  var token = req.query.token;

  let decoded = jwt.verify(token, "chemipartner!");
  if(decoded){
    res.json(token)
  }
  else{
    var token = jwt.sign({
      name: "chemipartenr"
    },
    "chemipartner!",
    {
      subject: "chemipartner token",
      expiresIn: '60m',
      issuer: "chemipartner"
    });
    console.log("토큰생성\n", token);

    res.json(token);
  }
  
});

router.route('/adminout').post((req, res)=>{
  console.log('adminout 처리함');

  console.log(req.query);

  console.log(req.query.id);

  console.log(req.query.pass);

  var error = "1";

  var array = fs.readFileSync('admin.txt').toString().split("\n");

  for(i in array) {
    console.log(array[i]);
  }
  if(array[0] == req.query.id && array[1] == req.query.pass) {

    console.log("adsfasf")
    var token = jwt.sign({
      name: "chemipartenr"
    },
    "chemipartner!",
    {
      subject: "chemipartner token",
      expiresIn: '60m',
      issuer: "chemipartner"
    });
    console.log("토큰생성\n", token);

    res.json(token);
  }
  else {
    res.json(error);
  }
});

router.route('/informw').post((req, res)=>{

  console.log('informw start');

  var token = req.body.token;

  var model = {
    title: req.body.title,
    date: req.body.date,
    main: req.body.main,
    link: req.body.link
  }
  
  var code = moment().format("YYYYMMDDHHmmss");
  
  console.log(model.title);
  console.log(moment().format("YYYYMMDDHHmmss"));
  
  fs.writeFile('./public/impart/' + code + '.txt', model.title + model.date + model.main + model.link, 'utf-8', function(err){ 
    if (err === null) { 
      console.log('success'); 

      var sp = code.split(".");

      console.log(sp[0]);

      res.json(sp[0]);
    } else {
      console.log(err);
      console.log('fail');
      res.json("1");
    } 
  });
  
});

router.route('/informmo').post((req, res)=>{

  console.log('informmo start');

  var token = req.body.token;
    
  var model = {
    title: req.body.title,
    date: req.body.date,
    main: req.body.main,
    link: req.body.link
  }

  console.log(model.title);

  var code = req.body.code;

  console.log(code);

  fs.writeFile('./public/impart/' + code + '.txt', model.title + model.date + model.main + model.link, 'utf-8', function(err){ 
    if (err === null) { 
      console.log('success'); 

      var sp = code.split(".");

      console.log(sp[0]);

      res.json(sp[0]);
    } else {
      console.log(err);
      console.log('fail');
      res.json("1");
    } 
  });

});

router.route('/informdl').post((req, res)=>{

  console.log('informdl start');

  var token = req.body.token;
  
  var code = req.body.code;

  console.log(code);

  fs.unlink('./public/impart/' + code + '.txt', function(err){
    if( err ) throw err;
    console.log(code + 'file deleted');
    res.json('file deleted');
  });


});

router.route('/informreq').post((req, res)=>{

  console.log('informreq start');

  
    var code = req.body.code;

    console.log(code);

    var array = fs.readFileSync('./public/impart/' + code + '.txt').toString().split("/%$^#@$");

    console.log(array);

  
    var model = {
      title : array[0],
      date : array[1],
      main: array[2],
      link: array[3]
    }

    res.json(model);

});

router.route('/inform').post((req, res)=>{

  console.log('inform start');

    var value = {
      pagenum : req.body.pagenum,
      limit : req.body.limit
    };

    console.log(value.pagenum);
    console.log(value.limit);

    fs.readdir('./public/impart/', function(err, filelist){
      var fl = filelist.length;
      console.log(fl);
      if(err == null){

        console.log(filelist);

        if(filelist % value.limit == 0){
          var totalpage = fl/value.limit;
        }else{
          var totalpage = (fl/value.limit)+1;
        }

        if(fl<value.limit){

          if(value.pagenum > 1) {
            var err = "err";
            res.json(err);  
          }
          else {
            console.log("1");

            var reversefilelist = filelist.reverse();
            
            var list = new Array;
            
            for(i = 0; i < fl; i++){
              var array = fs.readFileSync('./public/impart/' + reversefilelist[i]).toString().split("/%$^#@$");

              var sp = reversefilelist[i].split(".");

              var array2 = {
                title: array[0],
                date: array[1],
                code: sp[0]
              };
              
              list.push(array2);
            }
            
            var list2 = {
              list : list,
              totalpage : totalpage
            };
            
            res.json(list2);
          }
        }
        else{
          if(value.pagenum > 1){
            if(fl > value.limit * value.pagenum + value.limit){
              console.log("2");
              
              var reversefilelist = filelist.reverse();

              var num = (value.pagenum-1)*value.limit;
  
              reversefilelist.splice(0,num);
  
              var list = new Array;
  
              for(i = 0; i < value.limit; i++){
                var array = fs.readFileSync('./public/impart/' + reversefilelist[i]).toString().split("/%$^#@$");

                var sp = reversefilelist[i].split(".");
                
                var array2 = {
                  title: array[0],
                  date: array[1],
                  code: sp[0]
                };
                list.push(array2);
              }
              
              var list2 = {
                list : list,
                totalpage : totalpage
              };
              
              res.json(list2);
            }
            else if(fl>=value.limit*value.pagenum){
              console.log("3");
              var reversefilelist = filelist.reverse();

              var num = ((value.pagenum - 1) * value.limit);

              reversefilelist.splice(0,num);
  
              var list = new Array;
              
              for(i = 0; i < value.limit; i++){
                
                var array = fs.readFileSync('./public/impart/' + reversefilelist[i]).toString().split("/%$^#@$");

                var sp = reversefilelist[i].split(".");
  
                var array2 = {
                  title: array[0],
                  date: array[1],
                  code: sp[0]
                };
                
                list.push(array2);
              }
              
              var list2 = {
                list : list,
                totalpage : totalpage
              };
              
              res.json(list2);
            }
            else {
              console.log("4");
              var reversefilelist = filelist.reverse();

              var num = ((value.pagenum - 1) * value.limit);

              reversefilelist.splice(0,num);
  
              var list = new Array;
              
              for(i = 0; i < filelist.length; i++){
                
                var array = fs.readFileSync('./public/impart/' + reversefilelist[i]).toString().split("/%$^#@$");

                var sp = reversefilelist[i].split(".");
  
                var array2 = {
                  title: array[0],
                  date: array[1],
                  code: sp[0]
                };
                
                list.push(array2);
              }
              
              var list2 = {
                list : list,
                totalpage : totalpage
              };
              
              res.json(list2);
            }
          }
          else {
            console.log("5");
            var reversefilelist = filelist.reverse();
            
            var list = new Array;
            
            for(i = 0; i < value.limit; i++){
              var array = fs.readFileSync('./public/impart/' + reversefilelist[i]).toString().split("/%$^#@$");

              var sp = reversefilelist[i].split(".");

              var array2 = {
                title: array[0],
                date: array[1],
                code: sp[0]
              };
              
              list.push(array2);
            }
            
            var list2 = {
              list : list,
              totalpage : totalpage
            };
            
            res.json(list2);
          }
        }
      }
      else{
        res.json(err);
      }
    });
  
});

router.route('/informw2').post((req, res)=>{

  console.log('informw2 start');

  var token = req.body.token;

  var model = {
    title: req.body.title,
    date: req.body.date,
    main: req.body.main,
    link: req.body.link
  }
  
  var code = moment().format("YYYYMMDDHHmmss");
  
  console.log(model.title);
  console.log(moment().format("YYYYMMDDHHmmss"));
  
  fs.writeFile('./public/data/' + code + '.txt', model.title + model.date + model.main + model.link, 'utf-8', function(err){ 
    if (err === null) { 
      console.log('success'); 

      var sp = code.split(".");

      console.log(sp[0]);

      res.json(sp[0]);
    } else {
      console.log(err);
      console.log('fail');
      res.json("1");
    } 
  });
  
});

router.route('/informmo2').post((req, res)=>{

  console.log('informmo2 start');

  var token = req.body.token;
    
  var model = {
    title: req.body.title,
    date: req.body.date,
    main: req.body.main,
    link: req.body.link
  }

  console.log(model.title);

  var code = req.body.code;

  console.log(code);

  fs.writeFile('./public/data/' + code + '.txt', model.title + model.date + model.main + model.link, 'utf-8', function(err){ 
    if (err === null) { 
      console.log('success'); 

      var sp = code.split(".");

      console.log(sp[0]);

      res.json(sp[0]);
    } else {
      console.log(err);
      console.log('fail');
      res.json("1");
    } 
  });

});

router.route('/informdl2').post((req, res)=>{

  console.log('informdl2 start');

  var token = req.body.token;
  
  var code = req.body.code;

  console.log(code);

  fs.unlink('./public/data/' + code + '.txt', function(err){
    if( err ) throw err;
    console.log(code + 'file deleted');
    res.json('file deleted');
  });


});

router.route('/informreq2').post((req, res)=>{

  console.log('informreq2 start');

  
    var code = req.body.code;

    console.log(code);

    var array = fs.readFileSync('./public/data/' + code + '.txt').toString().split("/%$^#@$");

    console.log(array);

  
    var model = {
      title : array[0],
      date : array[1],
      main: array[2],
      link: array[3]
    }

    res.json(model);

});

router.route('/inform2').post((req, res)=>{

  console.log('inform2 start');

    var value = {
      pagenum : req.body.pagenum,
      limit : req.body.limit
    };

    console.log(value.pagenum);
    console.log(value.limit);

    fs.readdir('./public/data/', function(err, filelist){
      var fl = filelist.length;
      console.log(fl);
      if(err == null){

        console.log(filelist);

        if(filelist % value.limit == 0){
          var totalpage = fl/value.limit;
        }else{
          var totalpage = (fl/value.limit)+1;
        }

        if(fl<value.limit){

          if(value.pagenum > 1) {
            var err = "err";
            res.json(err);  
          }
          else {
            console.log("1");

            var reversefilelist = filelist.reverse();
            
            var list = new Array;
            
            for(i = 0; i < fl; i++){
              var array = fs.readFileSync('./public/data/' + reversefilelist[i]).toString().split("/%$^#@$");

              var sp = reversefilelist[i].split(".");

              var array2 = {
                title: array[0],
                date: array[1],
                code: sp[0]
              };
              
              list.push(array2);
            }
            
            var list2 = {
              list : list,
              totalpage : totalpage
            };
            
            res.json(list2);
          }
        }
        else{
          if(value.pagenum > 1){
            if(fl > value.limit * value.pagenum + value.limit){
              console.log("2");
              
              var reversefilelist = filelist.reverse();

              var num = (value.pagenum-1)*value.limit;
  
              reversefilelist.splice(0,num);
  
              var list = new Array;
  
              for(i = 0; i < value.limit; i++){
                var array = fs.readFileSync('./public/data/' + reversefilelist[i]).toString().split("/%$^#@$");

                var sp = reversefilelist[i].split(".");

                var array2 = {
                  title: array[0],
                  date: array[1],
                  code: sp[0]
                };
                list.push(array2);
              }
              
              var list2 = {
                list : list,
                totalpage : totalpage
              };
              
              res.json(list2);
            }
            else if(fl>=value.limit*value.pagenum){
              console.log("3");
              var reversefilelist = filelist.reverse();

              var num = ((value.pagenum - 1) * value.limit);

              reversefilelist.splice(0,num);
  
              var list = new Array;
              
              for(i = 0; i < value.limit; i++){
                
                var array = fs.readFileSync('./public/data/' + reversefilelist[i]).toString().split("/%$^#@$");

                var sp = reversefilelist[i].split(".");
  
                var array2 = {
                  title: array[0],
                  date: array[1],
                  code: sp[0]
                };
                
                list.push(array2);
              }
              
              var list2 = {
                list : list,
                totalpage : totalpage
              };
              
              res.json(list2);
            }
            else {
              console.log("4");
              var reversefilelist = filelist.reverse();

              var num = ((value.pagenum - 1) * value.limit);

              reversefilelist.splice(0,num);
  
              var list = new Array;
              
              for(i = 0; i < filelist.length; i++){
                
                var array = fs.readFileSync('./public/data/' + reversefilelist[i]).toString().split("/%$^#@$");

                var sp = reversefilelist[i].split(".");
  
                var array2 = {
                  title: array[0],
                  date: array[1],
                  code: sp[0]
                };
                
                list.push(array2);
              }
              
              var list2 = {
                list : list,
                totalpage : totalpage
              };
              
              res.json(list2);
            }
          }
          else {
            console.log("5");
            var reversefilelist = filelist.reverse();
            
            var list = new Array;
            
            for(i = 0; i < value.limit; i++){
              var array = fs.readFileSync('./public/data/' + reversefilelist[i]).toString().split("/%$^#@$");

              var sp = reversefilelist[i].split(".");

              var array2 = {
                title: array[0],
                date: array[1],
                code: sp[0]
              };
              
              list.push(array2);
            }
            
            var list2 = {
              list : list,
              totalpage : totalpage
            };
            
            res.json(list2);
          }
        }
      }
      else{
        res.json(err);
      }
    });
  
});

module.exports = router;


