const Users = require("../models/UserModel")
const Resorts = require("../models/resortModel")
const Sales = require("../models/superAdminsalesModel")
const Bookings  =require("../models/bookingsModel")
const ResortSales = require("../models/resortSalesModel")
const Reviews = require("../models/reviewsModel")




function arrConvert(arr) {
    const count = []

    for (let item of arr) {
        for (let i = 0; i < 12; i++) {
            if (item._id === i) {
                count[i] = item.count
            } else {
                if (count[i] < 1 || count[i] == null) {
                    count[i] = 0
                }

            }
        }
    }
    return count
}


function   TOTAL(arr){
    const total =   arr.reduce((prev,curr)=>{
       return prev+curr.count
      },0)
    
      return total
    }


const AdmincChartData = async (req, res) => {
    try {
       // user data
        const UserCount = await Users.aggregate([
            {
                $group: {
                    _id: {
                        $month: '$Date',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ])

        //resort data

        const resorts = await Resorts.aggregate([{
            $group: {
                _id: {
                    $month: "$date"
                },
                count: {
                    $sum: 1
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }])

// sales daata

const sale = await Sales.aggregate([
    {
        $group: {
          _id: {
            $month: '$date'  
          },
          totalSales: {
            $sum: '$price' 
          },
          count:{
            $sum:1
          }
        }
      },
      {
        $project: {
          _id: 1,         
          
          totalSales: 1  ,
          count:1 
        }
      },
      {
        $sort: {
          month: 1  
        }
      }
])

    

        var totalAmount = 0
        for(let x=0;x<sale.length;x++){
             totalAmount = totalAmount+sale[x].totalSales
        }

        const saleAmountGraph = []

        for (let item of sale) {
            for (let i = 0; i < 12; i++) {
                if (item._id === i) {
                    saleAmountGraph[i] = item.totalSales
                } else {
                    if (saleAmountGraph[i] < 1 || saleAmountGraph[i] == null) {
                        saleAmountGraph[i] = 0
                    }

                }
            }
        }




        // ready to send response  here
        const usercount = arrConvert(UserCount)
        const resortcount = arrConvert(resorts)
        const salesdata = arrConvert(sale)
        const totalUsers = TOTAL(UserCount)
        const totalResorts = TOTAL(resorts)
        const totalSales = TOTAL(sale)



        res.status(200).send({ usercount, resortcount, totalUsers, totalResorts ,sales:totalAmount ,salesdata ,totalSales ,saleAmountGraph})

    } catch (error) {
        console.log(error.message);
    }
}



const resortChart = async(req,res)=>{
    try {
        console.log("1");
     const adminId = req.admin_id
     const resort = await Resorts.findOne({hoster_id:adminId})
     const hi = await Bookings.findOne({resoert_id:resort._id});
     console.log(hi);
     const bookings = await Bookings.aggregate([
        {
          $match: {
            resoert_id:resort._id.toString(),
            placed: true
           
          }
        },
        {
          $group: {
            _id: {
              $month: "$date"
            },
            count: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ]).exec()
      
    console.log("1");

    const resortsales = await ResortSales.aggregate([
        {
          $match: {
            resort_id: resort._id.toString()
          }
        },
        {
          $group: {
            _id: {
              $month: "$date"
            },
            count: {
              $sum: 1
            },
            totalAmount: {
              $sum: "$amount"
            }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ]);
      
      console.log("1");
      
      const avgrating = await Reviews.aggregate([
        {
            $match: {
                resort_id: resort._id.toString() 
            }
        },
        {
            $group: {
                _id: {
                  $month:"$date"
                },
                totalReviews: { $sum: 1 },
                totalRatings: { $sum: "$rating" }
            }
        },
        {
            $sort: {
                _id: 1 
            }
        }
      ]);
      

console.log(avgrating);

console.log(bookings);
console.log(resortsales);

const totalSaleAmount = resortsales[0].totalAmount

const bookingdata = arrConvert(bookings)
const salesdata = arrConvert(resortsales)
const totalSales = TOTAL(resortsales)
const totalBookings = TOTAL(bookings)


res.status(200).send({bookingdata,salesdata,totalBookings,totalSales,resort,totalSaleAmount});


    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    AdmincChartData,
    resortChart
}