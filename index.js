const express = require("express")

const cookieParser = require("cookie-parser")
const path = require("path")
const connectToMongoDB = require("./connect")

const URL = require('./models/url')

const urlRouter = require("./routes/url")
const staticRoute = require("./routes/staticRoute")
const userRoute = require("./routes/user")
const { restrictToLoggedInUsersOnly, checkAuth } = require("./middlewares/auth")

const router = express.Router()

const PORT = 8002
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())


app.set("view engine","ejs")
app.set("views",path.resolve('./views'))

app.use("/url", restrictToLoggedInUsersOnly, urlRouter)
app.use("/",checkAuth,staticRoute)
app.use("/user",userRoute)

app.get("/test", async (req,res)=> {
    const allUrls = await URL.find({})
    return res.render('home',{
        urls: allUrls,
    })
})

connectToMongoDB("mongodb://127.0.0.1:27017/project-short-url").then(() => {
    console.log("Connected to MongoDB!")
})


app.get("/url/:shortId", async (req, res) => {
      const shortId = req.params.shortId;
      const entry = await URL.findOneAndUpdate(
        {
          shortId,
        },
        {
          $push: {
            visitHistory: {
              timestamp: Date.now(),
            },
          },
        }
      );
      res.redirect(entry.redirectURL);
      // res.redirect('https://' + entry.redirectURL);
})



app.listen(PORT ,() => console.log(`Server Started At PORT: ${PORT}`))
