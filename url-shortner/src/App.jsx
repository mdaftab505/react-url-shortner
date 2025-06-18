import { useState } from 'react'
import './App.css'
import QRCode from 'qrcode'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import validator from 'validator'



const App = ()=>{

  const apiBaseUrl = import.meta.env.VITE_BACKEND_URL;
  const [url, seturl] = useState('')
  const [loader, setLoader]= useState(false)
  const [error, setError]= useState(false)
  const [shorturl, setShorturl]= useState('')
  const [isUrlSorted, setUrlSorted]= useState(false)
  const [fullUrl, setFullUrl]= useState('')
 
  const [open, setOpen] = useState(false)
  const [QRcode , setQRcode] = useState(' ')
  
const [errorMessage, setErrorMessage] = useState(false)

  const handChange= (event) =>{
        seturl(event.target.value)

  }



  const handleClick= async (e)=>{
    e.preventDefault();
    

    if(validator.isURL(url)){
 
    setError(false)
    setLoader(true)

    const response= await fetch(`${apiBaseUrl}/api`, {
      method:'POST',
      header: {
        'Content-Type': 'text/plain'
      },
      body:url

    });

    if(!response.ok){
      setError(true)
      setLoader(false)
      console.log(error)
      throw new Error(`HTTP error status: ${response.status}`)

    }
    setLoader(false)
    const data= await response.json();
    console.log(data)
    setShorturl(data.shortCode)
    setFullUrl(data.longUrl)
    setUrlSorted(true)
     }
    else{
      setErrorMessage(true)
    }


  }

  const handleVisitUrl= async(e)=>{
        e.preventDefault()


  window.open(`${apiBaseUrl}/api/${shorturl}`, '_blank');
}





const generateQR = async(e)=>{
  e.preventDefault()
  


    QRCode.toDataURL(`${apiBaseUrl}/api/${shorturl}`, function(err, url){
         setOpen(true)
       try{
          
        if(url){
           setQRcode(url)
        }
      
        
       }
       catch{
        console.log(err,{message:'error while generating QR Code'})
       }
        
  })  
    
}



const handleClose=()=> setOpen(false);

  return(
     <main className='max-w-7xl'>
   

                    {open && (
        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xs
 flex justify-center items-center z-10">
          <div className="bg-white w-[250px] p-5 rounded-[8px] text-center">
            <img
              src={QRcode}
              alt="Example"
              style={{ width: "100%", height: "auto" }}
            />
            <button onClick={handleClose} className="mt-[10px] py-[8px] px-[16px] bg-[#1976d2] text-white border-none cursor-pointer">
              Close
            </button>
          </div>
        </div>
      )}


       <div className=''>
        <header>
           <img src="../src/assets/logo.png" className='h-32 w-40 m-[10px]'/>
        </header>



        <div className='flex  flex-col md:flex-col-reverse '>

      { 
        !isUrlSorted && <div className='w-full flex justify-center items-center'>

          <form className='flex flex-col py-10 px-5 gap-1 w-[80%]  rounded-2xl bg-yellow-50'>

           <h2 className='text-2xl font-bold'> Shorten a long URL</h2>
            <p className='mb-3'>No credit card required.</p>

            <label  className='text-xl font-bold mb-2'>Paste your long link here</label>
            <div className='flex w-[100%] h-16 p-2.5 rounded-lg bg-white hover:outline-solid' >
                  <input
            type='text' 
            className='flex-1 outline-none' 
            placeholder='https://example.com/long-url'
            value={url}
            onChange={handChange} 
          
            />

            <button 
            onClick={(e)=>{
              e.preventDefault()
              seturl('')
              }}><CancelRoundedIcon /></button>
            </div>
        
            {error && <label className='text-red-500'>Something went wrong!</label>}
            {errorMessage && <label className='text-red-500'>Please enter Valid URL!</label>}
             <button className={`w-[100%] h-[40px] ${url?'bg-orange-600':' bg-gray-400 cursor-not-allowed' } mt-5 rounded-lg`} onClick={handleClick} disabled={!url}>{!loader?'Short your link':'Shorting...'}</button>
          </form>
              
        </div>
      }
          {
            isUrlSorted && <div className='w-full flex justify-center items-center'>

          <form className='bg-white flex flex-col py-10 px-5 gap-1 w-[80%] md:text-start  rounded-2xl  bg-yellow-50'>

           <h2 className='text-2xl font-bold'>Short URL below</h2>
              <input
            type='text' 
            className='w-[100%] h-16 p-2.5 rounded-lg bg-white' 
            value={`${apiBaseUrl}/api/${shorturl}`}
            disabled/>

            <label  className='text-xl font-bold mb-2'>Original URL</label>
            <input
            type='text' 
            className='w-[100%] h-16 p-2.5 rounded-lg bg-white' 
            value={fullUrl}
            disabled/>
            
             <div className='flex flex-start gap-1'>
              <button className=' p-2 bg-cyan-600 rounded-lg'  onClick={handleVisitUrl}>Visit Url</button>
              <button className=' p-2 bg-gray-600 rounded-lg text-white' onClick={generateQR}>Generate QR</button>

             


             </div>

             <button className='w-[100%] h-[40px] bg-orange-600 mt-5 rounded-lg' 
             onClick={()=>(window.location.href = '/api')}>Short another link</button>
          </form>
              
        </div>
          }


            <div className='flex text-center flex-col px-16 py-24 gap-1.5'>
                <h2 className='text-2xl font-bold'>Build stronger digital connections</h2>
                <p>Use our URL shortener, QR Codes, and landing pages to engage your audience and connect them to the right information. Build, edit, and track everything inside the Bitly Connections Platform.</p>
            </div>
  

        </div>

       </div>
       

     </main>
  )
}

export default App
