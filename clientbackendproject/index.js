const cors = require('cors');
var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./Routers/Routers');


var port = process.env.YOUR_PORT || process.env.PORT ||'5566';
var hostname=process.env.YOUR_HOST || '0.0.0.0'||"localhost";
const app =express();
app.use(cors());
app.options('*',cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/',routes);



app.listen(port,hostname,()=>{
    console.log('server is running on '+ hostname + " :" + port)
})