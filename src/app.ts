import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/config';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/error';
import routes from './routes';

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
const start = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

const ethers = require('ethers');

// // Generate a random private key
const wallet = ethers.Wallet.createRandom();
const privateKey = wallet.privateKey;
console.log('Private Key:', privateKey);
console.log('Address:', wallet.address);
const message = 'Welcome to HyperBlock!\n\nPlease sign this message to verify your wallet ownership.\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nNonce: 874200';
const signature =  wallet.signMessage(message);

console.log('Signature:', signature);

start();