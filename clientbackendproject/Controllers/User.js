require('dotenv').config()
const {response} = require("express");
const fs = require('fs');
var md5 = require('md5');
const jwt = require('jsonwebtoken');



exports.register=(req,res)=>{
    const reqBody = req.body;
    const username = reqBody.username;
    const password = reqBody.password;
    const fname = reqBody.fname;
    const lname = reqBody.lname;

    //let ureg = /[^a-z]/g;
    let ureg = /^[a-z]+$/g
    let uresult = ureg.test(username);
    let preg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/g;
    let presult = preg.test(password);
    let freg = /^[A-Za-z]+$/g;
    let fresult = freg.test(fname);
    let lreg = /^[A-Za-z]+$/g;
    let lresult = lreg.test(lname);

    const userDetails = {
        username: "",
        password: "",
        fname: "",
        lname:""
    }
    
    

    

    if(uresult && presult && fresult  && lresult){
        userDetails.username=username;
        userDetails.password=md5(password);
        userDetails.fname=fname;
        userDetails.lname=lname;


        const jsonString = JSON.stringify(userDetails);
        console.log(jsonString);
        fs.writeFile('./newUser.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
        
        res.status(200).json({
            result:"true",
            message: "SignUp success. Please proceed to Signin"
        })
    }else{
        res.status(500).json({})

    }

}

exports.login=(req,res)=>{
    const reqBody = req.body;
    const username = reqBody.username;
    const password = reqBody.password;

   
    var user;
    fs.readFile('./newUser.json', (err, data) => {
        if (err) throw err;
         user = JSON.parse(data);

         if(user.username==username && user.password == md5(password)){
            var userinfo ={
                username:username,
                password:password
            }
            const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
            let result = {
                result: true,
                jwt: accessToken,
                message: "Signin success"
            
         }
             res.status(200).json(result);
         }else{

            res.status(200).json({});

         }
        
         
        
    });

   

    


}




exports.userinformation=(req,res)=>{
    const authHeader = req.headers['authorization']
    const token =authHeader && authHeader.split(' ')[1]
    if(token == null) return res.status(401).json({result: "false",
    error: "Please provide a JWT token"})

    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.status(403).json({result: "false",
        error: "JWT Verification Failed"})
        res.status(200).json({
            result:"true",
            data:{
                fname:user.fname,
                lname:user.lname,
                password:user.password
            }
        });
    })
    
}



