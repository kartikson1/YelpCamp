var express = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
flash       = require("connect-flash"),
passport    = require("passport"),
LocalStrategy = require("passport-local")
Campground  = require("./models/campground"),
Comment     = require("./models/comment"),
methodOverride = require("method-override"),
User        = require("./models/user"),
seedDB      = require("./seeds")

//requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)

//mongoose.connect("mongodb://localhost:27017/yelp_camp")
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp"
mongoose.connect(url, {useNewUrlParser: true});

// mongoose.connect("mongodb+srv://kartikson1:22sepkms@cluster0-cgv4t.mongodb.net/test?retryWrites=true&w=majority", 
// {useNewUrlParser: true,
//  useCreateIndex: true}).then(() => {
//    console.log("connected to DB!");
//  }).catch(err => {
//    console.log("ERROR: ", err.message);
//  });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
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
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});