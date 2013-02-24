var fs   = require('fs');
var path = require('path');
var app  = require('./lib/app').app;

var configFile = path.join(__dirname, 'config.json');

if (!fs.existsSync(configFile))
    throw new Error('you must have a config.json');

var config = JSON.parse(fs.readFileSync(configFile));

Object.keys(config).forEach(function(key) {
    app.set(key, config[key]);
});

app.listen(3000, function() {
    console.log('listening on http://localhost:3000');
});
