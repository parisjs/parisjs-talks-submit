var app  = require('./lib/app').app,
    port = process.env.PORT || 8080;


app.listen(port, function() {
    console.log('listening on http://localhost:'+ port);
});
