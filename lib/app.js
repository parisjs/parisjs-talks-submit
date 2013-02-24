var express = require('express');
var request = require('superagent');

var app = express();

app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');

app.use(express.static('public'))
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
                   function(error) {
                       if (error) {
                           return res.send(500, error.toString());
                       }
                       res.send(201);
                   });
    }
});

exports.app = app;

function createCard(host, token, key, idList, card, callback) {
    request.post(host +'/1/cards')
        .query({key: key, token: token})
        .send({
            name: card.title,
            desc: card.abstract + "\n\n**"+ card.author +"**",
            idList: idList
        })
        .end(function(err, res) {
            // yep, Trello doesn't send a 201 on create (already reported)
            if (err || res.status != 200) {
                return callback(new Error('cannot create the card'));
            }
            request.post(host +'/1/cards/'+ res.body.id +'/labels')
                .query({key: key, token: token})
                .send({
                    value: card.type == 'short' ? 'yellow': 'blue'
                })
                .end(function(err, res) {
                    if (err || res.status != 200) {
                        return callback(new Error('cannot set the label'));
                    }
                    callback();
                });
        });
}
