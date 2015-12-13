// make sure to edit and rename config-sample.js
config = require('cloud/config.js');

express = require('express');
app = express();

moment = require('moment');
_ = require('underscore');
math = require('cloud/math.min.js');

app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
app.use(express.bodyParser());

app.locals._ = _; // underscore EVERYWHERE
app.locals.percentage = function(number, dividend, decimals) {
  return math.round(number / dividend * 100, typeof decimals !== 'undefined' ? decimals : 1);
}
app.locals.gaID = 'UA-60132084-9' // put your google analytics ID here, or comment out the line to disable analytics

var apiBase = 'http://api.builtwith.com/trends/v2/api.json';
var apiKey = config.apiKey;

app.get('/', function(req, res) {
  Parse.Cloud.httpRequest({
    url: apiBase,
    params: {
      key: apiKey,
      tech: 'WordPress' // change this to a different tech to show its use instead. it's that simple!
    }
  }).then(function(apires) {
    var data = apires.data['Tech'];
    var updated = moment(data['RunDate']).format('LL');
    var internetSize = 348403017; // TODO: make this number live somehow
    res.render('home', {
      updated: updated,
      coverage: data['Coverage'],
      metrics: [{
        name: 'TenK',
        prettyName: 'Top 10k',
        number: 10000
      }, {
        name: 'HundredK',
        prettyName: 'Top 100k',
        number: 100000
      }, {
        name: 'Mil',
        prettyName: 'Top 1 Million',
        number: 1000000
      }, {
        name: 'Internet',
        prettyName: 'Whole Internet (' + internetSize + ' sites)',
        number: internetSize
      }]
    });
  }, function(apires) {
    console.error('Request failed with response code ' + httpResponse.status);
  });
});

app.listen();
