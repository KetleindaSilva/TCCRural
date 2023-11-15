const cloudinary =require('cloudinary').v2;
      
cloudinary.config({ 
  cloud_name: 'dflsgmfwr', 
  api_key: '188877766258398', 
  api_secret: 'HBB_u48GYZNKY7E7HA2MJhdorMY' 
});

module.exports = cloudinary;
