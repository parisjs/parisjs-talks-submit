var express = require('express');
var request = require('superagent');
var bodyParser = require('body-parser');

var app = express();

app.set('views', __dirname + '/../views');
app.set('view engine', 'jade');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.render('form');
});

app.get('/en', function(req, res) {
    res.render('en/form');
});

app.get('/sponsoring', function(req, res) {
    res.render('sponsoring');
});

app.get('/en/sponsoring', function(req, res) {
    res.render('en/sponsoring');
});

app.post('/', function(req, res) {
    console.log('post new talk', req.body);

    if (!req.body.title) {
        return res.sendStatus(400);
    }

    createTalkCard(
        process.env.TRELLO_HOST,
        process.env.TRELLO_TOKEN,
        process.env.TRELLO_KEY,
        process.env.TRELLO_ID_LIST_TALK,
        req.body,
        function(err) {
            if (err) {
                return res.status(500).send(err.toString());
            }

            res.sendStatus(201);
        });
});

app.post('/sponsoring', function(req, res) {
    console.log('post new sponsoring', req.body);

    if (!req.body.contact) {
        return res.sendStatus(400);
    }

    createSponsoringCard(
        process.env.TRELLO_HOST,
        process.env.TRELLO_TOKEN,
        process.env.TRELLO_KEY,
        process.env.TRELLO_ID_LIST_SPONSORING,
        req.body,
        function(err) {
            if (err) {
                return res.status(500).send(err.toString());
            }

            res.sendStatus(201);
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
    var formType = form.type || [];
    var isHosting = formType.indexOf('lieu') !== -1;
    var audienceString = isHosting ? (
        ' (places: ' + (form.audience ? form.audience : 'non spécifié') + ')'
    ) : '';
    var data = {
        idList: idList,
        name: form.entity + " sponsoring",
        desc: form.period + "\n\n" +
            formType.join(" + ") + audienceString + "\n\n" +
            "**" + form.contact + "**",
        labels: 'red'
    };

    createCard('sponsoring', host, token, key, data, callback);
}
