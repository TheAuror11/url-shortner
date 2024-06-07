const { v4: uuidv4 } = require("uuid")

const User = require("../models/users")
const { setUser } = require("../services/auth")

async function handleUserSignUp(req,res) {
    const {name, email, password } = req.body
    await User.create({
        name,
        email,
        password,
    })
    
    return res.redirect("/")
}

async function handleUserLogIn(req,res) {
    const { email, password } = req.body

    const user = await User.findOne({ email, password })
    if(!user) return res.render("login", {
        error: "Invalid Username or Password",
    })

    const sessionId = uuidv4()
    setUser(sessionId,user)
    
    res.cookie("uid",sessionId)

    return res.redirect("/")
}


module.exports = {
    handleUserSignUp,
    handleUserLogIn,
}