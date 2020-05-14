const express           = require('express'),
      router            = express.Router({mergeParams: true}),
      middlewareObject  = require("../middleware/"),
      camp              = require("../models/campground");

router.get("/campgrounds",function(req,res){
  camp.find({},function(err,camp){
    if(err) 
    throw err;
         else
         res.render("index",{campgrounds: camp, currentUser : req.user});
     }); 
});
      
router.get("/campgrounds/:id/edit",middlewareObject.checkcampAuthor,function(req,res){   //checkCampAuthor,
  let  id2 = req.params.id;
  console.log("/campgrounds/ "+ id2 + " /edit");

  camp.findById(id2,function(err,foundcamp){
  res.render("campgrounds/edit", {camp: foundcamp});
  });
  
});
  
router.get("/campgrounds/new",middlewareObject.isLoggIn,function(req,res){  //Appn is Logg In
    res.render("campgrounds/new");
});
  
router.get("/campgrounds/:id",function(req,res){
    let id2 = req.params.id;
    camp.findById(id2,function(err,foundcamp){
        if (err) {
          res.render("err404")        
        } else {
          camp.findById(id2).populate("comments").exec(function(err,foundcamp2){
            res.render("campgrounds/show",{camp:foundcamp, comments: foundcamp2.comments});
          });      
        }
      }); 
});

router.post("/campgrounds",middlewareObject.isLoggIn,function(req,res){  //Appn is Logg In
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
 
    var newcamp = new camp(
         {
           name: name, image: image, description:description, author : author
         }
     );
 
     newcamp.save(function(err,newCampground){
         
     if(err)
          {
           throw err;
         }  
     });
   
     res.redirect("/campgrounds");
});
 
router.put("/campgrounds/:id/",middlewareObject.checkcampAuthor,function(req,res){    //checkCampAuthor,
  let id1 = req.params.id;
 camp.findByIdAndUpdate(id1,req.body.campground,function(err,updatedcamp){
  if(err) 
  {    
      res.redirect("/");
  }
  else
  {  
      res.redirect("/campgrounds/" + id1);
  }
});
});

router.delete("/campgrounds/:id/",middlewareObject.checkcampAuthor,function(req,res){   //checkCampAuthor,
  let id1 = req.params.id;

  camp.findByIdAndDelete(id1,function(err,updatedcamp){
      if(err) 
      {   
          res.redirect("back");
      }
      else
      {   
          res.redirect("/campgrounds/");
      }
  });
});

function isLoggIn(req,res,next){
  if (req.isAuthenticated()) 
      return next();      
  req.flash("error","Please Login FIrst");    
  res.redirect("/login");
};

function checkAuthor(req,res,next){
  let  id2 = req.params.id;
  if (req.isAuthenticated()) {

    camp.findById(id2,function(err,foundcamp){
          if (err) {
              console.log(err);
              res.redirect("back");  
          } 
          else {
                  if(foundcamp.author.id.equals(req.user.id))      
                   next();
                
                   else 
                   res.redirect("back");
               }
         }
    )}

    else {
      res.redirect("back");
    }
};


module.exports = router;