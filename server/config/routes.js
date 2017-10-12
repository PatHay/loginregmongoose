var users = require('../controllers/users.js');

module.exports = function Route(app, server) {
    app.get('/', function(req, res){
        users.show(req, res)
    });

    app.post('/register', function(req, res){
        users.create(req, res)
    });

    app.post('/login', function(req, res){
        users.login(req, res)
    });

    // app.get('/pandas/edit/:id', function(req, res){
    //     // console.log(req.params.id);
    //     pandas.newedit(req, res)
    // });

    // app.post('/pandas/:id', function(req, res){
    //     // console.log("Edit submission works!")
    //     pandas.update(req, res)
    // });

    // app.get('/pandas/destroy/:id', function (req, res){
    //     pandas.remove(req, res)
    // });
};