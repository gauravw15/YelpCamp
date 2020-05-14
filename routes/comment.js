const express           = require('express'),
      router            = express.Router({mergeParams: true}),
      camp              = require("../models/campground"),
      Comment           = require("../models/comment"),
      reply             = require("../models/replies"),
      middlewareObject  = require("../middleware/");
// ============================= //
//       comment routes          //
// ============================= //

router.get("/new",middlewareObject.isLoggIn,function(req,res){   // is Logg In
    res.render("comments/new");
});

router.get("/:comment_id/",function(req,res){
  Comment.findById(req.params.comment_id,function(err,foundcomment){

    if (err) {
      res.redirect("back");
    } else {
      res.send(foundcomment.text);
    }
  });
});

router.post("/:comment_id/reply/new",middlewareObject.isLoggIn,function(req,res){ // res.send("Hii");

    let id1 = req.params.comment_id;
    let id2 = req.params.id;
    var text = req.body.text;
    var  replie =  {
                    text : text,
                     author :     {
                            id : req.user._id,
                            username : req.user.username
                                  }
                    }

    Comment.findById(id1,function(err,comment){
      if (err)
      {
        console.log(err);
        res.redirect("/campgrounds");
      }
    
      else{
        reply.create(replie,function(err,repl2){
              if (err)
              {
                console.log(err);
              }
              else{
                comment.replies.push(repl2);
                comment.save();
                res.redirect("/campgrounds/" + id2);
              }    
            });
          } 
      
    }); 
});

router.get("/:comment_id/reply",middlewareObject.isLoggIn,function(req,res){
  let id1 = req.params.comment_id;
  Comment.findById(id1).populate("replies").exec(function(err,foundComment){ 
    res.send(foundComment.replies);
  }); 

  
});

router.get("/:comment_id/reply/new",function(req,res){
  res.render("comments/reply");
});
 
router.get("/:comment_id/edit",middlewareObject.checkcommentAuthor,function(req,res){
  let id1 = req.params.comment_id;
  var postURL = req.originalUrl;
  postURL = postURL.replace("/edit","");
  Comment.findById(id1,function(err,comment){
    res.render("comments/edit",{comment: comment, URL:postURL});
  });
});

router.get("/",function(req,res){
  let  id2 = req.params.id;
  camp.findById(id2).populate("comments").exec(function(err,foundcamp){
    res.send(foundcamp.comments);
  });

});

router.post("/new",middlewareObject.isLoggIn,function(req,res){      //Is Logg In
    let id2 = req.params.id;
    var comme = req.body.comment;
    
    comme.author = 
    {
      id : req.user._id,
      username : req.user.username
    } 
  
  camp.findById(id2,function(err,foundcamp){
    if (err)
    {
      console.log(err);
      res.redirect("/campgrounds");
    }
  
    else{
      Comment.create(comme,function(err,comment){
            if (err)
            {
              console.log(err);
            }
            else{
              foundcamp.comments.push(comment);
              foundcamp.save();
              req.flash("success","Added new comment")
              res.redirect("/campgrounds/" + id2);
            }
          });
        }     
  });
   
});

router.put("/:comment_id/",middlewareObject.checkcommentAuthor,function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
      if(err) 
      {  
          res.redirect("/");
      }
      else
      {  
          res.redirect("/campgrounds/"+ req.params.id);
      }
  });
  
});

router.delete("/:comment_id/",middlewareObject.checkcommentAuthor,function(req,res){   //checkCampAuthor,
  let id1 = req.params.id;
  
  Comment.findByIdAndDelete(req.params.comment_id,function(err,deleted){
      if(err) 
      {
        console.log(err);  
        res.redirect("back")       
      }
      else
      {   req.flash("success","Deleted Successfully");
          res.redirect("/campgrounds/"+ id1);
      }
  }); 
});
module.exports = router;
  
  