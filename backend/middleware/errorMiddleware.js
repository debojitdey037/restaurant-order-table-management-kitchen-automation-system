const notFound = (req,res)=>{
    res.status(404).json({message : `Route not found`})
}

const errorHandler = (err,req,res,next)=>{
    console.log(err.message);
    res.status(500).json({message: err.message}) 
}

module.exports = {notFound,errorHandler}