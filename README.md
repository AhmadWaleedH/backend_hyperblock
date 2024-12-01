# Backend HyperBlock

The Backend of the HyperBlock Website - A TypeScript Node.js application with Express framework.

## 📁 Project Structure

```
backend_hyperblock/
├── README.md
├── package.json
├── src/
│   ├── app.ts                 # Application entry point
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Express middlewares
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── tests/              # Test files
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn
- TypeScript (v4.0.0 or higher)

### Installation

#### Using npm:

```bash
# Clone the repository
git clone https://github.com/AhmadWaleedH/backend_hyperblock.git

# Navigate to project directory
cd backend_hyperblock

# Install dependencies
npm install

# Build the project
npm run build

# Start the development server
npm run dev

# Start production server
npm start
```

#### Using yarn:

```bash
# Install dependencies
yarn install

# Build the project
yarn build

# Start the development server
yarn dev

# Start production server
yarn start
```

## 📝 Available Scripts

```json
{
  "scripts": {
    "start": "node dist/app.js",
    "dev": "ts-node-dev --respawn --transpile-only src/app.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix"
  }
}
```

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 🛠️ Built With

- [Node.js](https://nodejs.org/) - Runtime environment
- [Express](https://expressjs.com/) - Web framework
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [MongoDB](https://www.mongodb.com/) - Database
- [Jest](https://jestjs.io/) - Testing framework

## 📚 API Documentation

API documentation can be found at `/api-docs` when running the server.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/tests/auth.test.ts
```

## 📦 Main Dependencies

- `express`: Web framework
- `mongoose`: MongoDB object modeling
- `jsonwebtoken`: JWT implementation
- `bcrypt`: Password hashing
- `zod`: Schema validation
- `winston`: Logging
- `cors`: Cross-Origin Resource Sharing
