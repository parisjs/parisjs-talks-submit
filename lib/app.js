var express = require('express');
var request = require('superagent');

var app = express();
app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');

app.use(express.bodyParser());

app.get('/', function(req, res) {
    res.render('form');
});

app.post('/', function(req, res) {
    console.log('post new talk', req.body);
    if (!req.body.title) {
        res.send(400);
    } else {
        createCard(app.get('host'),
                   app.get('token'),
                   app.get('key'),
                   app.get('idList'),
                   req.body,
                   function(res) {
                       res.send(201);
                   });
    }
});

exports.app = app;

function createCard(host, token, key, idList, card, callback) {
    request.post(host+ "/1/cards")
        .query({key: key, token: token})
        .send({
            name: card.title,
            desc: card.abstract + "\n\n**"+ card.author +"**",
            idList: idList
        })
        .end(callback);
}
