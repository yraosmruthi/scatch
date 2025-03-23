const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const expressSession = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const ownersRouter = require('./routes/ownersRouter');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const indexroute = require('./routes/index');

const db = require('./config/mongoose_connection')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret:process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(flash());
app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');

app.use("/",indexroute);
app.use("/owners",ownersRouter);
app.use("/users",usersRouter);
app.use("/products",productsRouter);



app.listen(3600);
