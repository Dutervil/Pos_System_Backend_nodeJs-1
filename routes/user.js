const  express = require('express');
const connection= require('../connection');
const {stringify} = require("nodemon/lib/utils");
const jwt =require("jsonwebtoken")
const nodemailer= require('nodemailer')
require('dotenv').config();
const router =express.Router();
router.post('/signup',(req,res)=>{
    const user = req.body;

    sql = "select email, password,role,status from user where email=?";
    connection.query(sql,[user.email],(err, results)=>{
        if(!err){
            if(results.length<=0){
                insert="insert into user(name,contactNumber,email,password,status,role)values (?,?,?,?,'false','user')";
                connection.query(insert,[user.email,user.contactNumber,user.email,user.password],(err,results)=>{
                    if(!err){
                        return res.status(200).json({message:"Successfully registered"})
                    }else{return res.status(500).json(err);}
                })
            }else{res.status(400).json({message:"Email Already taken"});}
        }else{return res.status(500).json(err);}
    })

})
router.post('/login',(req,res)=>{
    const user =req.body;
     sql= "select email,password,status,role from user where email=?"
    connection.query(sql,[user.email],(err,result)=>{
        if(!err){
           if(result.length<=0 || result[0].password!=user.password) {
               return  res.status(401).json({message:"Incorrect username or password"});
           }else if(result[0].status =='false'){
               return res.status(401).json({message:'Wait for admin Approval'});
           }else if(result[0].password==user.password){
               // generate the token for the logged in user
                const response= {email:result[0].email,role:result[0].role};
                const accessToken = jwt.sign(response,process.env.SECRET,{expiresIn: '8h'})
               res.status(200).json({token:accessToken});
           }else{
               return res.status(400).json({message:'Something went wrong. Please again later'});
           }
        }else{return res.status(500).json(err);}
    })
})
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "dwadson3@gmail.com",
        pass: "odvzcknjhtfbdyqb",
    },
});
router.post('/forget-password',(req,res)=>{
    const user= req.body
    sql = "select email,password from user where email=?";
    connection.query(sql,[user.email],(err,result)=>{
        if (!err){
            if (result.length<=0){
                return res.status(200).json({message:"Password sent to your Email"});
            }else {
                var mailOptions ={
                    from:process.env.EMAIL,
                    to:result[0].email,
                    subject:'Password By wadson POS',
                    html:'<p>' +
                                '<b>Your Login Details for Point of Sale System</b><br>'+result[0].email+'<br>' +
                                '<b>Password: </b>' +result[0].password+
                                '<br><a style=" display: block;\n' +
                            '    width: 115px;\n' +
                            '    height: 25px;\n' +
                            '    background: #077a39;\n' +
                            '    padding: 10px;\n' +
                            '    text-align: center;\n' +
                            '    border-radius: 5px;\n' +
                            '    color: white;\n' +
                            '    font-weight: bold;\n' +
                            '    line-height: 25px;" href="http://localhost:8181">Click here to login</a>' +
                        '</p>'
                }
                transporter.sendMail(mailOptions,function (err,info) {
                    if(err){
                        console.log(err)
                    }else {
                        console.log("Email Sent",info.response)
                    }
                });
                return res.status(200).json({message:"Password sent to your Email"});
            }
        }else {return res.status(500).json(err)}
    })

})
module.exports = router