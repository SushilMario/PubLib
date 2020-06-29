//Dependencies
var    express = require("express"),
    bodyParser = require("body-parser"),
      mongoose = require("mongoose");

//Mongoose setup

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/pub-lib");

//App set up
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/",
    function(req, res)
    {
        res.render("landing");
    }
)

//New route

app.get("/register",
    function(req, res)
    {
        res.render("user/new");
    }
)

//Create route

app.post("/register",
    function(req, res)
    {
        res.send("We are creating your account....");
    }
)

app.listen(3000,
    function() 
    {
        console.log("App up and running!");    
    }
)