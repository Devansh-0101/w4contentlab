let express = require("express");
let app = express();
// bodyParser is used to parse the payload of the incoming POST requests. 
let bodyParser = require("body-parser");

//allow Express to understand the urlencoded format
app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );

//Setup the view Engine, Express should be able to render ejs templates
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//by default, res.render needs the HTML files to be in a directory called ‘views’
//res.sendFile needs relative pathnames

//the following code to serve images, CSS files, and JavaScript files in directories named images and css
//uses the express.static built-in middleware function in Express, to serve static files/assets:
app.use(express.static('images'));
app.use(express.static('css'));

// viewPath is required for the response.sendFile function
//__dirname is the  directory name of the current module (i.e file/project).
let viewsPath = __dirname + "/views/";

//List of tasks
let db = [];

//code below:
app.get("/", function(req,res){
    //res.render('index.html');
    //res.sendFile('index.html');
    //res.sendFile('/index.html');
    let fileName = viewsPath + "index.html";
    res.sendFile(fileName);
});

/*
okay to use res.render above and below? because it is static file. Need to use .sendFile instead?
if so then look at _dirname + 'index' etc.
*/ 

app.get("/newtask", function(req,res){
    //res.render('addcustomer.html')
    let fileName = viewsPath + "addtask.html";
    res.sendFile(fileName);
});

app.get("/listtasks", function(req,res){
    res.render("alltasks.html", {tasks: db});
});

//addnewtask is the form on the page addtask.html
//data validation required??
app.post('/addnewtask', function (req, res) {
    //console.log(req.body);
    db.push(req.body);
    
    let fileName = viewsPath + "taskadded.html";
    res.sendFile(fileName);
    //above two lines needed? or to simply use res.send('New task has been added') ???

    //res.send('New task has been added');
    //res.send needed, otherwise the user will get stuck in a loading state..?
    //from the 'new task been added' if users pressed back the task's details remain there, need a way to handle this?
    //if the user presses refresh  when they reach 'new task been added' then the form enters the same task entry into db twice. Need to handle this?
});

app.listen(8080);