module.exports = function (app) {
    app.get('*', function (req, res) {
        var options = {
            root: './public/views/'
        };
        
        res.sendFile('index2.html', options);
    });
};