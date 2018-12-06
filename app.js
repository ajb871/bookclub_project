// Dependencies //
var express = require('express')
var app = express()
var ejs = require('ejs');
const fs = require('fs');
var request = require('request');
var bodyParser = require('body-parser');

// Views & Static
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./'));
app.set('view engine', 'ejs');

// Load data from users data JSON file
let userFile = fs.readFileSync('users.json');
let userData = JSON.parse(userFile);

// Create book array
var books = ['Frankenstein.html', 'Pride_and_Prejudice.html', 'Tom_Sawyer.html']

////// Sign up Page here //////
app.get('/', function(req, res){
  res.render('signup', {success: null, error: null});
});

app.post('/', function(req, res){
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;
  let confirmUsername = false;

  // Check if username is taken & send back error if true
  for (let i=0; i<userData.length; i++){
    if (userData[i].username === username){
      confirmUsername = true;  
    }
  }

  if (confirmUsername){
    res.render('signup', {success: null, error: 'That username is taken, try again!'});
  } else {
    if (password === password2){
      //A - Created "newUser" variable to push to userData
      let newUser = {
        username: username,
        password: password,
        book: null,
        bookmark: null,
        notes: []
      }
      // If free username & passwords match, push & write to userdata
      userData.push(newUser);
      let finalData = JSON.stringify(userData);
      fs.writeFile('users.json', finalData, finished);

      function finished(err) {
        console.log(req.body);
        res.redirect('/home');
      }

      // This will redirect to user's Home page
      res.render('signup', {success: "Welcome, new user!", error: null});

    } else {
      res.render('signup', {success: null, error: "Passwords have to be the same!"});
      console.log(password, password2);
    }   
  }
}
);

////// Log in Page here //////
app.get('/login', function(req, res){
  res.render('login', {error: null});
});

app.post('/login', function(req, res){
  let username = req.body.username;
  let password = req.body.password;

  let gotUser = false;
  let userIndex = null;

  ///Check for username and password
  for (let i=0; i<userData.length; i++){
    if (userData[i].username === username){
      gotUser = true;
      userIndex = i;
    }
  }

  if (gotUser){
    if (password === userData[userIndex].password){
      // Send user's data to homepage
      let thisUser = userData[userIndex]
      console.log(thisUser);
      res.redirect('/home');
    }else{ 
      res.render('login', {error: 'Incorrect password, try again!'});
    }
  }else{
    res.render('login', {error: 'User not found'});
  }

});


app.get('/home', function(req,res){
  res.render('home');
  

});

app.get('/book', function(req,res){
  // Pass a book to the "book" EJS page -> will come from the user's data
  let book = books[0];
  res.render('book',{book: book});

  ///a socket chat should also be here somewhere
  
  
});




app.listen(3000, function(){
  console.log('app listening on port 3000!')
})
