const express           = require('express'), 
      app               = express(),
      bodyParser        = require('body-parser'),
      mongoose          = require('mongoose'),
      camp              = require("./models/campground"),
      Comment           = require("./models/comment"),
      User              = require("./models/user"),
      passport          = require('passport'),
      methodOverride    = require('method-override'), 
      flash             = require('connect-flash'),
      port              = 3000,
      expressSanitize   = require('express-sanitizer'),
      localStratergy    = require("passport-local"),
      passLocalMongoose = require('passport-local-mongoose');

      mongoose.connect("mongodb://localhost/campground",{ useNewUrlParser: true,useUnifiedTopology: true });
 
      var commentRoutes = require("./routes/comment");
      var campRoutes    = require("./routes/campground"); 
      var indexRoutes   = require("./routes/index");
      var prvURL = "/campgrounds";

app.use(require('express-session')({
    secret: "Light is KIRA",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine","ejs");
app.use(express.static(__dirname+'/public'));
app.use(expressSanitize());
app.use(bodyParser.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.error       = req.flash("error");
  res.locals.success     = req.flash("success");
  next();
});


app.use(indexRoutes);
app.use(campRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);


app.get("/",function(req,res){
  res.render("landing.ejs");
});

app.get("/prvpag",function(req,res){
  res.redirect(prvURL);
});

app.get("/login",function(req,res){

  if(!(req.headers.referer.includes("login") || req.headers.referer.includes("register")))
  prvURL = req.headers.referer;
  
  res.render("login");
});

app.get("/UsrInfo",function(req,res){
  if (req.isAuthenticated()) {
    res.send(req.user.username);
  } else {
    res.send("");
  }
});

app.listen(port,'0.0.0.0',function(){
  console.log("YelpCamp Server has started at "+ port);
});



