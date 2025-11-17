# Event Management App - PostgreSQL Setup Guide

This guide walks you through setting up and running the Event Management App with PostgreSQL instead of Supabase.

## Prerequisites

- **Node.js** (v14+) and npm
- **Python** (v3.8+) and pip
- **PostgreSQL** (v12+)
- **Docker** & **Docker Compose** (optional, for containerized setup)
- **Git**

## Option 1: Manual Setup (Local Development)

### Step 1: Install PostgreSQL

**Windows:**
1. Download from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer and remember the password for the `postgres` user
3. Ensure PostgreSQL service is running

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### Step 2: Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Run these commands in psql:
CREATE DATABASE event_management;
CREATE USER app_user WITH PASSWORD 'your_secure_password';
ALTER ROLE app_user SET client_encoding TO 'utf8';
ALTER ROLE app_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE app_user SET default_transaction_deferrable TO on;
ALTER ROLE app_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE event_management TO app_user;
\q
```

### Step 3: Initialize Database Schema

```bash
psql -U app_user -d event_management -f init.sql
```

### Step 4: Setup Environment Files

**backend-node/.env:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_management
DB_USER=app_user
DB_PASSWORD=your_secure_password
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

**backend-django/.env:**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=event_management
DB_USER=app_user
DB_PASSWORD=your_secure_password
DJANGO_SECRET_KEY=your_django_secret_key_here_change_in_production
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:3000
```

**frontend/.env:**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_BACKEND_URL=http://localhost:8000
```

### Step 5: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend (Node.js):**
```bash
cd backend-node
npm install
```

**Backend (Django):**
```bash
cd backend-django
pip install -r requirements.txt
python manage.py migrate
```

### Step 6: Run Application

**Terminal 1 - Frontend:**
```bash
cd frontend
npm start
```
Runs on `http://localhost:3000`

**Terminal 2 - Backend (Node.js):**
```bash
cd backend-node
npm run dev
```
Runs on `http://localhost:5000`

**Terminal 3 - Backend (Django):**
```bash
cd backend-django
python manage.py runserver
```
Runs on `http://localhost:8000`

---

## Option 2: Docker Setup (Recommended)

### Step 1: Create .env File

Create a `.env` file in the project root:

```
DB_HOST=postgres
DB_PORT=5432
DB_NAME=event_management
DB_USER=app_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_here
DJANGO_SECRET_KEY=your_django_secret_key_here
```

### Step 2: Build and Run with Docker Compose

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up

# Or run in detached mode
docker-compose up -d
```

**Services will be available at:**
- Frontend: `http://localhost:3000`
- Backend (Node): `http://localhost:5000`
- Backend (Django): `http://localhost:8000`
- PostgreSQL: `localhost:5432`

### Step 3: Initialize Django Database (if needed)

```bash
docker-compose exec backend-django python manage.py migrate
docker-compose exec backend-django python manage.py createsuperuser
```

### Useful Docker Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (deletes data)
docker-compose down -v

# Execute command in container
docker-compose exec backend-node npm run dev
```

---

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email
- `first_name`: User's first name
- `last_name`: User's last name
- `password_hash`: Encrypted password
- `is_active`: User account status
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Events Table
- `id`: Primary key
- `title`: Event title
- `description`: Event details
- `date`: Event date and time
- `location`: Event location
- `max_capacity`: Maximum attendees
- `user_id`: Foreign key to users (event creator)
- `created_at`: Event creation timestamp
- `updated_at`: Last update timestamp

### Event Registrations Table
- `id`: Primary key
- `event_id`: Foreign key to events
- `user_id`: Foreign key to users
- `registered_at`: Registration timestamp
- `checked_in`: Boolean flag for on-site check-in
- `checked_in_at`: Check-in timestamp

### Waitlist Table
- `id`: Primary key
- `event_id`: Foreign key to events
- `user_id`: Foreign key to users
- `added_at`: Waitlist join timestamp

---

## API Endpoints

### Node.js Backend (Port 5000)
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/register` - Register for event
- `POST /api/events/:id/checkin` - Check in to event
- `GET /api/waitlist/:eventId` - Get event waitlist
- `POST /api/waitlist` - Add to waitlist

### Django Backend (Port 8000)
- Similar endpoints available through Django REST Framework

---

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -U app_user -d event_management -h localhost

# Check if PostgreSQL service is running
# Windows: Services > PostgreSQL
# macOS: brew services list
# Linux: sudo service postgresql status
```

### Port Already in Use

If ports 3000, 5000, 8000, or 5432 are in use:

```bash
# Find process using port
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess

# macOS/Linux
lsof -i :5000

# Kill process
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### Django Migration Issues

```bash
# Reset migrations (development only)
python manage.py migrate --zero users
python manage.py migrate --zero events

# Re-run migrations
python manage.py migrate
```

### Docker Issues

```bash
# Clean up Docker
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

---

## Security Considerations

1. **Change default passwords** in `.env` files
2. **Use strong JWT secrets** for both Node and Django
3. **Enable HTTPS** in production
4. **Set DEBUG=False** in Django production
5. **Use environment variables** for all secrets
6. **Set up proper CORS** for cross-origin requests

---

## Next Steps

1. Create superuser account for Django admin
2. Configure authentication (JWT or sessions)
3. Set up event notifications
4. Implement real-time updates with WebSockets
5. Add email verification
6. Set up monitoring and logging

---

## Support

For issues or questions, refer to:
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Django Documentation](https://docs.djangoproject.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
