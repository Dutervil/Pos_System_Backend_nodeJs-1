const  express = require('express');
const connection= require('../connection');
const router =express.Router();
var auth = require('../services/authentication')
var checkRole = require('../services/checkRoles')

router.get('/details',auth.authenticationToken,(req,res,next)=>{
    var categoryCount;
    var productCount;
    var billCount;

    var sql="select count(id) as categoryCount from category";
    connection.query(sql,(err,results)=>{
        if (!err){
            categoryCount=results[0].categoryCount;
        }else{
            return res.status(500).json(err);
        }
    })


    var sql="select count(id) as productCount from product";
    connection.query(sql,(err,results)=>{
        if (!err){
            productCount=results[0].productCount;
        }else{
            return res.status(500).json(err);
        }
    })
    var sql="select count(id) as billCount from bill";
    connection.query(sql,(err,results)=>{
        if (!err){
            billCount=results[0].billCount;
            const details={
                bill:billCount,
                product:productCount,
                category:categoryCount
            }
            return res.status(202).json(details);
        }else{
            return res.status(500).json(err);
        }
    })


})
module.exports = router;

