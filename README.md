# CareerConnect — Monolithic Application

CareerConnect is a job-platform web application that connects candidates and companies. Candidates create a profile, browse job listings, apply for jobs, and track application statuses. Companies manage their company profile, publish job listings, add application questions, and review applications. Administrators manage users and company listings.

This is the monolithic version of the system: one ASP.NET Core backend application with one PostgreSQL database and one React frontend.

## Technology Stack

- Backend: ASP.NET Core 8, Entity Framework Core, PostgreSQL, JWT, SignalR
- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios
- Database: PostgreSQL

## Main Features

- Candidate, company, and administrator registration and sign-in
- JWT authentication and role-based authorization
- Candidate and company profiles
- Candidate education and work experience
- Creating, editing, closing, and searching job listings
- Job applications, company questions, and candidate answers
- Application status updates and notifications
- Real-time updates for notifications, jobs, questions, and applications through SignalR
- Job matching based on candidate skills and listing requirements
- Frontend and backend input validation

## Prerequisites

- .NET SDK 8
- Node.js 20 or newer
- PostgreSQL

## Database Setup

1. Create a PostgreSQL database, for example `CareerConnectDb`.
2. Create `backend/appsettings.Development.json` and add your local connection string. This file must not be committed.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=CareerConnectDb;Username=postgres;Password=YOUR_PASSWORD"
  }
}
```

3. Apply the existing migrations:

```bash
cd backend
dotnet ef database update
```

## Running the Application

Start the backend in one terminal:

```bash
cd /Users/torlakovic/Desktop/CareerConnect/backend
dotnet run --launch-profile http
```

- API: `http://localhost:5191`
- Swagger: `http://localhost:5191/swagger`

Start the frontend in a second terminal:

```bash
cd /Users/torlakovic/Desktop/CareerConnect/frontend
npm install
npm run dev
```

The monolith frontend environment file must contain:

```env
VITE_API_URL=http://localhost:5191/api
```

Vite prints the frontend URL after startup, usually `http://localhost:5173`.

## Build Verification

```bash
cd backend
dotnet build

cd ../frontend
npm run build
```

## Project Structure

```text
CareerConnect/
├── backend/      # ASP.NET Core API, domain logic, EF Core, SignalR
└── frontend/     # React user interface
```


