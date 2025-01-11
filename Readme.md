# Spardha.ai


## Features

- **Django Backend**: A robust REST API built with Django and Django REST Framework.
- **React Frontend**: A dynamic, responsive UI built with React and Vite.
- **PostgreSQL Database**: Reliable data storage with PostgreSQL.
- **Environment Configuration**: Environment-based settings management.

---

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (if not using Docker for the frontend)
- [Python 3.10+](https://www.python.org/) (if not using Docker for the backend)
- [PostgreSQL](https://www.postgresql.org/) (if not using Docker for the database)

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Spardha-Org/spardha.ai.git
cd spardha.ai
```

### 2. Backend Setup

#### Without Docker:

1. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\Activate.ps1
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up the database:
   - Setup your .env according to your `.env.template`.
   - Update the database settings in `settings.py`.
   - Apply migrations:
     ```bash
     python manage.py migrate
     ```
4. Start the server:
   ```bash
   python manage.py runserver
   ```

### 3. Frontend Setup

#### Without Docker:

1. Navigate to the `frontend` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Setup .env:
   - Setup according to `.env.template`.
4. Start the development server:
   ```bash
   npm start
   ```

### 4. Agent Setup

#### Without Docker:

1. Navigate to the `agent` directory:
   ```bash
   cd agent
   ```
2. Setup .env and cred.json:
   - Setup according to `.env.template`.
   - setup your cred.json file
     
3. Start the development server:
   ```bash
   python3 agent.py start
   ```

### 5. Database Setup

#### Without Docker:

1. Install PostgreSQL and create a database.
2. Update the database credentials in the backend's `settings.py`.
3. To populate your database with all agent configuration:
   ```bash
   cd server
   ```
4. Start the development server:
   ```bash
   python3 manage.py import_csv
   ```

### Commands with Docker

#### PostgreSQL:

- Create and run the container:
  ```bash
  docker run -d \
    --name postgres-container \
    -e POSTGRES_PASSWORD=<password> \
    -p 5432:5432 \
    <username>
  ```

#### Backend:

- Build the image:
  ```bash
  docker build --no-cache -t backend-image .
  ```
- Create and run the container:
  ```bash
  docker run -d -p 8000:8000 --env-file .env --name backend-container backend-image
  ```
- Create a superuser:
  ```bash
  docker exec -it backend-container python manage.py createsuperuser
  ```

#### Agent:

- Build the image:
  ```bash
  docker build -t agent-image .
  ```
- Run the container:
  ```bash
  docker run -d --env-file .env --name agent-container agent-image
  ```

#### Frontend:

- Build the image:
  ```bash
  docker build -t frontend-image .
  ```
- Run the container:
  ```bash
  docker run -d -p 3000:80 --name frontend-container frontend-image
  ```

#### Pull Commands for Pre-built Images:

If you want to pull the pre-built images, use the following commands:

```bash
docker pull nandishnaik/spardha.ai-agent:v0.0.1
docker pull nandishnaik/spardha.ai-frontend:v0.0.1
docker pull nandishnaik/spardha.ai-backend:v0.0.1
docker pull nandishnaik/spardha.ai-postgres:v0.0.1
```

#### General Command:

- To run any command within a container:
  ```bash
  docker exec -it <container_name> <command>
  ```

---

## Project Structure

```
project-root/
|├── agent/           # Worker Script
|├── server/          # Django backend
|├── client/          # React frontend
|├── requirements.txt # Project dependencies
|└── README.md        # Project documentation
```

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

---

## Contact
