import exporess from "express";
import cookieParser from "cookie-parser"
import cors from "cors"

const app=exporess();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(exporess.json({limit:"16kb"}))  //req body or form data 
app.use(exporess.urlencoded({extended:true,limit:"16kb"}))  // seaerch 
app.use(exporess.static("public"))
app.use(cookieParser())

// app.get("/",(req,res)=>{
//     res.send("bacekend")
// })

//imports  routes 
import userRoute from "./routes/user.route.js"
//routes declare here

app.use("/api/v1/users",userRoute)


export {app}