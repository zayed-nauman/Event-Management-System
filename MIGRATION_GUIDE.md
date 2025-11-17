# Migration from Supabase to PostgreSQL

This document explains the changes made to migrate from Supabase to PostgreSQL.

## Summary of Changes

### Backend - Node.js

**Files Modified:**
- `package.json` - Removed `supabase` dependency, added `pg`, `bcryptjs`, `jsonwebtoken`
- `src/services/supabaseService.js` - Replaced with PostgreSQL queries using `pg` package
- Created `src/services/db.js` - PostgreSQL connection pool

**Key Changes:**
```javascript
// Before (Supabase)
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key);
const { data, error } = await supabase.from('events').select('*');

// After (PostgreSQL)
const pool = require('./db');
const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
```

### Backend - Django

**Files Modified:**
- `requirements.txt` - Removed `supabase==0.1.0`, added `djangorestframework-simplejwt`
- `project/settings.py` - Updated database configuration, added REST Framework and CORS

**Database Configuration:**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'event_management'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'postgres'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

### Docker

**Files Modified:**
- `docker-compose.yml` - Replaced Supabase service with PostgreSQL service

**New Services:**
- `postgres` - PostgreSQL 15 with health checks and volume persistence
- Updated environment variables for all backends

### Environment Configuration

**New `.env` Structure:**
```
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_management
DB_USER=app_user
DB_PASSWORD=secure_password

# Node.js
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000

# Django
DJANGO_SECRET_KEY=your_secret_key
DJANGO_DEBUG=True
```

## Benefits of PostgreSQL

1. **Full Control** - Run locally without external dependencies
2. **Cost-Effective** - No monthly subscription fees
3. **Performance** - Direct database access, lower latency
4. **Flexibility** - Customize schema and queries freely
5. **Scalability** - Easy to deploy to any server
6. **Development** - Faster iteration and easier debugging

## Migration Path for Existing Data

If you had data in Supabase, follow these steps:

1. Export data from Supabase (CSV or JSON)
2. Transform data to match PostgreSQL schema
3. Import into local PostgreSQL database
4. Test all functionality

## Database Schema

The schema is defined in `init.sql` and includes:
- **users** table for authentication
- **events** table for event management
- **event_registrations** table for registration tracking
- **waitlist** table for event waitlist management

## Frontend Changes

The frontend still uses the same API structure but now calls:
- Node.js backend on port 5000
- Django backend on port 8000

Environment variables in `frontend/.env`:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Running the Application

### Option 1: Docker (Recommended)
```bash
docker-compose up
```

### Option 2: Local Development
```bash
# Terminal 1: PostgreSQL (ensure running)
# Terminal 2: Frontend
cd frontend && npm start

# Terminal 3: Backend Node
cd backend-node && npm run dev

# Terminal 4: Backend Django
cd backend-django && python manage.py runserver
```

## Troubleshooting

**Q: "Connection refused" error?**
- Ensure PostgreSQL is running
- Check DB_HOST and DB_PORT in `.env`

**Q: Database tables not created?**
- Run `psql -U app_user -d event_management -f init.sql`
- Or use Django migrations: `python manage.py migrate`

**Q: Frontend can't connect to backend?**
- Check API URLs in `frontend/.env`
- Ensure backends are running on correct ports

## Next Steps

1. Customize database schema as needed
2. Implement application-specific features
3. Set up monitoring and logging
4. Configure production deployment
5. Set up CI/CD pipeline
