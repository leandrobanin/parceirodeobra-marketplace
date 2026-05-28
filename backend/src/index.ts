import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

import { env } from './config/env';
import { prisma } from './lib/prisma';
import apiRoutes from './routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();
const PORT = env.port;

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || env.allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '100kb' }));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Obra Certa API is running' });
});

// Route mounting
app.use('/api', apiRoutes);

// Global error handling middleware (registered after all routes)
app.use(errorMiddleware);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

async function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
