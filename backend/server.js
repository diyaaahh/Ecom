require("dotenv").config();
const passport = require('passport');
const express = require("express");
const pool = require("./database");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const session = require('express-session')

const app = express();
const PORT = 3000;
app.use(cookieParser());  

app.use(express.json()); // Parses JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parses form data


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(
    session({
        secret: "dsakdbdbaszj",
        resave: false,
        saveUninitialized: true, 
        cookie: {
            secure: false, 
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'Lax',
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require('./Routes/userRoutes');
app.use("/user", userRoutes);

const authRoutes = require("./Routes/authRoutes");
app.use("/auth", authRoutes);

const productRoutes = require('./Routes/productRoutes');
app.use("/product", productRoutes)

const cartRoutes = require('./Routes/cartRoutes');
app.use('/cart', cartRoutes);

const reviewRoutes = require('./Routes/reviewRoutes');
app.use('/review', reviewRoutes)

const paymentRoutes = require('./Routes/stripeRoutes');
app.use('/payment', paymentRoutes)


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
