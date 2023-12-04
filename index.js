// require express for setting up the express server
const express = require('express');

// set up the port number
const port = process.env.PORT || 7000;

// importing the DataBase
const db = require('./config/mongoose');

// importng the Schema For tasks
const  Task  = require('./models/task');

// using express
const app = express();

// using static files
app.use(express.static("./views"));
// to use encrypted data
app.use(express.urlencoded());

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// rendering the App Page
app.get('/', async function(req, res) {
    try {
        const tasks = await Task.find({});

        return res.render('home', {
            title: "TODO APP",
            tasks: tasks
        });
    } catch (err) {
        console.log('Error in fetching tasks from db', err);
        return;
    }
});

// creating Tasks
app.post('/create-task', async function(req, res) {
    try {
        const newTask = await Task.create({
            description: req.body.description,
            category: req.body.category,
            date: req.body.date
        });

        //console.log(newTask);
        return res.redirect('back');
    } catch (err) {
        console.log('Error in creating task', err);
        return;
    }
});

//deleting Tasks
app.get('/delete-task', async function(req, res) {
    try {
        // Get the id from query
        var id = req.query;

        // Checking the number of tasks selected to delete
        var count = Object.keys(id).length;
        for (let i = 0; i < count; i++) {
            // Finding and deleting tasks from the DB one by one using id
            await Task.findByIdAndDelete(Object.keys(id)[i]);
        }

        return res.redirect('back');
    } catch (err) {
        console.log('Error in deleting task', err);
        return;
    }
});


// make the app to listen on asigned port number
app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }

    console.log(`Server is running on port : ${port}`);
});
