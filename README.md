# Event Management App

This project is an event management application built using React.js for the frontend, Node.js or Django for the backend, and **PostgreSQL** for the database. It includes features for user dashboards, event creation, registration, on-site management, and waitlist management.

**Note:** This version uses PostgreSQL instead of Supabase for better local development and flexibility.

## Project Structure

```
event-management-app
├── frontend          # React.js frontend
│   ├── package.json
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── index.jsx
│   │   ├── App.jsx
│   │   ├── components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Dashboard
│   │   │   │   └── Dashboard.jsx
│   │   │   ├── Events
│   │   │   │   ├── EventCard.jsx
│   │   │   │   └── EventForm.jsx
│   │   │   └── OnSite
│   │   │       └── CheckInPanel.jsx
│   │   ├── pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── EventDetails.jsx
│   │   ├── services
│   │   │   └── supabaseClient.js
│   │   ├── hooks
│   │   │   └── useAuth.js
│   │   ├── styles
│   │   │   └── main.css
│   │   └── utils
│   │       └── helpers.js
│   └── .env
├── backend-node      # Node.js backend
│   ├── package.json
│   ├── src
│   │   ├── index.js
│   │   ├── controllers
│   │   │   ├── authController.js
│   │   │   └── eventController.js
│   │   ├── routes
│   │   │   └── index.js
│   │   ├── models
│   │   │   ├── userModel.js
│   │   │   └── eventModel.js
│   │   ├── services
│   │   │   └── supabaseService.js
│   │   └── utils
│   │       └── validators.js
│   └── .env
├── backend-django     # Django backend
│   ├── manage.py
│   ├── requirements.txt
│   ├── project
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── apps
│   │   ├── users
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   └── urls.py
│   │   └── events
│   │       ├── models.py
│   │       ├── views.py
│   │       └── urls.py
│   └── .env
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Tools and Dependencies

To run this website locally, you will need to install the following tools and dependencies:

1. **Node.js**: Required for the Node.js backend and React frontend.
2. **npm or yarn**: Package managers for managing JavaScript dependencies.
3. **Python**: Required for the Django backend.
4. **Django**: Install via pip using the `requirements.txt` file.
5. **PostgreSQL**: Set up a local PostgreSQL database for the application.
6. **Docker**: If using Docker for containerization, install Docker Desktop.
7. **Git**: For version control and managing the project repository.

## Configuration

Make sure to configure the `.env` files in both the frontend and backend directories with the necessary environment variables for PostgreSQL database connections. See `SETUP_POSTGRESQL.md` for detailed setup instructions.

## Getting Started

For detailed setup instructions, please refer to **[SETUP_POSTGRESQL.md](./SETUP_POSTGRESQL.md)**.

### Quick Start with Docker (Recommended)

1. Clone the repository
2. Create `.env` file in project root with database credentials
3. Run `docker-compose up`
4. Access the application at `http://localhost:3000`

### Quick Start Locally

1. Clone the repository
2. Install PostgreSQL and create database (see `SETUP_POSTGRESQL.md`)
3. Install frontend dependencies: `cd frontend && npm install && npm start`
4. Install backend dependencies and run servers (see `SETUP_POSTGRESQL.md`)
5. Set up your Supabase project and update the `.env` files with the required credentials.
6. Start the frontend and backend servers.

This README provides a high-level overview of the project and instructions for getting started. For detailed usage and development instructions, refer to the documentation within each respective directory.