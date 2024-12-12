// app.js
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const authenticate = require('./middleware/authMiddleware');
const { swaggerUi, swaggerDocs } = require('./swagger');



const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

const dbURI = `${process.env.MONGO_URI}/${process.env.MONGO_DB_NAME}`
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/products', authenticate, productRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen(PORT, () => {
  console.log("========== Server running =========");
});
