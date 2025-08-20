const express = require("express");
const router = express.Router();

const{createUser, loginUser, authCheck, checkAdmin}= require("../Controllers/userControllers")

router.post('/create', createUser)
router.post('/login', loginUser)
router.get('/auth', authCheck)
router.get('/admin-check', checkAdmin);


module.exports = router;