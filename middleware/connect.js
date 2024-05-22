
export const allowAccess = async (req,res,next) => {
  try{
    let token = req.header("AccessToken");
    if(!token) {
      return res.status(403).json("Access Denied")
    }

    if(token.startsWith("Bearer ")){
      token = token.slice(7,token.length).trimLeft();
    }
    const verified = token === process.env.SECRET
    if(!verified) return res.status(403).json("Invalid AccessToken")
    next();
  } catch (err) {
    res.status(500).json({error: err.message})
  }
}