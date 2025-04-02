// controllers/userController.js
const pool = require("../database");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

// Controller to create a new user
const createUser = async (req, res) => {
    const { name, email, password, phone , address } = req.body;

    if (!name || !email || !password || !phone || !address) {
        return res.status(400).json({ message: "Name, email,phone ,address and password are required" });
    }

    try {
        const existingUser = await pool.query("SELECT * FROM user_info WHERE email = $1", [email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10); 

        const result = await pool.query(
            "INSERT INTO user_info (email,phone,address,password, name) VALUES ($1, $2, $3,$4 , $5) RETURNING *",
            [email,phone,address,hashedPassword, name]
        );
        const newUser = result.rows[0];
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};


// Login Controller
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const result = await pool.query("SELECT * FROM user_info WHERE email = $1", [email]);
  
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }
  
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
  
        // Create JWT Token
        const token = jwt.sign(
            { userId: user.id, email: user.email, name:user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
  
        // Set cookie with the token (httpOnly for security)
        res.cookie("authToken", token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
            sameSite: "Lax", // Adjust for CSRF protection
            maxAge: 3600000, // 1 hour
        });

        console.log("Cookie set successfully:", token); // Debugging log
  
        return res.json({
            message: "Login successful",
            user: { id: user.id, name: user.name, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};


  const authCheck = (req, res) => {

    const token = req.cookies.authToken; 

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ user: { id: decoded.userId, email: decoded.email, name:decoded.name } });
    } catch (error) {
        console.log("JWT Verification Failed:", error);
        return res.status(401).json({ message: "Invalid token" });
    }
};





module.exports = {
    createUser, loginUser ,authCheck }
