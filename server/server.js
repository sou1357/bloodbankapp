import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import inventoryRoutes from './routes/inventory.js';
import bloodRequestRoutes from './routes/bloodRequests.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/blood-requests', bloodRequestRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'LifeFlow API is running' });
});

app.listen(PORT, () => {
  console.log(`🩸 LifeFlow server running on port ${PORT}`);
});
