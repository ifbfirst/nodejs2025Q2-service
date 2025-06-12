# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- Docker - [Download & Install Docker](https://www.docker.com/get-started).
- PostgreSQL (optional) - If the application runs in Docker, local installation is not required. If running locally (npm start), make sure PostgreSQL is installed and running on port 5432.

## Downloading

```
git clone {repository URL}
```

## Installing NPM modules

```
npm install
```

## Environment variables

Before running the application, create a `.env` file and add environment variables or use .env.example:

```sh
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=mydatabase
```

Use this if running locally (without Docker):

```sh
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydatabase
```

Use this if running in Docker:

```sh
DATABASE_URL=postgresql://myuser:mypassword@postgres_db:5432/mydatabase
```

## Starting PostgreSQL locally

If you are running the application **without Docker (`npm start`)**, make sure PostgreSQL is installed and running.

### **Start PostgreSQL manually**

```sh
sudo systemctl start postgresql  # Linux/Mac
net start postgresql  # Windows
```

### **Verify that PostgreSQL is running**

```sh
psql -U myuser -d mydatabase -c 'SELECT NOW();'
```

## Running application locally

```
npm start
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Running application from Docker

```
docker-compose up --build
```

## For monitoring application logs while running

```
docker logs my_app --follow
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging
