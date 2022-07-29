const  express = require('express');
const connection= require('../connection');
const router =express.Router();
var auth = require('../services/authentication')
var checkRole = require('../services/checkRoles')

router.post('/add',auth.authenticationToken,checkRole.checkrole,(req,res)=>{
    let product = req.body
    var sql =" insert into product(name,categoryId,description,price,status) values (?,?,?,?,'true')"
    connection.query(sql,[product.name,product.categoryId,product.description,product.price],(err,results)=>{
        if(!err){
            return res.status(200).json({message:"Product add successfully"})
        }else{
            return res.status(500).json(err);
        }
    })
})

router.put('/update',auth.authenticationToken,checkRole.checkrole,(req,res)=>{
    let product = req.body
    var sql =" update product set name=?,categoryId=?,description=?,price=? where id=?"
    connection.query(sql,[product.name,product.categoryId,product.description,product.price,product.id],(err,results)=>{
        if(!err){
            if (results.affectedRows ==0){
                return res.status(404).json({message:"Product id not found"})
            }
            return res.status(200).json({message:"Product added successfully"})
        }else{
            return res.status(500).json(err);
        }
    })
})
router.get('/get',auth.authenticationToken,(req,res)=>{
    var sql = "select p.id, p.name,p.description," +
        "p.price,p.status,c.id as categoryId,c.name as categoryName " +
        "from product p INNER JOIN category c " +
        "where  p.categoryId=c.id"
    connection.query(sql,(err,results)=>{
        if (!err){
            return res.status(200).json(results)
        }  else{ return res.status(500).json(err)}
    })
})

router.get('/getByCategory/:id',auth.authenticationToken,(req,res,next)=>{
    const id= req.params.id;
    var sql="select id, name from product where categoryId =? and status='true'"
    connection.query(sql,[id],(err,results)=>{
        if (!err){
            return res.status(200).json(results)
        }  else{ return res.status(500).json(err)}
    })
})

router.get('/getById/:id',auth.authenticationToken,(req,res,next)=>{
    const id= req.params.id;
    var sql="select id, name,description,price from product where id=?"
    connection.query(sql,[id],(err,results)=>{
        if (!err){
            return res.status(200).json(results)
        }  else{ return res.status(500).json(err)}
    })
})

router.delete('/delete/:id',auth.authenticationToken,checkRole.checkrole,(req,res,next)=>{
    const id = req.params.id
    var sql ="delete from product where id =?"
    connection.query(sql,[id],(err,results)=>{
        if(!err){
            if (results.affectedRows ==0){
                return res.status(404).json({message:"Product id not found"})
            }
            return res.status(200).json({message:"Product deleted successfully"})
        }else{
            return res.status(500).json(err);
        }
    })
});


router.patch('/updateStatus',auth.authenticationToken,checkRole.checkrole,(req,res,next)=>{
    const product = req.body
     var sql ="update product set status=? where id =?"

    connection.query(sql,[product.status,product.id],(err,results)=>{
        if(!err){
            if (results.affectedRows ==0){
                return res.status(404).json({message:"Product id not found"})
            }
            return res.status(200).json({message:"Product status updated successfully"})
        }else{
            return res.status(500).json(err);
        }
    })
});
module.exports = router
