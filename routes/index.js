const express           = require('express'),
      router            = express.Router({mergeParams:true}),
      User              = require("../models/user"),
      passport          = require('passport');

router.get("/logout",function(req,res){
    req.logOut();
    req.flash("success","Logged You Out");
    res.redirect(req.headers.referer);
});

router.get("/register",function(req,res){
    res.render("register");
 });

router.post("/register",function(req,res){
    User.register(new User({username: req.body.username }),req.body.password,function(err,user){
        if (err) {
            req.flash("error",err.message);
            res.redirect("/register"); 
        } 

        else
        {
            passport.authenticate("local")(req,res,function(){
            req.flash("success","Welcome " + req.body.username)
            res.redirect("/campgrounds");
            });
        }
  
    });
});

 
/*
router.post("/login", passport.authenticate("local",{
    successRedirect :   "/prvpag",
    failureRedirect :  "/login"
  }),  function(req,res){
});
*/

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {

      if (!user) {
        req.flash("error",info.message);
        res.redirect("/login");
      }

      else{
        req.logIn(user, function(err) {
        req.flash("success","Welcome " + user.username);
        res.redirect(req.headers.referer);
      })
    };
    })(req, res, next);
  });

function isLoggIn(req,res,next){
    if (req.isAuthenticated()) 
        return next(); 
        
    req.flash("error","Please Login First");
    res.redirect("/login");
};
  
module.exports = router;