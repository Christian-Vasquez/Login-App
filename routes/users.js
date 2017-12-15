var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var db = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;

router.get('/register', function(req, res){
	res.render('register');
});

router.get('/login', function(req, res){
	res.render('login');
});

router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Userame is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	
	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	}
	else{
		bcrypt.genSalt(10, function(err,salt){
				bcrypt.hash(password, salt, function(err, hash){
					password = hash;
					console.log("HASHED PWD: " + password);

			db.User.create({		
				name: name,
				email: email,
				username: username,
				password: password
			}).then(function(ans) {
	      		console.log("CLIENT OBJECT: "+ ans);

	      		req.flash('success_msg', 'You are registered and can now login');
				res.redirect('/users/login');
	    	});

				});
			});
	}
});

passport.use(new LocalStrategy(
	function(username, password, done){
		//set router.post
		db.User.findOne({
			where: {
				username: username
			}
		}).then(function(dbUser){
		
		if(!dbUser)
          // if the user is not exist
          return done(null, false, {message: "The user is not exist"});
        else if(comparePassword(password, dbUser.password, test))
          // if password does not match
          return done(null, false, {message: "Wrong password"});
        else
          // if everything is OK, return null as the error
          // and the authenticated user
          return done(null, dbUser);
        
      }).error(function(err){
        // if command executed with error
        return done(err);
        });
}));

// 		// function getUsername(userdb, err){
// 		// 	console.log("error: " + err);

// 		//  	if(err){
// 		//  		console.log('USER: ' + userdb);
// 		//  		throw err;
// 		//  	} 
// 		//  	if(!userdb){
// 		//  		console.log('USER: ' + userdb);
// 		//  		return done(null, false, {message: 'Unknown User'});
// 		//  	}
// 		// }

// 		getUsername(dbUser);

		function comparePassword(upassword, hash, callback){
			bcrypt.compare(upassword, hash, function(err, isMatch) {
    		if(err) throw err;
    		callback(null, isMatch);
			});
		}

		function test(err, isMatch){
			if(err) throw err;
			return isMatch;
			// if(isMatch){
			// 	return done(null, dbUser);
			// } else {
			// 	return done(null, false, {message: 'Invalid Password'});
			// }
		}

passport.serializeUser(function(user, done) {
  	console.log("USER CEREAL: " + user);
  	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // query the current user from database
  	db.User.findOne({
			where: {
				id: id
			}
		}).then(function(user){
    	done(null, user);
    }).error(function(err){
        done(new Error('User ' + id + ' does not exist'));
    });
});
		// comparePassword(password, dbUser.password, test);

// 		// comparePassword(password, dbUser.password, function(err, isMatch){
// 		// 		console.log("dbUser-password: " + dbUser.password);
// 		// 		console.log("password: " + password);
// 		// 		if(err) throw err;
// 		// 		if(!isMatch){
// 		// 			return done(null, dbUser);
// 		// 		} else {
// 		// 			return done(null, false, {message: 'Invalid Password'});
// 		// 		}
// 		// });
// 	});
// }));

router.post('/login', passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
 function(req,res) {
 		console.log("res" + res);
 		console.log("req" + req);
		res.redirect('/');
	});

module.exports = router;