const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const connectDB = require("./config/db");
const {notFound,errorHandler} = require('./middleware/errorMiddleware');

connectDB();

app.use(cors());
app.use(express.json());

app.get('/api/health',(req,res)=>{
   res.json({status:'ok',message:"Restaurant api is running"})
})

const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', dashboardRoutes);

app.use(notFound)
app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`); 
})
