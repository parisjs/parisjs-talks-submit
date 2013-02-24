var express = require('express');
var request = require('supertest');
var app     = require('../lib/app').app;
var assert  = require('assert');

var trello = express();
trello.use(express.bodyParser());

trello.listen(3001);

describe('GET /', function() {
    it('should render the form', function(done) {
        request(app)
            .get('/')
            .send()
            .expect(200, done);
    });
});

describe('POST /', function() {
    it('should fail without good parameters', function(done) {
        request(app)
            .post('/')
            .send()
            .expect(400, done);
    });

    it('should post the result to the trello board', function(done) {
        app.set('host', 'http://localhost:3001');
        app.set('token', 'mytoken');
        app.set('key', 'mykey');
        app.set('idList', 'myIdList');
        trello.post('/1/cards', function(req, res) {
            assert.equal(req.query.key, 'mykey');
            assert.equal(req.query.token, 'mytoken');
            assert.equal(req.body.name, 'A new talk');
            assert.equal(req.body.desc, "The abstract\n\n**François francois@2metz.fr**");
            assert.equal(req.body.idList, 'myIdList');
            done();
        });
        request(app)
            .post('/')
            .type('form')
            .send({title: 'A new talk'})
            .send({abstract: 'The abstract'})
            .send({author: 'François francois@2metz.fr'})
            .expect(201)
            .end(function() {});
    });
});
