// require('dotenv').config({ptah:'./env'})
import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000,()=>{
      console.log(`this port is running on http://localhost:${process.env.PORT}`)
    })
    app.on("error",(err)=>{
      console.log(`error`,err)
      throw err
    })
  })
  .catch((err) => {
    console.log("MongoDb connection faild ");
    throw err;
  });

/*
import express from "express"

const app=express();


(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_UTL}/${DB_NAME}`)

    app.on("error",(error)=>{
        console.log("error:",error);
        throw error
    })

    app.listen(process.env.PORT,()=>{
        console.log(`App is ruuning in port  ${process.env.PORT}`)
    })
  } catch (error) {
    console.error("ERROR:-", error);
    throw error;
  }
})();
*/
