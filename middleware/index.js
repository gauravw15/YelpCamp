const express           = require('express'),
      router            = express.Router({mergeParams: true})
      User              = require("../models/user"),
      camp              = require("../models/campground"),
      Comment           = require("../models/comment"),
      middlewareObject  = require("../middleware/"),
      passport          = require('passport');

var middlewareObject = {};

middlewareObject.checkcampAuthor = function(req,res,next){
    let  id2 = req.params.id;
    if (req.isAuthenticated()) {

        console.log("check camp Author");
  
      camp.findById(id2,function(err,foundcamp){
            if (err) {
                req.flash("error","campground not found")
            } 
            else {
                    if(foundcamp.author.id.equals(req.user.id))      
                     next();
                  
                     else 
                     {
                        req.flash("error","You don't have permission to do that");
                 
                    }
                 }
        });
      }

};

middlewareObject.checkcommentAuthor = function(req,res,next){
  let  id2 = req.params.comment_id;



  if (req.isAuthenticated()) {
    Comment.findById(id2,function(err,foundComment){
          if (err) {
              console.log(err);
          } 
          else {

                  if(foundComment.author.id.equals(req.user.id))      
                   next();


                   else 
                {
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
               }
        })
    }
    else {
        res.redirect("back");
    }


};

middlewareObject.isLoggIn = function(req,res,next){
    if (req.isAuthenticated()) 
        return next();  
    
    req.flash("error","Please Login FIrst");  
    res.redirect("/login");
};
  

module.exports = middlewareObject;