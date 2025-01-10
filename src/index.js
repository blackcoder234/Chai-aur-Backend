// const dotenv = require("dotenv");

/*import dotenv from 'dotenv'
dotenv.config({
    path:"./env"
})     // if this approach is encountering any issue  add this to the package.json in the srcipt option --> "dev": "nodemon -r dotenv/config --experimental-json-modules   src/index.js"*/

import 'dotenv/config' // this is modern approach and there should not be any issue for this updated node.js
import connectDB from "./db/database.js"
import { app } from './app.js'
const port = process.env.PORT
connectDB()

.then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running on port: ${port}`)
        console.log(`Visit this link.... http://localhost:${port}`)
        
    })
})
.catch((error)=>{
    console.log("MongoDB Connection Error :", error)
    
})