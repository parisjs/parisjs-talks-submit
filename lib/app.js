var express = require('express');
var request = require('superagent');

var app = express();

app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');

app.use(express.static('public'));
app.use(express.bodyParser());

app.get('/', function(req, res) {
    res.render('form');
});

app.get('/sponsoring', function(req, res) {
    res.render('sponsoring');
});

app.post('/', function(req, res) {
    console.log('post new talk', req.body);

    if (!req.body.title) {
        return res.send(400);
    }

    createTalkCard(
        app.get('host'),
        app.get('token'),
        app.get('key'),
        app.get('idList'),
        req.body,
        function(err) {
            if (err) {
                return res.send(500, err.toString());
            }

            res.send(201);
        });
});

app.post('/sponsoring', function(req, res) {
    console.log('post new sponsoring', req.body);

    if (!req.body.contact) {
        return res.send(400);
    }

    createSponsoringCard(
        app.get('host'),
        app.get('token'),
        app.get('key'),
        app.get('idListSponsoring'),
        req.body,
        function(err) {
            if (err) {
                return res.send(500, err.toString());
            }

            res.send(201);
        });
});

exports.app = app;

function createCard(type, host, token, key, data, callback) {
    request.post(host + '/1/cards')
        .query({
            key: key,
            token: token
        })
        .send({
            idList: data.idList,
            name  : data.name,
            desc  : data.desc,
            labels: data.labels
        })
        .end(function(err, res) {
            // yep, Trello doesn't send a 201 on create (already reported)
            if (err || !res || res.status != 200) {
                return callback(new Error('cannot create ' + type + ' card'));
            }

            callback();
        });
}

function createTalkCard(host, token, key, idList, form, callback) {
    var data = {
        idList: idList,
        name: form.title,
        desc: form.abstract + "\n\n" +
            "**" + form.author + "**",
        labels: form.type == 'short' ? 'yellow' : 'blue'
    };

    createCard('talk', host, token, key, data, callback);
}

function createSponsoringCard(host, token, key, idList, form, callback) {
    var data = {
        idList: idList,
        name: form.entite + " sponsoring",
        desc: form.period + "\n\n" +
            (form.type || []).join(" + ") + "\n\n" +
            "**" + form.contact + "**",
        labels: 'red'
    };

    createCard('sponsoring', host, token, key, data, callback);
}
