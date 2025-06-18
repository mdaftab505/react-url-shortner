import express from 'express'
import bodyParser from 'express'
import  {urlDetails}  from './urlDetails.js'
import shortid from 'shortid'
const app= express()
import axios from 'axios'
import 'dotenv/config'


import pool from './server.js'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({entend:false}))
app.use(express.text());



// app.post('/api', (req, res)=>{
//   const data = req.body;
//   let sendData
//  const isUrlpresent= urlDetails.find(url=> url.fullUrl === data)
  

//   if(isUrlpresent){
//    sendData={
//     'fullUrl': isUrlpresent.fullUrl,
//     'shortUrl': isUrlpresent.shortUrl
//    }
//   }
//   else{
//  sendData = {
//     'fullUrl': data,
//     'shortUrl': shortid.generate()
//   }
//   urlDetails.push(sendData);
// }
  
//   return res.send(JSON.stringify(sendData)); 
// })




app.post('/api', async (req, res) => {

   
  const  longUrl  = req.body;

  if (!longUrl) return res.status(400).json({ message: "longUrl is required" });

  try {
    // Step 1: Check if the long URL already exists
    const existing = await pool.query(
      'SELECT short_code FROM shorturl WHERE long_url = $1',
      [longUrl]
    );

  if (existing.rows.length > 0) {
      // If found, return the existing short code
      return res.status(200).json({ shortCode: existing.rows[0].short_code, longUrl });
    }

    // Step 2: If not found, generate and insert new short code
    const shortCode = shortid.generate();

    await pool.query(
      'INSERT INTO shorturl (short_code, long_url) VALUES ($1, $2)',
      [shortCode, longUrl]
    );

    res.status(201).json({ shortCode, longUrl });

  } catch (err) {
    console.error(err);

 res.status(500).send('Error processing request');
  }
});   


app.get('/api/:short', async(req, res)=>{

   try{

     const {short}=req.params
  
     console.log('param is this'+short)
     const fullurlDetail= await pool.query(
      'SELECT long_url FROM shorturl WHERE short_code = $1',
      [short]
      
    );

     
      if (fullurlDetail.rows.length == 0) {
      // If found, return the existing long url 
    
          res.status(500).send('long url not found');


      }
       const longurl= fullurlDetail.rows[0].long_url
      console.log(longurl)
      return res.redirect(longurl)
      }
      catch (err) {
    console.error('Error in /api/www:', err);
    res.status(500).send('Server error occurred');
  }

})







// app.get('/api/:short',(req, res)=>{

//     try{
//     const param=req.params
//             console.log(param)

//      const fullurlDetail= urlDetails.find(url=> url.shortUrl === param.short)
//       const redictlink= fullurlDetail?.fullUrl
//         console.log(redictlink)
//         if(redictlink){
//        return res.redirect(302,redictlink)
//         }
//       }
//       catch (err) {
//     console.error('Error in /api/www:', err);
//     res.status(500).send('Server error occurred');
//   }
    
// })


const port= process.env.PORT || 3000

app.listen(port, ()=>{
    console.log(`server is running on port: ${port}`)
})