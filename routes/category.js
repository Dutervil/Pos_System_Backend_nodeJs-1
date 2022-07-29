const  express = require('express');
const connection= require('../connection');
const router =express.Router();
var auth = require('../services/authentication')
var checkRole = require('../services/checkRoles')


router.post('/add',auth.authenticationToken,checkRole.checkrole,(req,res)=>{
     let category = req.body
     sql = "insert into category (name) values(?)"
    connection.query(sql,[category.name],(err,results)=>{
       if (!err){
           return res.status(200).json({message:'Category added successfully'})
       } else{ return res.status(500).json(err)}
    })
})

router.get('/get',auth.authenticationToken,checkRole.checkrole,(req,res)=>{
    let category = req.body
    sql = "select * from category order by name"
    connection.query(sql,[category.name],(err,results)=>{
        if (!err){
                return res.status(200).json(results)
            }  else{ return res.status(500).json(err)}
    })
})

router.patch('/update',auth.authenticationToken,checkRole.checkrole,(req,res)=>{
    let category = req.body
    sql = "update category set name=? where id=?"
    connection.query(sql,[category.name, category.id],(err,results)=>{
        if (!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:'Category id not found'})
            }
          return res.status(200).json({message:'Category updated successfully'})

        } else{ return res.status(500).json(err)}
    })
})
module.exports = router
