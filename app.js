const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const app = express()
const port = process.env.PORT || 5000



// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));
// !important! 
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv 

app.get('/' , (req , res)=>{
   res.render('home');

})


app.listen(port , ()=> console.log('> Server is up and running on port : ' + port))