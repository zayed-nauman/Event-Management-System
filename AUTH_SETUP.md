# Authentication Setup Guide

## Overview
Your Event Management App now uses secure JWT-based authentication with PostgreSQL.

## How Authentication Works

### 1. **Registration Flow**
- User fills registration form with: name, email, password, confirm password
- Frontend sends POST to `http://localhost:5000/api/auth/register`
- Backend validates input and checks if email already exists
- Password is hashed using bcryptjs (10 rounds)
- User record created in PostgreSQL `users` table
- JWT token is generated and returned
- User is redirected to login page

### 2. **Login Flow**
- User enters email and password
- Frontend sends POST to `http://localhost:5000/api/auth/login`
- Backend queries PostgreSQL for user by email
- Password is verified using bcryptjs
- JWT token is generated (valid for 24 hours)
- Token stored in localStorage as `auth_token`
- User is redirected to dashboard

### 3. **Protected Routes**
- Dashboard is now protected with `ProtectedRoute` component
- Checks if `auth_token` exists in localStorage
- Redirects to login if token is missing
- Automatically adds token to API requests via Axios

### 4. **Logout**
- Navbar shows logout button for authenticated users
- Clicking logout removes token from localStorage
- User is redirected to home page

## Database Setup

### Prerequisites
- PostgreSQL installed and running
- Node.js and npm installed

### Step 1: Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE event_management;

# Exit
\q
```

### Step 2: Run SQL Setup Script
```bash
# From project root directory
psql -U postgres -d event_management -f DB_SETUP.sql
```

This creates:
- `users` table - stores user credentials
- `events` table - stores event information
- `event_registrations` table - tracks attendees
- `waitlist` table - manages event waitlists

### Step 3: Verify Tables Created
```bash
psql -U postgres -d event_management

# List tables
\dt

# Check users table
SELECT * FROM users;

# Exit
\q
```

## Environment Configuration

### Backend (.env files already created)

**`backend-node/.env`:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_management
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
JWT_SECRET=your-secret-key-change-this
FRONTEND_URL=http://localhost:3000
```

**`backend-django/.env`:** (for future use)
```
USE_SQLITE=True
DJANGO_SECRET_KEY=...
DJANGO_DEBUG=True
```

### Frontend (.env file already created)

**`frontend/.env`:**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_BACKEND_URL=http://localhost:8000
```

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST http://localhost:5000/api/auth/register

Body:
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe"
}

Response:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login User
```
POST http://localhost:5000/api/auth/login

Body:
{
  "email": "user@example.com",
  "password": "secure_password"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

## Frontend Usage

### Login Hook (`useAuth.js`)
```javascript
import useAuth from '../hooks/useAuth';

const MyComponent = () => {
    const { user, loading, signIn, signOut } = useAuth();
    
    // Use in component
    if (loading) return <div>Loading...</div>;
    
    return <div>Welcome {user?.email}</div>;
};
```

### Protected Routes
```javascript
// In App.jsx
import ProtectedRoute from './components/ProtectedRoute';

<ProtectedRoute path="/dashboard" component={Dashboard} />
```

### API Calls with Authentication
```javascript
// Token is automatically added to all requests
const response = await axios.get('http://localhost:5000/api/events');

// Custom headers with token
const config = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
    }
};
const response = await axios.post('http://localhost:5000/api/events', data, config);
```

## Testing Authentication

### Test with cURL

1. **Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

2. **Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3. **Access Protected Resource** (using token from login):
```bash
curl -X GET http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### "Invalid email or password"
- Check that you're using correct credentials
- Ensure user exists in database
- Verify password matches database record

### "Module not found: bcryptjs"
```bash
cd backend-node
npm install bcryptjs jsonwebtoken
```

### "Cannot connect to database"
- Ensure PostgreSQL is running: `pg_ctl status`
- Verify connection string in `.env`
- Check database exists: `psql -l`

### "Token expired"
- Tokens expire after 24 hours
- User will need to login again
- Token can be refreshed by logging in

## Security Best Practices

✅ Passwords are hashed with bcryptjs (10 rounds)
✅ JWT tokens expire after 24 hours
✅ Tokens stored in localStorage (XSS vulnerable - consider httpOnly cookies for production)
✅ Protected routes prevent unauthorized access
✅ CORS configured for localhost

### For Production:
- Change JWT_SECRET to strong random string
- Use httpOnly cookies instead of localStorage
- Enable HTTPS
- Implement token refresh mechanism
- Add rate limiting on auth endpoints
- Use environment variables for all secrets
- Implement proper CORS policy
- Add input validation and sanitization

## Next Steps

1. ✅ Run DB_SETUP.sql to create tables
2. ✅ Update .env files with your PostgreSQL credentials
3. ✅ Start all services (React, Node, Django)
4. ✅ Test registration on http://localhost:3000/register
5. ✅ Test login on http://localhost:3000/login
6. ✅ Access dashboard at http://localhost:3000/dashboard (protected)

## Support

For issues or questions about authentication:
- Check backend logs: `npm start` output in backend-node
- Check frontend console: F12 in browser
- Review database: `psql -d event_management`
