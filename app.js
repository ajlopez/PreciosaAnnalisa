
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

var preciosa = require('./preciosa');
preciosa.initialize();
console.log('Loading data...');
preciosa.loadCategorias();
preciosa.loadProductos();
preciosa.loadCiudades();
preciosa.loadMarcasFabricantes();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/api/analyze', function (req, res) {
    console.dir(req.param('q'));
    res.send(preciosa.analyze(req.param('q')));
});

app.get('/api/search', function (req, res) {
    console.dir(req.param('q'));
    res.send(preciosa.search(req.param('q')));
});

console.log("Loading remote data...");

preciosa.loadRemoteMarcas(function (err, data) {
    if (err)
        console.log(err);
        
    preciosa.defineMarcasFabricantes();
    
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
});
