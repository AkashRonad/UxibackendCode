require('dotenv').config()
const { response } = require("express");
const fs = require('fs');
var md5 = require('md5');
const jwt = require('jsonwebtoken');



exports.register = (req, res) => {
    const reqBody = req.body;
    const username = reqBody.username;
    const password = reqBody.password;
    const fname = reqBody.fname;
    const lname = reqBody.lname;
    let uresult;
    let presult;
    let fresult;
    let lresult;

    if (username && username.length === 0) {
        res.setHeader('Content-Type', 'text/javascript').status(400).json({
            result: false,
            response: "all required properties",
            error: "username check failed"
        });


    } else if (password && password.length === 0) {
        res.status(400).json({
            result: false,
            response: "all required properties",
            error: "password check failed"
        });

    } else if (fname  && fname.length === 0 || lname && lname.length === 0) {
        res.status(400).json({
            result: false,
            response: "all required properties",
            error: "fname or lname check failed"
        });

    }

    if (username && password && fname && lname) {
        let ureg = /^[a-z]+$/g
        uresult = ureg.test(username);
        let preg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{5,}$/g;
        presult = preg.test(password);
        let freg = /^[A-Za-z]+$/g;
        fresult = freg.test(fname);
        let lreg = /^[A-Za-z]+$/g;
        lresult = lreg.test(lname);

        if (uresult != true) {
            res.status(400).json({
                result: false,
                response: "all required properties",
                error: "username check failed"
            });

        } else if (presult != true) {
            res.status(400).json({
                result: false,
                response: "all required properties",
                error: "password check failed"
            });


        } else if (fresult != true) {
            res.status(400).json({
                result: false,
                response: "all required properties",
                error: "fname or lname check failed"
            });

        } else if (lresult != true) {
            res.status(400).json({
                result: false,
                response: "all required properties",
                error: "fname or lname check failed"
            });


        }

        if (uresult && presult && fresult && lresult) {
            let filedata;
            fs.readFile('./newUser.json', (err, data) => {
                if (err) throw err;
                filedata = JSON.parse(data);
            });
            const userDetails = {
                username: "",
                password: "",
                fname: "",
                lname: ""
            }
            userDetails.username = username;
            userDetails.password = md5(password);
            userDetails.fname = fname;
            userDetails.lname = lname;


            const jsonString = JSON.stringify(userDetails);

            if (filedata.username ==  userDetails.username) {
                res.status(400).json({
                    result: false,
                    response: "all required properties",
                    error: "username already exists"
                });

            } else {
                fs.writeFile('./newUser.json', jsonString, err => {
                    if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file');
                        res.status(200).json({
                            result: true,
                            message: "SignUp success. Please proceed to Signin"
                        })
                    }
                });
            }

           
        } else {
            res.status(400).json({})

        }


    } else {
        res.status(400).json({
            result: false,
            response: "all required properties",
            error: "fields can't be empty"
        })
    }
}







exports.login = (req, res) => {
    const reqBody = req.body;
    const username = reqBody.username;
    const password = reqBody.password;

    if (username && username.length === 0) {
        res.status(400).json({
            result: false,
            response: "all required properties",
            error: "Please provide username and password"
        });


    } else if (password && password.length === 0) {
        res.status(400).json({
            result: false,
            response: "all required properties",
            error: "Please provide username and password"
        });

    }

    if (username && password) {
        var user;
        fs.readFile('./newUser.json', (err, data) => {
            if (err) throw err;
            user = JSON.parse(data);

            if (user.username == username && user.password == md5(password)) {
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
                let result = {
                    result: true,
                    jwt: accessToken,
                    message: "Signin success"

                }
                res.status(200).json(result);
            }else {
                res.status(401).json({
                    result: false,
                    response: "all required properties",
                    error: "Invalid username/password"
                });

            }



        });

    } else {
        res.status(400).json({
            result: false,
            response: "all required properties",
            error: "Please provide username and password"
        });

    }









}




exports.userinformation = (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({
        result: false,
        error: "Please provide a JWT token"
    })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).json({
            result: false,
            error: "JWT Verification Failed"
        })
        res.status(200).json({
            result: true,
            data: {
                fname: user.fname,
                lname: user.lname,
                password: user.password
            }
        });
    })

}



