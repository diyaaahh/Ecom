const express = require("express");
const router = express.Router();

const{createUser, loginUser, authCheck}= require("../Controllers/userControllers")

router.post('/create', createUser)
router.post('/login', loginUser)
router.get('/auth', authCheck)


module.exports = router;