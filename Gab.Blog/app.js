
/**
 * Module dependencies.
 */

var express = require('express'),
    errorhandler = require('errorhandler'),
    http = require('http'),
    path = require('path'),
    bodyParser = require('body-parser'),
    apiRoutes = require('./app/apiRoutes'),
    webRoutes = require('./app/webRoutes'),
    PostDao = require('./app/db/postDao');
    app = express();

PostDao.connect();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// development only
if ('development' === app.get('env')) {
    app.use(errorhandler());
    app.use(express.static(path.join(__dirname, 'public')));
} else {
    app.use(express.static(path.join(__dirname, 'dist')));
}

app.use('/api', apiRoutes);

webRoutes(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
