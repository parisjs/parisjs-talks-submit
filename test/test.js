var express = require('express');
var request = require('supertest');
var app     = require('../lib/app').app;
var assert  = require('assert');

describe('GET /', function() {
    it('should render the form', function(done) {
        request(app)
            .get('/')
            .send()
            .expect(200, done);
    });
});

app.set('host', 'http://localhost:3001');
app.set('token', 'mytoken');
app.set('key', 'mykey');
app.set('idList', 'myIdList');
app.set('idListSponsoring', 'mySponsoringIdList');

describe('POST /', function() {
    it('should fail without good parameters', function(done) {
        request(app)
            .post('/')
            .send()
            .expect(400, done);
    });

    it('should post the result to the trello board', function(done) {
        var trello = express();
        trello.use(express.bodyParser());
        var server = trello.listen(3001);
        trello.post('/1/cards', function(req, res) {
            assert.equal(req.query.key, 'mykey');
            assert.equal(req.query.token, 'mytoken');
            assert.equal(req.body.name, 'A new talk');
            assert.equal(req.body.desc, "The abstract\n\n**François francois@2metz.fr**");
            assert.equal(req.body.idList, 'myIdList');
            assert.equal(req.body.labels, 'blue');
            server.close();
            done();
        });
        request(app)
            .post('/')
            .type('form')
            .send({
                title: 'A new talk',
                abstract: 'The abstract',
                author: 'François francois@2metz.fr',
                type: 'long'
            })
            .expect(201)
            .end(function() {});
    });

    it('should set the label yellow for short talk', function(done) {
        var trello = express();
        trello.use(express.bodyParser());
        var server = trello.listen(3001);
        trello.post('/1/cards', function(req, res) {
            assert.equal(req.body.labels, 'yellow');
            server.close();
            done();
        });
        request(app)
            .post('/')
            .type('form')
            .send({
                title: 'A new talk',
                abstract: 'The abstract',
                author: 'François francois@2metz.fr',
                type: 'short'
            })
            .expect(201)
            .end(function() {});
    });

    it('should fail when the trello API returns an error', function(done) {
        var trello = express();
        trello.use(express.bodyParser());
        var server = trello.listen(3001);
        trello.post('/1/cards', function(req, res) {
            res.send(400);
            server.close();
        });
        request(app)
            .post('/')
            .type('form')
            .send({title: 'A new talk'})
            .end(function(err, res) {
                assert.equal(res.status, 500);
                done();
            });
    });
});

describe('POST /sponsoring', function() {
    it('should fail without good parameters', function(done) {
        request(app)
            .post('/sponsoring')
            .send()
            .expect(400, done);
    });

    it('should post the result to the trello board', function(done) {
        var trello = express();
        trello.use(express.bodyParser());
        var server = trello.listen(3001);
        trello.post('/1/cards', function(req, res) {
            assert.equal(req.query.key, 'mykey');
            assert.equal(req.query.token, 'mytoken');
            assert.equal(req.body.name, '2metz Inc. sponsoring');
            assert.equal(req.body.desc, "never\n\nlieu + buffet\n\n**François francois@2metz.fr**");
            assert.equal(req.body.idList, 'mySponsoringIdList');
            assert.equal(req.body.labels, 'red');
            server.close();
            done();
        });
        request(app)
            .post('/sponsoring')
            .type('form')
            .send({
                entity: '2metz Inc.',
                contact: 'François francois@2metz.fr',
                period: 'never',
                type: [ 'lieu', 'buffet' ]
            })
            .expect(201)
            .end(function() {});
    });

    it('should fail when the trello API returns an error', function(done) {
        var trello = express();
        trello.use(express.bodyParser());
        var server = trello.listen(3001);
        trello.post('/1/cards', function(req, res) {
            res.send(400);
            server.close();
        });
        request(app)
            .post('/sponsoring')
            .type('form')
            .send({contact: 'A new talk'})
            .end(function(err, res) {
                assert.equal(res.status, 500);
                done();
            });
    });
});
