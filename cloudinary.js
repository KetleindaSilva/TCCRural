const cloudinary =require('cloudinary').v2;
      
/*cloudinary.config({ 
  cloud_name: 'dflsgmfwr', 
  api_key: '188877766258398', 
  api_secret: 'HBB_u48GYZNKY7E7HA2MJhdorMY' 
});*/
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_KEY_SECRET 
});
module.exports = cloudinary;
