var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/credentials/';
var TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';

var calendar = google.calendar('v3');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // support json encoded bodies
//const nodemailer = require('nodemailer');

// routes will go here

/*app.get('/api/users', function(req, res) {
  var user_id = req.param('id');
  var token = req.param('token');
  var geo = req.param('geo');  

  res.send(user_id + ' ' + token + ' ' + geo);
});

app.post('/api/users', function(req, res) {
    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;

    res.send(user_id + ' ' + token + ' ' + geo);
});*/

var Jsonresult = {};
var key = 'events';
app.get('/trips', function(req1, res1) {

fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Calendar API.
  authorize(JSON.parse(content), listEvents);
});

function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
    console.log('Auth Token : ', token);
      callback(oauth2Client);
    });
  });
}

function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

function listEvents(auth) {
  
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    //timeMin: (new Date()).toISOString(),
    //timeMin: '2017-04-23T11:28:41.358Z',
    //timeMax: '2017-05-03T11:28:41.358Z',
    timeMin: req1.param("timeMin"),
    timeMax: req1.param("timeMax"),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var events = response.items;
    if (events.length == 0) {
      console.log('No upcoming events found.');
      res1.send('No upcoming events found.');
    } else {
      console.log('Upcoming 10 events:');
      var star = events.length;
      //res1.send('Upcoming 10 events:' + star);
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var start = event.start.dateTime || event.start.date;
        console.log('%s - %s', start, event.summary);
        //res1.send('The events : ' + start);
        //res1.send(JSON.stringify({ a: 1 }, null, 3));

        //res1.write(JSON.stringify({Eventdate: start +' '+ event.summary}));
        //res1.json([{start}]);

        //Jsonresult.status = 'ok';
        Jsonresult.event = event.summary;
        Jsonresult.datetime = start;

        //var ob = JSON.parse(Jsonresult);
        res1.send([Jsonresult]);

        //Jsonresult[0].event = event.summary;
  
      }

      res1.end();
    



      //res1.json(Jsonresult)
      //res1.end();
    }
    
  });
/*
  var event = {
  'summary': 'AutoCare Taxi Booking',
  'location': 'Pondicherry',
  'description': 'Just for testing.',
  'start': {
    'dateTime': '2017-05-26T09:00:00+05:30',
    'timeZone': 'Asia/Kolkata',
  },
  'end': {
    'dateTime': '2017-05-26T09:30:00+05:30',
    //'dateTime': '2017-04-22T17:00:00-07:00',
  'timeZone': 'Asia/Kolkata',
  },
  'recurrence': [
    'RRULE:FREQ=DAILY;COUNT=2'
  ],
  'attendees': [
    {'email': 'ramachandranvpm@gmail.com'},
    {'email': 'ramachandran@ap-infotech.com'},
  ],
  'reminders': {
    'useDefault': false,
    'overrides': [
      {'method': 'email', 'minutes': 24 * 60},
      {'method': 'popup', 'minutes': 10},
    ],
  },
};

calendar.events.insert({
  auth: auth,
  calendarId: 'primary',
  resource: event,
}, function(err, event) {
  if (err) {
    console.log('There was an error contacting the Calendar service: ' + err);
    return;
  }
  console.log('Event created: %s', event.htmlLink);
});
*/
}  



});




// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);