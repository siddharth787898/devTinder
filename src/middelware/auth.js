const adminAuth =(req ,res ,next)=>{
  console.log("admin is getting checked")
  const token = "xyz";
  const isAdminAuth = token==="xyz";
  if(!isAdminAuth){
    res.status(401).send("unAuthorized request")
  }else{
    next();
  }
}
module.exports={
adminAuth
}