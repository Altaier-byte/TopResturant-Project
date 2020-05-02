require('dotenv').config();
var
express                  = require("express"),
app                      = express(),
bodyParser               = require("body-parser"),
mongoose                 = require("mongoose"),
flash                    = require("connect-flash"),
passport                 = require("passport"),
LocalStrategy            = require("passport-local"),
methodOverride           = require("method-override"),
Resturant                = require("./models/resturant"),
Comment                  = require("./models/comment"),
User                     = require("./models/user");

//Requring routes
var commentRoutes    = require("./routes/comments"),
    resturantRoutes = require("./routes/resturants"),
    indexRoutes      = require("./routes/index");
    

mongoose.connect("mongodb://localhost/ResturantReview_Final",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//---------------------
//Passport configration
//---------------------

app.use(require("express-session")({
    secret: "Sleep, Code, Repeat !!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")

	next();
});

//Using the routes
app.use("/resturants/:id/comments", commentRoutes);
app.use("/resturants", resturantRoutes);
app.use(indexRoutes);





app.listen(process.env.PORT|| 3000, process.env.IP, function(){
	  
	console.log("The Resturant Review Server** has started !");
});