const express = require('express');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const mustacheExpress = require('mustache-express');
const morgan = require('morgan');
//Do not have to npm install
const crypto = require('crypto');

const app = express();

app.engine('mustache', mustacheExpress());

app.set('views', './views');
app.set('view engine', 'mustache');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(validator());

app.use(morgan('dev'));

app.use( (req, res, next) => {
  console.log("Middleware runs here");
  next();
});

app.get("/", function(req, res){
  res.send("Hey!");
});

app.listen(3000, function(){
  console.log("App running on localhost:3000")
});


//Hashing a password
var config = {
    salt: function(length){
    return crypto.randomBytes(Math.ceil(32 * 3 / 4)).toString('base64').slice(0, length);
    },
    iterations: 20000,
    keylen: 512,
    digest: 'sha512'
};

function hashPassword(passwordinput){
    var salt = config.salt(32);
    var iterations = config.iterations;
    var hash = crypto.pbkdf2Sync(passwordinput, salt, iterations, config.keylen, config.digest);
    var hashedPassword = hash.toString('base64');

    console.log('Hashed password: ', hashedPassword);
    console.log('Salt: ', salt );

    return {salt: salt, hash: hashedPassword, iterations: iterations};
}

hashPassword('password123!');

let config2 = {
  keylen: 512,
  digest: 'sha512'
};

function isPasswordCorrect(passwordAttempt) {
  let savedHash = 'saved-hash-in-db';
  let savedSalt = 'saved-salt-in-db';
  let savedIterations = 'saved-iterations-in-db';

  let hash = crypto.pbkdf2Sync(passwordAttempt, savedSalt, savedIterations, config2.keylen, config2.digest);

  var hashPassword = hash.toString('base64');
  return savedHash === hashedPassword;
}
