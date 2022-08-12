const  express = require("express");
var cors = require("cors");
const connection = require("./connection");
const userRoute = require('./routes/user')
const categoryRoute = require('./routes/category')
const productRoute= require('./routes/product')
const billRoute= require('./routes/bill')
const dashboardRoute= require('./routes/dasbboard');
const compression = require("compression");
const app = express();


app.use(cors());
app.use(compression)
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})



app.use('/user',userRoute);
app.use('/category', categoryRoute);
app.use('/product', productRoute);
app.use('/bill', billRoute);
app.use('/dashboard', dashboardRoute);
console.log("OK")
module.exports=app;
