# 🍬 Sweetify - Sweet Shop Management System

A full-stack candy shop e-commerce platform built with modern technologies, featuring a stunning Neo-Brutalism/Pop Art design aesthetic.

![Sweetify](https://img.shields.io/badge/Sweetify-Sweet%20Shop-E91E8C?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Testing](#-testing)
- [My AI Usage](#-my-ai-usage)

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based token authentication
- Role-based access control (User/Admin)

### 🛍️ Shop Features
- Browse all available sweets
- Search by name, category, or price range
- Add items to cart
- View product details
- Purchase items (decreases stock)

### 👨‍💼 Admin Features
- Add new sweets
- Update existing sweets
- Delete sweets (Admin only)
- Restock inventory (Admin only)

### 🎨 Design
- Neo-Brutalism meets 3D Pop Art aesthetic
- Glassmorphism effects
- Framer Motion animations
- Fully responsive design
- Skeleton loading states

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Validation**: Zod
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with CSS Variables
- **Routing**: React Router v6
- **State Management**: React Context + useReducer
- **Animation**: Framer Motion
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Sweetify
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   cp .env.example .env
   
   # Initialize database
   npx prisma db push
   
   # (Optional) Seed with sample data
   npm run prisma:seed
   
   # Start development server
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Demo Credentials
- **Admin**: admin@sweetify.com / admin123

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Sweets Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sweets` | Get all sweets |
| GET | `/api/sweets/search` | Search sweets |
| GET | `/api/sweets/:id` | Get single sweet |
| POST | `/api/sweets` | Create new sweet |
| PUT | `/api/sweets/:id` | Update sweet |
| DELETE | `/api/sweets/:id` | Delete sweet (Admin) |

### Inventory Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sweets/:id/purchase` | Purchase sweet |
| POST | `/api/sweets/:id/restock` | Restock sweet (Admin) |

### Example Request/Response

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123", "name": "John"}'

# Response
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John",
      "role": "USER"
    },
    "token": "jwt-token-here"
  }
}
```

## 📁 Project Structure

```
Sweetify/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   ├── src/
│   │   ├── middleware/        # Auth middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── types/             # TypeScript types
│   │   ├── utils/             # Utilities
│   │   └── index.ts           # Entry point
│   ├── tests/                 # Jest tests
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React Context providers
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── index.css          # Global styles
│   │   ├── App.tsx            # Main app
│   │   └── main.tsx           # Entry point
│   └── package.json
│
└── README.md
```

## 🧪 Testing

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

### Test Coverage

The backend includes comprehensive TDD tests for:
- ✅ User registration validation
- ✅ User login authentication
- ✅ Sweet CRUD operations
- ✅ Search functionality
- ✅ Purchase flow (stock management)
- ✅ Restock functionality (Admin only)
- ✅ Role-based access control

## 🤖 My AI Usage

This section documents how AI tools were used during the development of this project, as required by the project guidelines.

### AI Tools Used

1. **Claude (Anthropic)** - Primary AI assistant for code generation and architecture

### How AI Was Used

| Area | AI Contribution |
|------|-----------------|
| **Architecture** | Brainstormed project structure and technology choices |
| **Backend Setup** | Generated initial Express/TypeScript boilerplate with Prisma |
| **API Routes** | Generated route handlers with validation and error handling |
| **Authentication** | Implemented JWT middleware and role-based access control |
| **Frontend Design** | Created CSS design system matching Sweetify brand aesthetic |
| **React Components** | Generated reusable UI components with Framer Motion |
| **TDD Tests** | Generated comprehensive test suites for all endpoints |
| **Documentation** | Created README and API documentation |

### Specific Prompts & Results

1. **"Create a full-stack Sweet Shop Management System"**
   - AI generated complete project structure
   - Set up Express backend with Prisma/SQLite
   - Created React frontend with Vite

2. **"Make frontend look like the Sweetify design"**
   - AI created comprehensive CSS design system
   - Implemented Neo-Brutalism/Pop Art aesthetic
   - Added Framer Motion animations

3. **"Implement TDD tests for all endpoints"**
   - AI generated Jest/Supertest test suites
   - Covered auth, CRUD, and access control
   - High test coverage achieved

### Reflection on AI Impact

**Positives:**
- **Speed**: AI dramatically accelerated initial setup and boilerplate generation
- **Consistency**: Code follows consistent patterns and best practices
- **Documentation**: AI helped generate comprehensive documentation
- **Design**: AI translated visual design requirements into working CSS

**Learnings:**
- AI is excellent for scaffolding but requires human oversight for business logic
- Test generation works well but needs review for edge cases
- Design implementation benefits from iterative AI-human collaboration

**Challenges:**
- Some generated code needed adjustments for specific use cases
- SQLite enum compatibility required manual intervention
- AI sometimes over-generates, requiring pruning

### Commit Co-Authorship

All commits in this project include an AI co-author where applicable:

```
git commit -m "feat: Implement user authentication

Used AI to generate JWT middleware and auth routes.

Co-authored-by: Claude AI <claude@anthropic.com>"
```

---

## 📄 License

MIT License - feel free to use this project for learning and development!

---

Made with 🍬 by the Sweetify Team
