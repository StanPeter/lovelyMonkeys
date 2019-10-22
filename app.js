//installing required packages
var bodyParser  = require("body-parser"),
mongoose        = require("mongoose"),
express         = require("express"),
app             = express();

//connecting to out Mongo database
mongoose.connect("mongodb://localhost/monkeyBlog", {useNewUrlParser: true, useUnifiedTopology: true});

//setting up the app
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//Schema for DB, config
var appSchema = new mongoose.Schema({
    title: String,
    image: String,
    text: String,
    created: {type: Date, default: Date.now}
});
var Monkeys = mongoose.model("monkey", appSchema);

// Monkeys.create({
//     title: "First Blog",
//     image: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Vervet_Monkey_%28Chlorocebus_pygerythrus%29.jpg",
//     text: "A random text"
// });

//RESTFUL routes
app.get("/", function(req, res){
    res.redirect("/monkeys");
});

//INDEX ROUTE
app.get("/monkeys", function(req, res){
    Monkeys.find({}, function(err, monkeys){
        if(err){
            console.log(err);
        } else{
            res.render("index", {monkeys:monkeys});
        }
    });
});
//NEW ROUTE
app.get("/monkeys/new", function(req, res){
    res.render("new");
});
//CREATE ROUTE
app.post("/monkeys", function(req, res){

    Monkeys.create(req.body.monkey, function(err, monkey){
        if(err){
            res.render("new");
            console.log(err);
        } else{
            res.redirect("/monkeys");
        }
    });
});
//SHOW ROUTE
app.get("/monkeys/:id", function(req, res){
    Monkeys.findById(req.params.id, function(err, foundMonkey){
        if(err){
            console.log(err);
            res.redirect("/monkeys");
        } else{
            res.render("show", {monkey: foundMonkey});
        }
    });
});


//running server
app.listen(3000, function(){
    console.log("Suceffuly launched app RESTapp")
    console.log("Listening to port  'localhost:3000'")
});