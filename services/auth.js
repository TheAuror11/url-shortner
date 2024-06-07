// const sessionIdToUserMap = new Map()

const jwt = require("jsonwebtoken")

function setUser(id,user){
    sessionIdToUserMap.set(id,user)
}

function getUser(id){
    return sessionIdToUserMap.get(id)
}

module.exports = {
    setUser,
    getUser,
}