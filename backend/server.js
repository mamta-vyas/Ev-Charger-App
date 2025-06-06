const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const chargerRoutes = require('./routes/chargerRoutes');

dotenv.config();
connectDB();

const app = express();

// ✅ Allow requests from your frontend Netlify domain
app.use(cors({
  origin: 'https://precious-meringue-374fb0.netlify.app',
  credentials: true, // if using cookies or authentication headers
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chargers', chargerRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
