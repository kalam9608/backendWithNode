import exporess from "express";
import cookieParser from "cookie-parser"
import cors from "cors"

const app=exporess();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(exporess.json({limit:"16kb"}))
app.use(exporess.urlencoded({extended:true,limit:"16kb"}))
app.use(exporess.static("public"))
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("bacekend")
})


export {app}