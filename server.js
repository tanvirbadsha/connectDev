const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

// Connecting to database
connectDB();

// Init middlewear
app.use(express.json({extended: false}));


// define routes
app.use('/api/users', require('./routers/api/users'));
app.use('/api/auth', require('./routers/api/auth'));
app.use('/api/profile', require('./routers/api/profile'));
app.use('/api/posts', require('./routers/api/posts'));


app.get('/', (req,res)=>{
    res.send("api is running");
});





















app.listen(PORT, ()=> console.log(`Server is listening to port ${PORT}`));