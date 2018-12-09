// Dependencies //
var express = require('express');
var app = express();
var ejs = require('ejs');
const fs = require('fs');
const io = require('socket.io')(app.listen());
var request = require('request');
var bodyParser = require('body-parser');

// Views & Static
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('./'));
app.set('view engine', 'ejs');

// Load data from users data JSON file
let userFile = fs.readFileSync('users.json');
let userData = JSON.parse(userFile);

// Current User 
var currUser = null;

// Create book array
var books = ['Frankenstein.html', 'Pride_and_Prejudice.html', 'Tom_Sawyer.html']


///listening for socket.io connection on every connection

io.on('connection',(socket) => {
  console.log('some user connected');
})

////// Sign up Page here //////
app.get('/', function(req, res){
  if (currUser === null){
    res.render('signup', {success: null, error: null});
  } else {
    redirect('/home');
  }
});

app.post('/signup', function(req, res){
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
    console.log('error in app.post/: username taken')
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
        currUser = newUser;
        res.redirect('/home');
      }

    } else {
      res.render('signup', {success: null, error: "Passwords have to be the same!"});
      console.log('error in app.post/, password maatch: '+password+ password2);
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
      // Set the current user
      currUser = thisUser;
      res.redirect('/home');
    }else{ 
      res.render('login', {error: 'Incorrect password, try again!'});
    }
  }else{
    res.render('login', {error: 'User not found'});
  }

});

// Signout path
app.get('/signout', function(req,res){
  currUser = null;
  res.redirect('/login');
});

// Home page with currUser
app.get('/home', function(req,res){
  res.render('home',{user: currUser}); 
});

// New User chooses their book here!
app.post('/home', function(req,res){
  let book = req.body.bookChoice;
  console.log(book);
  currUser.book = book;

  // Update data in user array and json file!
  for (let i=0; i<userData.length; i++){
      if (userData[i].username === currUser.username){
        userData[i] = currUser;
      }
  }

  let newData = JSON.stringify(userData);
  fs.writeFile('users.json', newData, finished);

  function finished(err) {
    console.log(req.body);
    console.log(currUser);
    res.redirect('/book');
  }

  
});

////this is a comment to test Sawyer's commits
// Book reading page!
app.get('/book', function(req,res){
  // Pass a book to the "book" EJS page -> will come from the user's data 
  if(currUser === null){
    // Redirect if not logged in
    res.redirect('/login');
  } else {
    res.render('book',{user: currUser});
}

//
io.on('connection', (socket) => {
  console.log('New user connected');

    //listen on change_username
    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message ///username : socket.username////
        });
    })

    //listen on typing
    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', {username : socket.username})
    })
});
});




app.listen(3000, function(){
  console.log('app listening on port 3000!')
});