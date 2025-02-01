# Office Management System

This project is an Office Management System built using Docker, PostgreSQL, Redis, and a Node.js API. It allows you to manage office-related tasks efficiently.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker**: Follow the installation instructions [here](https://docs.docker.com/get-docker/).
- **Docker Compose**: Follow the installation instructions [here](https://docs.docker.com/compose/install/).

## Getting Started

To set up and run the project, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/tommy457/Office-Management-System.git
cd office-management-system
```

### 2. Create a `.env` File

Create a `.env` file in the root directory and add your environment variables. Here’s a sample check .env.example `.:

### 3. Start the Services

Run the following command to build and start the services in detached mode:

```bash
docker-compose up --build -d
```

This command will:

- Build the necessary images (including the API).
- Start the PostgreSQL, Redis, and API containers.

### 4. Check Container Status

Once the services are up, check the status of your containers by running:

```bash
docker ps
```

Ensure all the services (PostgreSQL, Redis, and API) are running.

### 5. Access the API

The API will be available at the following URL:

[http://127.0.0.1:5000](http://127.0.0.1:5000)

### 6. Check the Postman Collection

You can use the provided Postman collection to test the API endpoints. Import the collection into Postman and make sure the API is running at [http://127.0.0.1:5000](http://127.0.0.1:5000) to start testing the available endpoints.
