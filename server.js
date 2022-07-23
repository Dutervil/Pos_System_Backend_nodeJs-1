require("dotenv").config()
const http = require("http")
const  app = require("./index");
const server=http.createServer(app);
server.listen(process.env.PORT)
const mysql = require("./connection");
