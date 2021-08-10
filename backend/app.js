const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


const helmet = require('helmet');//les 4 suivants ajoutés
const xss = require ('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const toobusy = require('toobusy-js');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user')

mongoose.connect('mongodb+srv://stephane:Fm2o5A3g7uCaKhTX@cluster0.ciij3.mongodb.net/store?retryWrites=true&w=majority',
        { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json()); /* déprécié, utiliser express.JSON */

app.use(mongoSanitize()); // Protection contre les injections dans Mongo Db
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

app.use(helmet()); // protection contre injection sql et xss
// ...is equivalent to this:
// app.use(helmet.contentSecurityPolicy());
// app.use(helmet.dnsPrefetchControl());
// app.use(helmet.expectCt());
// app.use(helmet.frameguard());
// app.use(helmet.hsts());
// app.use(helmet.ieNoOpen());
// app.use(helmet.noSniff());
// app.use(helmet.permittedCrossDomainPolicies());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());
//determines if a page can be loaded via a <frame> or an <iframe> element. Allowing the page to be framed may result in Clickjacking attacks. 
//app.use(helmet.xframe());

//This header prevents Internet Explorer from executing downloaded files in the site's context. This is achieved with noopen directive.
app.use(helmet.ieNoOpen());
//This setting denies all such <iframe> content.Clickjacking is an ingenious technique for hiding an invisible <iframe> containing malicious code, but positioned on top of a thing that looks enticing to click on. The user would then be enticed into clicking on the malicious button.
app.use(helmet.frameguard({ action: 'deny' }));

//Nettoie les entrées user
app.use(xss());
//protection contre attaque DoS
toobusy.maxLag(10);
app.use(function(req, res, next) {
  if (toobusy()) {
    res.send(503, "I'm busy right now, sorry.");
  } else {
    next();
  } 
});
//ne retourne que ce qui est demandé dans un champ(si la demande concerne le nom, il ne sera pas retourné l'adresse email lié...)
exports.sanitizeUser = function(user) {
return {
  id: user.id,
  username: user.username,
  fullName: user.fullName
  };
};

module.exports = app;