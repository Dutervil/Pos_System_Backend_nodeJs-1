const  express = require('express');
const connection= require('../connection');
const router =express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRoles');
let ejs= require("ejs");
let pdf = require('html-pdf');
let fs=require('fs');
let path=require('path');
var uuid=require('uuid');


router.post('/generateRport',auth.authenticationToken,(req,res,next)=>{
    const generatedUuid= uuid.v1();
    const orderDetails=req.body
    var productDetailsReport=JSON.parse(orderDetails.productDetails);

    var sql ="insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values (?,?,?,?,?,?,?,?)"
    const data=[
        orderDetails.name,
        generatedUuid,
        orderDetails.email,
        orderDetails.contactNumber,
        orderDetails.paymentMethod,
        orderDetails.total,
        orderDetails.productDetails,
        orderDetails.createdBy
    ]
    connection.query(sql,data,(err,results)=>{
          if (!err){
             ejs.renderFile(path.join(__dirname,'',"report.ejs"),{
                 productDetails:productDetailsReport,
                 name:orderDetails.name,
                 email:orderDetails.email,
                 contactNumber:orderDetails.contactNumber,
                 paymentMethod:orderDetails.paymentMethod,
                 totalAmount:orderDetails.total
             },(err,result)=>{
                 if (err){
                     return res.status(500).json(err)
                 }else{
                     pdf.create(result).toFile('./generated_pdf/'+generatedUuid+'.pdf',function (err,data) {
                         if(err){
                             console.log(err);
                             return res.status(500).json(err);
                         }else{
                             return res.status(200).json({uuid:generatedUuid})
                         }
                     })
                 }
             })
          }else{
              return res.status(500).json(err)
          }
    })

})
router.post('/getPdf',auth.authenticationToken,function(req,res){
    const orderDetails = req.body
    const pdfPath = './generated_pdf/'+orderDetails.uuid+'.pdf';
    if(fs.existsSync(pdfPath)){
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    }else{
       var productDetailsReport = JSON.parse(orderDetails.productDetails) ;

        ejs.renderFile(path.join(__dirname,'',"report.ejs"),{
            productDetails:productDetailsReport,
            name:orderDetails.name,
            email:orderDetails.email,
            contactNumber:orderDetails.contactNumber,
            paymentMethod:orderDetails.paymentMethod,
            totalAmount:orderDetails.total
        },(err,result)=>{
            if (err){
                return res.status(500).json(err)
            }else{
                pdf.create(result).toFile('./generated_pdf/'+orderDetails.uuid+'.pdf',function (err,data) {
                    if(err){
                        console.log(err);
                        return res.status(500).json(err);
                    }else{
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                })
            }
        })
    }
})

router.get('/getBills',auth.authenticationToken,(req,res,next)=>{
     var sql="select * from bill order by id DESC ";
     connection.query(sql,(err,results)=>{
         if (!err){
             return res.status(200).json(results);
         }else{
             return  res.status(500).json(err);
         }
     })
})
 router.delete('/delete/:id',auth.authenticationToken,(req,res,next)=>{
     const id =req.params.id;
     var sql ="delete from bill where id";
     connection.query(sql,(err,results)=>{
         if (!err){
             if(results.affectedRows==0){
                 return res.status(404).json({message:"Bill Id is note found"});
             }else{
                 return res.status(202).json({message:"Successfully deleted"});
             }

         }else{
             return  res.status(500).json(err);
         }
     })
 })
module.exports = router