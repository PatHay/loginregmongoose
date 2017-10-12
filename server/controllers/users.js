var mongoose = require('mongoose');
var User = mongoose.model('User');


module.exports = {
    show: function(req, res) {
        res.render('index');
    },
    create: function(req, res){
        // if (req.body.pw !== req.body.confirm_pw){
        //     throw new Error('Password and confirm password do not match!');
        // }
        var user = new User({ 
            email: req.body.email,
            name: {first: req.body.first_name, last: req.body.last_name},
            pw: req.body.pw,
            birthday: req.body.birthday
        });
        user.save(function (err) {
            if (err) {
                console.log('something went wrong in creating user');
                res.render('index', {errors: user.errors});
            } else {
                console.log('successfully added a user to the database!');
                res.redirect('/');
            }
        });
    },
    login: function(req, res){
        User.findOne({email: req.body.email}, function(err, user){
            if(err) throw err;

            user.comparePassword(req.body.pw,function(err, isMatch){
                if(err) throw err;
                console.log('Password: ', isMatch);
            })
        })
    }
    // newedit: function(req, res){
    //     res.render('edit', { id: req.params.id });
    // },
    // edit: function(req, res){
    //     Panda.update({_id: req.params.id}, {name: req.body.name, age: req.body.age}, function(err){
    //         console.log("Edit submission works!")
    //         if(err){
    //             console.log("something went wrong in edit panda");
    //         }
    //         else{
    //             console.log('successfully edited a panda!');
    //             res.redirect('/');
    //         }
    //     });
    // },
    // remove: function(req, res){
    //     Panda.remove({_id: req.params.id}, function(err){
    //         if(err){
    //             console.log("Did not delete record!");
    //         }
    //         else{
    //             console.log("Successfully deleted Panda");
    //             res.redirect('/');
    //         }
    //     })
    // }
    
}
    // app.get('/pandas/new', function(req, res){
    //     res.render('new');
    // });

    // app.get('/pandas/edit/:id', function(req, res){
    //     // console.log(req.params.id);
    //     res.render('edit', { id: req.params.id });
    // });