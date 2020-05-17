const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const hostname = 'localhost';
const port = 3000;

const app = express();
////////////////////////////////////////////////////////////////////////////////////
app.use(morgan('dev'));
app.use(bodyParser.json());


////////////////////////////////////////////////////////////DISHES
app.all('/dishes',(req,res,next) => {
     res.statusCode = 200;
     res.setHeader= ('ContentType','text/plain');
     next();
})

app.get('/dishes',(req,res,next)=>{
     res.end('Will send all the dishes to you!')
})

app.post('/dishes',(req,res,next)=>{
     res.end('Will add dish: '+req.body.name+' with details '+req.body.description)
})

app.put('/dishes',(req,res,next)=>{
     res.statusCode = 403;
     res.end('PUT operation not supported on /dishes!');
})

app.delete('/dishes',(req,res,next)=>{
     res.end('Deleting all the dishes!')
})
////////////////////////////////////////////////////////////DISH ID
app.get('/dishes/:dishID',(req,res,next)=>{
     res.end('Will send your details of dish: '+req.params.dishID+' to you!');
})

app.post('/dishes/:dishID',(req,res,next)=>{
     res.statusCode = 403;
     res.end('POST operation not supported on /dishes/'+req.params.dishID+'!');
})

app.put('/dishes/:dishID',(req,res,next)=>{
     res.write('Updating the dish: '+req.params.dishID+'...\n');
     res.end('Will update the dish: '+req.body.name+' with details '+req.body.description);
})

app.delete('/dishes/:dishID',(req,res,next)=>{
     res.end('Deleting dish: '+req.params.dishID+'!')
})
////////////////////////////////////////////////////////////


app.use(express.static(__dirname+'/public'))

app.use((req,res,next) => {
     res.statusCode = 200;
     res.setHeader= ('ContentType','text/html');

     res.end('<html><body><h1>This is an Express Server!!</h1></body></html>');
})


const server = http.createServer(app);
server.listen(port,hostname,()=>{
     console.log(`SERVER RUNNING ON: http://${hostname}:${port}`);
}) 