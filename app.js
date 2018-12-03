var express = require('express')
var app = express()
var ejs = require('ejs');
const fs = require('fs');

var request = require('request');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
let userFile = fs.readFileSync('users.json');
let userData = JSON.parse(userFile);


// sign up page here
app.get('/', function(req, res){
  res.render('signup', {success: null, error: null});
});

app.post('/', function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  let confirmUser = false;

  for (let i=0; i<userData.length; i++){
    if (userData[i].username === username){
      confirmUser = true;  
    }
  }

  if (confirmUser){
    res.render('signup', {success: null, error: 'Username already exists, try again!'});
  }else{
    if (password === password2){
      userData.push({username: username, password: password});
      let finalData = JSON.stringify(userData);
      fs.writeFile('users.json', finalData, finished);
      function finished(err) {
        console.log(req.body);
      }
      res.render('signup', {success: "Welcome, new user!"});
    }else{
      res.render('signup', {success: null, error: "Passwords have to be the same!"});
      console.log(password, password2);

    }   
  }
});

// log in page here
app.get('/login', function(req, res){
  res.render('login', {error: null});
});

app.post('/login', function(req, res){
  let username = req.body.username;
  let password = req.body.password;

  let gotUser = false;
  let userIndex = null;

  ///check for user and password
  for (let i=0; i<userData.length; i++){
    if (userData[i].username === username){
      gotUser = true;
      userIndex = i;
    }
  }

  if (gotUser){
    if (password === userData[userIndex].password){
      res.redirect('/library');
    }else{ 
      res.render('login', {error: 'Incorrect password, try again!'});
    }
  }else{
    res.render('login', {error: 'User not found'});
  }

});



// ////the main page here
// app.post('/library', function (req, res) {
  
// })

///the individual book club page goes here

// app.post('/clubBookName', function (req, res){

// })

app.listen(3000, function(){
  console.log('app listening on port 3000!')
})