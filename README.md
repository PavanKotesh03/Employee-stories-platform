# Employee Story Platform

A full-stack web application designed to create, manage, and share employee stories in a structured and engaging way.

## Project Structure

employee-story-platform/
│
├── backend/                 # Backend API and business logic
│
├── frontend/                # Frontend web application
│
│
├── .gitignore
├── README.md
└── LICENSE
```

## Architecture

The application follows a full-stack architecture:

┌──────────────────────┐
│      Frontend        │
│   Web Application    │
└──────────┬───────────┘
           │
           │ REST APIs
           ▼
┌──────────────────────┐
│       Backend        │
│   API / Business     │
│       Logic          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│       Database       │
└──────────────────────┘
```

## Main Components

### Backend

The backend is responsible for:

* API endpoints
* Authentication and authorization
* Employee story management
* Business logic
* Database operations
* Data validation
* Error handling



### Frontend

The frontend is responsible for:

* User interface
* Employee story creation
* Story browsing
* Story management
* Authentication screens
* Communication with backend APIs





## Getting Started

### Clone the repository

```bash
git clone https://github.com/PavanKotesh03/Employee-stories-platform.git
cd Employee-storyies-platform
```

### Backend

```bash
cd backend
```

Install the backend dependencies according to the instructions in `backend/README.md`.

### Frontend

```bash
cd frontend
```

Install the frontend dependencies according to the instructions in `frontend/README.md`.

## Environment Variables

Environment-specific configuration should be stored in `.env` files.

Do not commit secrets, passwords, API keys, tokens, or production credentials to GitHub.

Use `.env.example` files to document required environment variables.

## Development

The project is divided into two independently runnable applications:

* `backend` – API and server-side application
* `frontend` – client-side application

Both applications communicate through APIs.

## Contributing

1. Create a feature branch.
2. Make your changes.
3. Test your changes locally.
4. Commit your changes.
5. Push the branch.
6. Create a Pull Request.

## License

This project is licensed under the MIT License.
