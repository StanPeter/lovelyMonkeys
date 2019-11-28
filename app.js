//installing required packages
var bodyParser  = require("body-parser"),
mongoose        = require("mongoose"),
expressSanitizer= require("express-sanitizer"),
methodOverride  = require("method-override"),
express         = require("express"),
app             = express();

//connecting to out Mongo database
mongoose.connect("mongodb://localhost/monkeyBlog", {useNewUrlParser: true, useUnifiedTopology: true});

//setting up the app
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method")); //fixing problem of non existing PUT in HTML
app.use(expressSanitizer()); //goes always after bodyParser (logical right?)

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
    res.render("landing");
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
    //sanitize
    console.log(req.body.monkey.text);
    req.body.monkey.text = req.sanitize(req.body.monkey.text)
    
    console.log(req.body.monkey.text);

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
//EDIT ROUTE
app.get("/monkeys/:id/edit", function(req, res){
    Monkeys.findById(req.params.id, function(err, foundMonkey){
        if(err){
            res.redirect("/monkeys");
            console.log(err);
        } else{
            res.render("edit", {monkey:foundMonkey});
        }
    });
});
//UPDATE ROUTE
app.put("/monkeys/:id", function(req, res){
    //sanitize
    req.body.monkey.text = req.sanitize(req.body.monkey.text)
        
    Monkeys.findByIdAndUpdate(req.params.id, req.body.monkey, function(err, updateMonkey){
        if(err){
            res.redirect("/monkeys");
            console.log(err);
        } else{
            res.redirect("/monkeys/" + req.params.id);
        }
    });  //findByIdAndUpdate(id, newData, callback)
});
//DELETE ROUTE
app.delete("/monkeys/:id", function(req, res){
    Monkeys.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/monkeys");
        } else {
            res.redirect("/monkeys");
        }
    });
});


//running server
app.listen(3000, function(){
    console.log("Suceffuly launched app RESTapp")
    console.log("Listening to port  'localhost:3000'")
});