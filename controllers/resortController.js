const jwt = require("jsonwebtoken")

const Resorts = require("../models/resortModel");
const Users = require("../models/UserModel");



function tokenReader(token){
    const decoded = jwt.verify(token,'adminsecret');
    return decoded._id
  }
  

const getResort = async(req,res)=>{
    try {
       
        const token = req.headers.authorization?.split(" ")[1];

        const HosterId = tokenReader(token);
        console.log(HosterId);

const Hoster =  await Users.findById({_id:HosterId})

const ResortData = await Resorts.findById({_id:Hoster.resort_id});

if(ResortData){
    res.status(200).send({data:ResortData,Hoster})
}




    } catch (error) {
        console.log(error.message);
    }
}

const saveResortData = async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]
        const hosterId = tokenReader(token)
      const hoster = await Users.findById({_id:hosterId})
   const data  = req.body.data
 console.log(data);
   await Resorts.updateOne({
    _id:hoster.resort_id
   },{$set:{
    resort_type:data.type,
    resortName:data.resortName,
    resortAdress:data.address,
    email:data.email,
    mobile:data.mobile,
    location:data.location,
    occupency:data.occupency
    
   }})

   await Users.updateOne({_id:hosterId},{$set:{name:data.hosterName}})

res.status(200).send({message:"saved successfully"})

    } catch (error) {
        console.log(error.message);
    }
}

const saveRestaurent = async(req,res)=>{
  console.log("restau works");
try {
    const token = req.headers.authorization?.split(" ")[1]
        const hosterId = tokenReader(token)
        console.log(hosterId);
        console.log(req.body);
        const data = {name:req.body.data.restaurant,distance:parseInt(req.body.data.distance)}

      await Resorts.findOneAndUpdate({hoster_id:hosterId},{$push:{restaurants:data}})
      const resortData = await Resorts.findOne({hoster_id:hosterId})
  const    restaurant = resortData.restaurants
       console.log(restaurant);

        res.status(200).send({data:restaurant})



} catch (error) {
    console.log(error.message);
}

}


const getRestaurants = async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]
        const hosterId = tokenReader(token)

        const Resortdata = await Resorts.findOne({hoster_id:hosterId})

        res.status(200).send({data:Resortdata.restaurants})
     

    } catch (error) {
        console.log(error.message);
    }
}

const getSurroundings = async(req,res)=>{
    try {
        
const token  = req.headers.authorization?.split(" ")[1]
const hosterId = tokenReader(token)

const resortData = await Resorts.findOne({hoster_id:hosterId})

const data = resortData.surroundings

res.status(200).send({data})


    } catch (error) {
        console.log(error.message);
    }
}



const saveSurrounding = async(req,res)=>{

try {

    const token = req.headers.authorization?.split(" ")[1]
    const hosterId = tokenReader(token)

    const surr = req.body.data
   const data = {type_name:surr.type_name,description:surr.description}

   await Resorts.findOneAndUpdate({hoster_id:hosterId},{$push:{surroundings:data}})
    
res.status(200).send({message:"success"})


} catch (error) {
    console.log(error.message);
}


}

const saveitemsToSurroundings = async(req,res)=>{

    try {

        const token = req.headers.authorization?.split(" ")[1]
        const hosterId = tokenReader(token)

        const surr = req.body.data
        const type_name = surr.type_name
       
        const newItem = {name:surr.name,   distance_From_Resort: parseInt(surr.distance_From_Resort) }

        const resort = await Resorts.findOne({ hoster_id: hosterId });

const surroundingToUpdate = resort.surroundings.find(surr => surr.type_name === type_name);

surroundingToUpdate.items.push(newItem);

await resort.save();
res.status(200).send({message:"success"})

    } catch (error) {
        console.log(error.message);
    }
}


const deleteSurrounding = async(req,res)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1]
        const hosterId = tokenReader(token)
const type = req.body.data
        await Resorts.findOneAndUpdate({hoster_id:hosterId},{$pull:{surroundings:{type_name:type}}})

res.status(200).status({message:"success"})
    } catch (error) {
        console.log(error.message);
    }
}

const deleteRestaurant = async(req,res)=>{
    try {
        
const token = req.headers.authorization.split(" ")[1];
const hosterId = tokenReader(token)
const type = req.body.data

await Resorts.findOneAndUpdate({hoster_id:hosterId},{$pull:{restaurants:{name:type}}})
res.status(200).send({message:"success"})

    } catch (error) {
        console.log(erro.message);
    }
}




  //  Amenties....

const addAmenties = async(req,res)=>{
    try {
        

        const token = req.headers.authorization.split(" ")[1];
        const hosterId = tokenReader(token);
  const amenti = req.body.data
  const data = {name:amenti.name,description:amenti.description}
        await Resorts.findOneAndUpdate({hoster_id:hosterId},{$push:{amenities:data}});

        res.status(200).send({message:"successs"});



    } catch (error) {
        console.log(error.message);
    }
}

