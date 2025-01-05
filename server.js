const express = require('express');
const path = require('path');
const { User,alltodo, CmpltdTodo } = require('./model.js');
const { totalmem } = require('os');
 // Ensure this is your Mongoose model
const app = express();
app.use(express.static('static'));

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Define the port
const port = 3000;

var username;

app.get('/',(req,res)=>{
    res.render('login');
});

app.post('/login', async (req, res) => {
    const data={
        name:req.body.uname,
        password:req.body.password
    }
    const check = await User.findOne({ name: data.name });
    
    if (!check) {
        return res.send("Register First");  // Return early if user is not found
    }

    const isPasswordCorrect =  data.password === check.password;
    
    if (isPasswordCorrect) {
        username=data.name;
       res.redirect('home');
    }else{
        res.send("Password Incorrect");
    }
});

app.get('/logout',(req,res)=>{  
    username=null;
    res.redirect('/');
});

app.get('/signup',(req,res)=>{
    res.render('signup');
})

app.post('/signup',(req,res) =>{
    const data={
        name:req.body.uname,
        password:req.body.password
    }
    const userdata=new User(data);
    userdata.save();
    res.redirect('/');
});

// Route for the home page
app.get('/home', async (req, res) => {
    if (!username) {
        return res.redirect('/');
    }
    try {
        const allTodos = await alltodo.find({ username: username });
        res.render('home', { todo: allTodos, user: username });
    } catch (e) {
        console.error('Error fetching todos:', e); // Log the error
        res.status(500).send('Internal Server Error');
    }
});


// Route to add a new todo
app.post('/add', async (req, res) => {
    if(username==null){
        return res.redirect('/');
    }
    const data = {
        todo: req.body.todo,
        category: req.body.category,
        date: req.body.date,
        username:username
    };

    const newTodo = new alltodo(data);
    try {
        await newTodo.save();
        res.redirect('/home');
    } catch (e) {
 
        res.status(500).send('Internal Server Error');
    }
});

app.get('/delete/:id', async (req, res) => {
    if(username==null){
        return res.redirect('/');
    }
    try {
        // Use async/await for findByIdAndDelete
        const deletedTodo = await alltodo.findByIdAndDelete(req.params.id);
        
        if (!deletedTodo) {
            return res.status(404).send('Todo not found');
        }

        res.redirect('/home');  // Redirect to the home page after deletion
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

app.get('/update/:id', async (req,res)=>{
    if(username==null){
        return res.redirect('/');
    }
    try{
        const todo=await alltodo.findById(req.params.id);
        return res.render('update',{todo:todo});
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
});

app.post('/update/:id', async (req,res)=>{
    if(username==null){
        return res.redirect('/');
    }
    try{
        const todo=await alltodo.findById(req.params.id);
        todo.todo=req.body.todo;
        todo.category=req.body.category;
        todo.date=req.body.date;
        await todo.save();
        res.redirect('/home');
    }catch(err){
        return res.status(500).send('Internal Server Error');
    }
});

app.get('/completed/:id', async (req,res)=>{
    if(username==null){
        return res.redirect('/');
    }
    const todo=await alltodo.findById(req.params.id);
    const todoc={
        todo:todo.todo,
        category:todo.category,
        date:todo.date,
        username:username
    }
    await new CmpltdTodo(todoc).save();
    await alltodo.findByIdAndDelete(req.params.id);
    res.redirect('/home');
});

app.get('/filter', async (req,res)=>{
    if(username==null){
        return res.redirect('/');
    }
    try{
        if(req.query.filter==="Personal" || req.query.filter==="Professional"){
            
            const todo=await alltodo.find({username:username, category:req.query.filter});
            return res.render('filter',{todo:todo});
        }else{
            const todo=await CmpltdTodo.find({username:username});
            return res.render('filter',{todo:todo});
        }
    }catch(err){
        res.status(500).send('Internal Server Error @ Filtering');
    } 
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
