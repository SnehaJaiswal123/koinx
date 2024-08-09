const trade= require('../models/trade')
const csv = require('csv-parser');
const fs = require('fs');

const parseCSV=async(req,res)=>{
  try{
    //storing the file path locally
    const filePath=`./${req.file.path}`

    if(!filePath)
        return res.status(404).send({Error:"please provide CSV file"})

    //Parsing CSV file using csv parser
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data',async (data) => {
        await trade.create({
            userId:data.User_ID,
            UTC_time:data.UTC_Time,        
            operation:data.Operation,
            market:data.Market,
            amount:data['Buy/Sell Amount'],
            price:data.Price
        })
        console.log(data);       
    })
    .on('end', () => {
         res.status(201).send("CSV file is parsed")      
    });
  }
  catch(e){
    console.log(e);  
    res.status(500).send({
        message:"Something went wrong in parsing csv file",
        error:e
    })
  }  
}

const calculateBalace=async(req,res)=>{
    try{
                
            const {timestamp} = req.body;  //Destructuring timestamp from request body

            //Checking if timestamp is provided
            if(!timestamp)  
                return res.status(404).send({Error:"please provide timestamp"})

            //Converting timestamp in UTC Date format
            const date = new Date(timestamp)

            // Using aggregation pipeline to filter and group data to find the assest wise account balance
            const result=await trade.aggregate([
                {
                    $match: {
                      "UTC_time":{
                        "$lte":date
                      }
                    }
                },
                {
                    $group:{
                        _id:"$market",
                        buy:{
                            $sum:{
                                $cond: [ { $eq: ["$operation", "Buy" ] },"$amount",0]
                            }
                        },
                        sell:{
                            $sum:{
                                $cond: [ { $eq: ["$operation", "Sell" ] },"$amount",0]
                            }
                        }             
                    }
                },
                {
                    $addFields: {
                      amount: { $subtract: ["$buy", "$sell"] }
                    }
                },{
                    $project:{
                        _id:1,
                        amount:1
                    }
                }
            ])
            
            // if there is no transaction in given timestamp
            if(result.length==0) 
                return res.status(404).send("No asset transactions")

            res.status(200).send(result)
    }
    catch(e){
        console.log("Error in fetching data:",e);  
        res.status(500).send("Error in fetching data:",e)       
    }
}

module.exports={calculateBalace,parseCSV}