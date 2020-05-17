const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;


const server = http.createServer((req, res) => {
     console.log('Request for '+req.url+' by method '+req.method);

     if(req.method == 'GET'){
          var fileURL;
          if(req.url == '/') 
               fileURL = '/index.html'
          else 
               fileURL=req.url;
          
          var filePath = path.resolve('./public'+fileURL);
          const fileExtention = path.extname(filePath);

          if (fileExtention == '.html') {
               fs.exists(filePath,(exits)=>{
                    if(!exits){
                         res.statusCode = 404;
                         res.setHeader('Content-Type','text/html');
                         res.end('<html><body><h1>Error 404: '+fileURL+' File Does not Exists!</h1></body></html>')
                         return;
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type','text/html');
                    fs.createReadStream(filePath).pipe(res);
               })
          }else{
               res.statusCode = 404;
               res.setHeader('Content-Type','text/html');
               res.end('<html><body><h1>Error 404: '+fileURL+' File Does not an HTML file!</h1></body></html>')
               return;
          }
     }else{
          res.statusCode = 404;
          res.setHeader('Content-Type','text/html');
          res.end('<html><body><h1>Error 404: '+req.method+' not supported!</h1></body></html>')
          return;
     }
 })


server.listen(port,hostname,()=>{
     console.log(`SERVER RUNNING: http://${hostname}:${port}`);
})

