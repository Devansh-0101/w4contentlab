let express = require("express");
let bodyParser = require("body-parser");
let mongodb = require('mongodb');
let mongoose = require('mongoose');

let app = express();

//Setup the view Engine, Express should be able to render ejs templates
//by default, res.render needs the HTML files to be in a directory called ‘views’
//res.sendFile needs relative pathnames
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


//the following code to serve images, CSS files, and JavaScript files in directories named images and css
//uses the express.static built-in middleware function in Express, to serve static files/assets:
app.use(express.static('images'));
app.use(express.static('css'));


// viewsPath is required for the response.sendFile function
//__dirname is the  directory name of the current module (i.e file/project).
let viewsPath = __dirname + "/views/";

//allow Express to understand the urlencoded format
app.use(
    bodyParser.urlencoded({
      extended: false,
    })
);


let Task = require("./models/task");
let Developer = require("./models/developer");

let url = "mongodb://localhost:27017/wsvnlab";

mongoose.connect(url, {useNewUrlParser: true}, function(err){
    if (err) throw err;
    console.log("connected");
});



app.get("/", function(req,res){
    let fileName = viewsPath + "index.html";
    res.sendFile(fileName);
});

//add and list developers:
app.get("/adddeveloper", function(req,res){
    let fileName = viewsPath + "adddeveloper.html";
    res.sendFile(fileName);
});

app.post("/addnewdeveloper", function(req,res){
    let body = req.body;

    let newDev = new Developer({
        _id: new mongoose.Types.ObjectId(),

        name: {
            firstName: body.fName,
            lastName:body.lName,
        },

        level: body.level,

        address: {
            state: body.state,
            suburb: body.suburb,
            street:body.street,
            unit: body.unit
        }
    });

    newDev.save(function (err) {
        if (err) throw err;
        else {
            res.redirect('/');
            console.log('Developer successfully Added to DB');
        }
    });

});

app.get("/alldevelopers", function(req,res){

    Developer.find({}, function(err,docs){
        res.render("alldevelopers.html", {developers: docs});
    })

});

//add and list tasks:
app.get("/addtask", function(req,res){
    let fileName = viewsPath + "addtask.html";
    res.sendFile(fileName);
});

app.post('/addnewtask', function (req, res) {
    let body = req.body;

    var ObjectId = require('mongodb').ObjectId;
    var inputId = body.assignTo;
    var developerId = new ObjectId(inputId);

    let newTask = new Task({
        _id: new mongoose.Types.ObjectId(),
        name: body.tName,
        assignTo: developerId,

        dueDate: body.tDueDate,
        status: body.tStatus,
        description: body.tDesc
    
    });    

    newTask.save(function (err) {
        if (err) throw err;
        else {
            res.redirect('/listtasks');
            console.log('Task successfully Added to DB');
        }
    });
});

app.get("/listTasks", function(req,res){

    Task.find({}, function(err,docs){
        res.render("alltasks.html", {tasks: docs});
    });

});

//CRUD operations:
app.get("/deletetask", function(req,res){
    let fileName = viewsPath + "deletetask.html";
    res.sendFile(fileName);
});

app.post('/deletetask',function(req,res){
    var ObjectId = require('mongodb').ObjectId;
    var id = req.body.taskId;
    var findId = new ObjectId(id);

    Task.findByIdAndDelete(findId, function (err, doc) {
        if(!err){   
        res.redirect('/listtasks');
        } else {
        console.log('error', error);
        res.send(error);
        }
    });

});

app.get("/deletecompletedtasks", function(req,res){
    let fileName = viewsPath + "deletecompletedtasks.html";

    Task.deleteMany({ status: 'Complete' }, function (err, doc) {
        if(!err){   
            console.log(doc);
            res.redirect("/listtasks");
            //or res.sendFile(fileName);
        } else {
            console.log('error', error);
            res.send(error);
        }
    });
});

app.get("/updatetask", function(req,res){
    let fileName = viewsPath + "updatetask.html";
    res.sendFile(fileName);
});

app.post('/updatetask',function(req,res){
    let taskDetails = req.body;
    
    var ObjectId = require('mongodb').ObjectId;
    var id = taskDetails.taskId;
    var findId = new ObjectId(id);
    
    let theUpdate = {$set: {status: taskDetails.taskStatus}};

    Task.findByIdAndUpdate(findId, theUpdate, {upsert: true }, function (err, doc) {
        if(!err){   
        res.redirect('/listtasks');
    } else {
        console.log('error', error);
        res.send(error);
    }});
});

app.listen(8080);