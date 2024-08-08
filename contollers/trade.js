const trade= require('../models/trade')

const parseCSV=async(req,res)=>{
    const {csvfile} = req.body.file;
}

const calculateBalace=async(req,res)=>{
    try{
                const {timestamp} = req.body
                
            const sold=await trade.aggregate([
                {
                    $match: {
                      UTC_time: {
                        $lte: {
                            $dateFromString: {
                                dateString: "2022-09-28 12:00:00",
                                format: "%Y-%m-%d %H:%M:%S",
                                timezone: "UTC"
                              }
                        }
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

module.exports={calculateBalace}