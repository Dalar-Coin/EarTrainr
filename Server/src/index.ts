import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDatabase } from './config/database';
import userRoutes from './routes/userRoutes';
import { errorHandler } from './middleware/errorHandler';

import path from 'path';

console.log('Current working directory:', process.cwd());
console.log('Attempting to load .env file from:', path.resolve(process.cwd(), '.env'));

dotenv.config();

console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Is set' : 'Is not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Is set' : 'Is not set');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler);

connectDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch(error => {
  console.error('Failed to connect to the database:', error);
});

console.log('Starting server...');