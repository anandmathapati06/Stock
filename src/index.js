import { fetchStock } from "./stockData.js";
import axios from 'axios'
import express from 'express'
import cors from 'cors'
const app = express()

app.use(cors())
app.use(express.json())


app.get('/indicies',async (req,res)=>{
  
    console.log("going");
    
    try {
        const result =await fetchStock("https://www.nseindia.com/api/index-names")
        res.send(result.data.stn)
        // console.log(result);
        
        
    } catch (error) {
        res.status(404).json({
            message : "failed",
            success : false
        })
        console.log(error);
        
    }
})

app.post('/getit',async (req,res)=>{

    const { value } = req.body
       
    console.log(value)
    const result  = await fetchStock(`https://www.nseindia.com/api/equity-stockIndices?index=${value}`)
    // const data = result
   

        res.send(result.data);
    
    
    
})




app.listen(9999,()=>{
    console.log("Ready....");
    
})