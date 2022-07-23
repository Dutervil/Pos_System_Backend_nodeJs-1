
const http = require("http")
const  app = require("./index");
const server=http.createServer(app);
const mysql = require("./connection");


