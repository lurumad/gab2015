module.exports = function (app) {
    app.get('*', function (req, res) {
        var options = {
            root: './public/views/'
        };
        
        res.sendFile('index.html', options);
    });
};