const getAmenties = async(req,res)=>{
    try {
        

        const token = req.headers.authorization.split(" ")[1];
        const hosterId = tokenReader(token)

        const ResortData = await Resorts.findOne({hoster_id:hosterId});
        const amenties = ResortData.amenities

        res.status(200).send({data:amenties})

    } catch (error) {
        console.log(error.message);
    }
}

const deleteAmenties = async(req,res)=>{
    try {
        
        const token = req.headers.authorization.split(" ")[1];
        const hosterId = tokenReader(token)

        const name = req.body.data

        await Resorts.findOneAndUpdate({hoster_id:hosterId},{$pull:{amenities:{name:name}}})

        res.status(200).send({message:"deleted amenti successfully"})


    } catch (error) {
        console.log(error.message);
    }
}

const submitImages = async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const hosterId = tokenReader(token)
        console.log(req.files);
const img = []
       for (let i=0 ; i<req.files.length;i++){
img.push(req.files[i].filename)
       }


         await Resorts.findOneAndUpdate({hoster_id:hosterId},{$push: { images: { $each: img } }})

       res.status(200).send({message:"success"})


        
    } catch (error) {
        console.log(error.message);
    }
}

const getImages = async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const hosterId = tokenReader(token)

        const ResortData = await Resorts.findOne({hoster_id:hosterId})

    const images = ResortData.images
    const banner = ResortData.Banner_img
    const mainImg = ResortData.show_img
    console.log(ResortData.images);

   res.status(200).send({images,banner,mainImg})

    } catch (error) {
        console.log(error.message);
    }
}


const addToMainImage = async(req,res)=>{
    try {
          
        const token = req.headers.authorization.split(" ")[1];
        const hosterId = tokenReader(token)

        const index = parseInt(req.body.index)
        const imagesData = await Resorts.findOne({hoster_id:hosterId})
        const newImg = imagesData.images[index] 
        if(imagesData.show_img.length>5){
            const deletionImg = imagesData.show_img[0]
            await Resorts.findOneAndUpdate({hoster_id:hosterId},{$pull:{show_img:deletionImg}})
        }

        await Resorts.findOneAndUpdate({hoster_id:hosterId},{$push:{show_img:newImg}})

        res.status(200).send({message:"image setting successfull"})

    } catch (error) {
        console.log(error.message);
    }
}

const addAsBanner = async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const hosterId = tokenReader(token)

        const index = parseInt(req.body.index)
        const ResortData = await Resorts.findOne({hoster_id:hosterId})
        const BannerImg = ResortData.images[index]
        await Resorts.findOneAndUpdate({hoster_id:hosterId},{$set:{Banner_img:BannerImg}})
        res.status(200).send({message:"Banner image updated successfull"})


    } catch (error) {
        console.log(error.message);
    }
}

const deleteImg = async(req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const hosterId = tokenReader(token)

     const index = parseInt(req.body.index)
     const ResortData = await Resorts.findOne({hoster_id:hosterId})
     const deletionImg = ResortData.images[index]
     await Resorts.findOneAndUpdate({hoster_id:hosterId},{$pull:{images:deletionImg}}).then(()=>{
        res.status(200).send({message:"image deletion successfull"})
     })


    } catch (error) {
        console.log(error.message);
    }
}

const editAmentis = async(req,res)=>{
    try {
        
const data = req.body.data
const id = req.body.id
const hoster = req.admin_id

await Resorts.findOneAndUpdate({hoster_id:hoster,'amenities._id':id},{$set:{ 'amenities.$': data }},{new:true}).then(()=>{
    res.status(200).send({message:"updated"})
})

    } catch (error) {
        console.log(error.message);
    }
}

const editResorts = async(req,res)=>{
    try {
        
const data = req.body.data
const id = req.body.id
const hoster = req.admin_id

await Resorts.findOneAndUpdate({hoster_id:hoster,'restaurants._id':id},{$set:{ 'restaurants.$': data }},{new:true}).then(()=>{
    res.status(200).send({message:"updated"})
})

    } catch (error) {
        console.log(error.message);
    }
}

const editSurroundings = async(req,res)=>{
    try {
        
        const hoster = req.admin_id;
        const resort = await Resorts.findOne({ hoster_id: hoster });
        const data = req.body.data;
        const id = data.id;
        
        let updated = false;
        
        resort.surroundings.forEach((surrounding) => {
          const itemIndex = surrounding.items.findIndex((item) => item._id.toString() === id);
          if (itemIndex !== -1) {
            // Update the nested item based on its _id
            surrounding.items[itemIndex] = data;
            updated = true;
          }
        });
        
        if (updated) {
          // Save the updated resort document
          await resort.save();
          res.status(200).send({ message: 'updated' });
        } else {
          res.status(404).send({ message: 'Item not found' });
        }
        
        



    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    getResort,
    saveResortData,
    saveRestaurent,
    getRestaurants,
    saveitemsToSurroundings,
    saveSurrounding,
    getSurroundings,
    deleteSurrounding,
    deleteRestaurant,
    addAmenties,
    getAmenties,
    deleteAmenties,
    submitImages,
    getImages,
    addToMainImage,
    addAsBanner,
    deleteImg,
    editAmentis,
    editResorts,
    editSurroundings
}