const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/", genl_routes);

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization) {
        let token = req.session.authorization['accessToken']; // Access Token
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.query.username = user.data.username;
                req.query.password = user.data.password;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
});

app.use("/customer", customer_routes);

const PORT =5000;
app.listen(PORT,()=>console.log("Server is running"));
