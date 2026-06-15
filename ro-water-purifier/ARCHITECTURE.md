# Architecture Overview & Developer Guide

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React 19)                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │
│  │   Login      │  │  Register    │  │   Google     │               │
│  │   Page       │  │   Page       │  │   OAuth      │               │
│  └──────────────┘  └──────────────┘  └──────────────┘               │
│         │                  │                  │                     │
│         └──────────────────┼──────────────────┘                     │
│                            │                                        │
│                  ┌─────────▼──────────┐                             │
│                  │  AuthContext      │                             │
│                  │  (useAuth hook)    │                             │
│                  └─────────┬──────────┘                             │
│                            │                                        │
│              ┌─────────────┼─────────────┐                          │
│              │             │             │                          │
│       ┌──────▼────┐ ┌─────▼────┐ ┌─────▼────┐                     │
│       │ authService│ │ apiService│ │ JWT Mgmt │                     │
│       │ (Business)│ │(Axios)   │ │ (Storage)│                     │
│       └─────┬──────┘ └────┬────┘ └─────┬────┘                     │
│             │             │            │                           │
│             └─────────────┼────────────┘                           │
│                           │                                        │
│                    HTTP/HTTPS Requests                             │
│              baseURL: http://localhost:5000/api                    │
│                           │                                        │
└───────────────────────────┼────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SERVER (Express + Node.js)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │  Middleware Stack                                       │        │
│  │  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐    │        │
│  │  │Helmet│CORS  │Parse │Cookie│JWT   │Rate  │Error │    │        │
│  │  └──────┴──────┴──────┴──────┴──────┴──────┴──────┘    │        │
│  └─────────────────────────────────────────────────────────┘        │
│                           │                                         │
│         ┌─────────────────┼─────────────────┐                       │
│         │                 │                 │                       │
│    ┌────▼─────┐   ┌──────▼────┐   ┌───────▼────┐                  │
│    │  Auth    │   │  Profile   │   │   Admin    │                  │
│    │  Routes  │   │   Routes   │   │   Routes   │                  │
│    │  /api/   │   │  /api/     │   │  /api/     │                  │
│    │  auth/*  │   │  profile/* │   │  admin/*   │                  │
│    └────┬─────┘   └──────┬────┘   └───────┬────┘                  │
│         │                 │               │                        │
│    ┌────▼─────────────────▼───────────────▼────┐                  │
│    │      Controllers (Business Logic)         │                  │
│    │  ┌─────────────┐   ┌──────────────┐      │                  │
│    │  │Auth         │   │Profile       │      │                  │
│    │  │Controller   │   │Controller    │      │                  │
│    │  └─────────────┘   └──────────────┘      │                  │
│    └────┬───────────────────────────────────────┘                  │
│         │                                       │                  │
│    ┌────▼───────────────────────────────────────▼──┐               │
│    │   Repositories (Data Access Layer)             │               │
│    │  ┌──────────────────────────────────────┐     │               │
│    │  │  userRepository (CRUD + Queries)     │     │               │
│    │  │  - findOne, findMany, create         │     │               │
│    │  │  - updateUser, deleteUser            │     │               │
│    │  │  - addRefreshToken, removeToken      │     │               │
│    │  └──────────────────────────────────────┘     │               │
│    └────┬──────────────────────────────────────────┘               │
│         │                                                          │
└─────────┼──────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────────┐
│               PostgreSQL Database (Port 5432)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────┐  ┌─────────────────┐  ┌──────────────┐            │
│  │ users        │  │ refresh_tokens  │  │ audit_logs   │            │
│  ├──────────────┤  ├─────────────────┤  ├──────────────┤            │
│  │ id (PK)      │  │ id (PK)         │  │ id (PK)      │            │
│  │ full_name    │  │ user_id (FK)    │  │ user_id (FK) │            │
│  │ email (UQ)   │  │ token (UQ)      │  │ action       │            │
│  │ username (UQ)│  │ created_at      │  │ ip_address   │            │
│  │ mobile (UQ)  │  │                 │  │ metadata     │            │
│  │ password     │  │                 │  │ created_at   │            │
│  │ role         │  │                 │  │              │            │
│  │ google_id    │  │                 │  │              │            │
│  │ ...more...   │  │                 │  │              │            │
│  └──────────────┘  └─────────────────┘  └──────────────┘            │
│                                                                      │
│  Indexes: email, username, mobile, user_id                          │
│  Relationships: refresh_tokens & audit_logs → users (CASCADE)       │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Diagram

### 1. Email/Username/Mobile Login Flow

```
┌──────────────┐
│  User enters │
│ email & pass │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│ POST /api/auth/login             │
│ { identifier, password }         │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ authController.login()                  │
│ 1. Find user by email/username/mobile   │
│ 2. Compare password with bcryptjs      │
│ 3. Generate JWT (15min expiry)         │
│ 4. Generate Refresh Token (30d expiry) │
└──────┬────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Response:                        │
│ {                                │
│   success: true,                 │
│   user: { id, email, role, ... },│
│   accessToken: "jwt.token.here"  │
│ }                                │
│ + Set Cookie: refreshToken       │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Frontend:                        │
│ 1. Save accessToken to storage   │
│ 2. Save user data to context     │
│ 3. Set Authorization header      │
│ 4. Redirect to /dashboard        │
└──────────────────────────────────┘
```

### 2. Google OAuth Flow

```
┌──────────────────┐
│ User clicks      │
│ "Sign in with    │
│ Google"          │
└──────┬───────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Google OAuth Dialog                  │
│ (Redirects to Google sign-in)        │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│ Google returns ID Token              │
│ (credential containing email, name)  │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ POST /api/auth/google            │
│ { credential: "id_token" }       │
└──────┬───────────────────────────┘
       │
       ▼
┌───────────────────────────────────────────┐
│ authController.googleAuth()               │
│ 1. Verify credential with Google library  │
│ 2. Extract: email, name, picture, sub    │
│ 3. Find or create user                   │
│ 4. Generate JWT + Refresh Token          │
│ 5. Mark email as verified                │
└──────┬────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Response:                        │
│ {                                │
│   success: true,                 │
│   user: { ...from db },          │
│   accessToken: "jwt.token"       │
│ }                                │
│ + Set Cookie: refreshToken       │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Frontend (same as email login)   │
│ Store token, user, redirect      │
└──────────────────────────────────┘
```

### 3. Token Refresh Flow

```
┌──────────────────────────────────┐
│ Access token expired (15min)     │
│ Make request to protected route  │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Axios interceptor catches 401    │
│ response.status === 401          │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ POST /api/auth/refresh           │
│ (Refresh token in cookie)        │
└──────┬───────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ authController.refreshToken()       │
│ 1. Read refresh token from cookie  │
│ 2. Verify JWT signature            │
│ 3. Find user by decoded ID         │
│ 4. Check token in database         │
│ 5. Generate new access token       │
│ 6. Generate new refresh token      │
└──────┬────────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Response:                        │
│ {                                │
│   success: true,                 │
│   accessToken: "new.jwt.token"   │
│ }                                │
│ + Set New Cookie: refreshToken   │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│ Frontend:                        │
│ 1. Save new accessToken          │
│ 2. Retry original request        │
│ 3. Request succeeds              │
└──────────────────────────────────┘
```

---

## Key File Locations & Responsibilities

### Backend Structure
```
server/
├── index.js                    # Express app, middleware, routes
├── .env                        # Environment variables (⚠️ DON'T COMMIT)
├── schema.sql                  # Database schema (auto-initialized)
├── config/
│   └── db.js                   # PostgreSQL connection + schema init
├── controllers/
│   ├── authController.js       # Auth business logic (register, login, google)
│   └── profileController.js    # Profile operations (update, change-pwd)
├── middleware/
│   ├── authMiddleware.js       # JWT verification for protected routes
│   ├── errorHandler.js         # Centralized error handling
│   └── rateLimiter.js          # Rate limiting (100 req/15min)
├── models/
│   └── User.js                 # User model interface (wraps repository)
├── repositories/
│   └── userRepository.js       # Database operations (CRUD)
└── routes/
    ├── authRoutes.js           # /api/auth/* endpoints
    └── profileRoutes.js        # /api/profile/* endpoints
```

### Frontend Structure
```
client/
├── .env                        # Environment variables (⚠️ DON'T COMMIT)
├── index.html                  # HTML entry, favicon reference
├── src/
│   ├── main.jsx               # React app entry, providers setup
│   ├── App.jsx                # Route definitions
│   ├── index.css              # Tailwind styles
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state (useAuth hook)
│   ├── services/
│   │   ├── apiService.js      # Axios instance (baseURL: /api)
│   │   └── authService.js     # API calls (uses apiService)
│   ├── hooks/
│   │   └── useAuth.js         # useAuth hook (imports AuthContext)
│   ├── components/
│   │   ├── ProtectedRoute.jsx # Requires authentication
│   │   ├── GoogleLoginButton.jsx
│   │   └── WhatsAppButton.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   └── ...others...
│   └── utils/
│       └── validators.js      # Form validation schemas (zod)
```

---

## Key Implementation Details

### Environment Validation (server/index.js)
```javascript
const validateEnvironment = () => {
  const required = {
    JWT_SECRET: 'JWT_SECRET',
    JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
    DATABASE_URL: 'DATABASE_URL',
    CLIENT_ORIGIN: 'CLIENT_ORIGIN',
    GOOGLE_CLIENT_ID: 'GOOGLE_CLIENT_ID',
  };

  const missing = Object.entries(required)
    .filter(([key]) => !process.env[key])
    .map(([_, display]) => display);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    process.exit(1);  // Fail fast
  }

  console.log('✅ Environment variables validated');
};
```

### JWT Token Creation (server/controllers/authController.js)
```javascript
const createAccessToken = (user) => 
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

const createRefreshToken = (user) => 
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
```

### Protected Routes (server/middleware/authMiddleware.js)
```javascript
const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authorization required.' 
    });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token.' 
    });
  }
};
```

### Frontend API Calls (client/src/services/authService.js)
```javascript
const authService = {
  login: async (payload) => {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  googleLogin: async (payload) => {
    const response = await api.post('/auth/google', payload);
    return response.data;
  },

  fetchMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};
```

### AuthContext (client/src/context/AuthContext.jsx)
```javascript
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const value = useMemo(() => ({
    currentUser,
    isAuthenticated: Boolean(token && currentUser),
    loading,
    login,
    logout,
    register,
    oauthLogin,  // For Google OAuth
  }), [currentUser, token, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## Development Workflow

### 1. Initial Setup
```bash
# Clone repo
cd ro-water-purifier

# Server setup
cd server
npm install
cp .env.example .env
# Edit .env with real JWT_SECRET, GOOGLE_CLIENT_ID

# Create database
createdb ro_water

# Client setup
cd ../client
npm install
cp .env.example .env
# Edit .env with VITE_GOOGLE_CLIENT_ID
```

### 2. Development
```bash
# Terminal 1: Server (auto-restarts with nodemon)
cd server
npm run dev

# Terminal 2: Client (Vite dev server)
cd client
npm run dev

# Visit http://localhost:5173
```

### 3. Testing Authentication
```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"TestPass123!"}'

# Test protected route
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your_jwt_token>"
```

### 4. Database Inspection
```bash
# Connect to DB
psql -U postgres -d ro_water

# View tables
\dt

# Check users
SELECT id, email, username, role, is_email_verified FROM users;

# Check tokens
SELECT user_id, token FROM refresh_tokens;
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "secretOrPrivateKey must have a value" | JWT_SECRET not set | Add JWT_SECRET to .env |
| 404 on /api/auth/register | API URL wrong | Check apiService baseURL |
| Google login fails | Invalid GOOGLE_CLIENT_ID | Get real ID from Google Cloud Console |
| Can't connect to PostgreSQL | Database not running | `brew services start postgresql` (Mac) |
| "too many connections" | Connection pool exhausted | Increase max_connections in PostgreSQL |
| PropTypes warning | Default params in function | Use function body defaults (fixed) |
| Token not persisting | Storage not working | Check localStorage/sessionStorage in DevTools |

---

## Production Checklist

- [ ] Update JWT_SECRET to production value (64+ char random)
- [ ] Update JWT_REFRESH_SECRET to production value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS (set COOKIE_SECURE=true)
- [ ] Update CLIENT_ORIGIN to production domain
- [ ] Update VITE_API_URL to production domain
- [ ] Verify Google OAuth credentials for new domain
- [ ] Set up database backups and replication
- [ ] Configure monitoring (APM, error tracking)
- [ ] Set up CI/CD pipeline for deployments
- [ ] Test complete flow in production environment
- [ ] Enable CORS only for production domain
- [ ] Disable debug logging in production
- [ ] Set up rate limiting alerts
- [ ] Document deployment procedure

---

**Last Updated**: 2026-06-06  
**Status**: Production Ready ✅
