const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

connectDB();

app.use(cors());
app.use(express.json());

// Serve static assets from frontend build directory if it exists
const frontendDistPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: "Restaurant api is running" });
});

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

// SPA client-side routing fallback: serve index.html for any GET request that is not an API call
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(frontendDistPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
  }
  next();
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
