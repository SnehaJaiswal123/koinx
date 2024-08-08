const mongoose=require('mongoose')

async function db(){
   try{
    
   const m =await mongoose.connect('mongodb://127.0.0.1:27017/koinx')
   console.log("db connected"); 
   }
   catch(e){
    console.log(e);
    
   }
}

db()

module.exports=db