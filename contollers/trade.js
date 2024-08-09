const trade= require('../models/trade')
const csv = require('csv-parser');
const fs = require('fs');

const parseCSV=async(req,res)=>{
  try{
    const filePath=`./${req.file.path}`
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
    res.status(500).send({
        message:"Something went wrong in parsing csv file",
        error:e
    })
  }  
}

const calculateBalace=async(req,res)=>{
    try{
                
            const {timestamp} = req.body
            const date = new Date(timestamp)

            const sold=await trade.aggregate([
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
            res.send(sold)
            console.log(sold);
    }
    catch(e){
        console.log(e);
        res.send(e)       
    }
}

module.exports={calculateBalace,parseCSV}