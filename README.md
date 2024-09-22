# ClickHouse with Node.js Integration

This project demonstrates how to set up a ClickHouse database using Docker and integrate it with a Node.js application. The Node.js application provides API endpoints to create a table, insert data, and retrieve data.

## Prerequisites

- Docker and Docker Compose installed on your machine.
- Node.js (version 12 or higher) and npm installed.

## Getting Started

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone <repository-url>
cd clickhouse-integration
```

### 2. Docker Setup

#### Create a Docker Compose File

Create a file named `docker-compose.yml` in the project directory with the following content:

```yaml
version: '3.7'

services:
  clickhouse-server:
    image: clickhouse/clickhouse-server:latest
    container_name: clickhouse-server
    ports:
      - "8123:8123"   # HTTP interface
      - "9000:9000"   # Native interface for ClickHouse client
    environment:
      CLICKHOUSE_USER: default
      CLICKHOUSE_PASSWORD: ""
      CLICKHOUSE_DB: default
    volumes:
      - ./clickhouse_data:/var/lib/clickhouse

volumes:
  clickhouse_data:
```

#### Create Data Directory

Ensure the data directory exists and has the correct permissions:

```bash
mkdir -p ./clickhouse_data
sudo chown -R $(whoami):staff ./clickhouse_data
```

### 3. Start the ClickHouse Server

Run the following command to start the ClickHouse server using Docker Compose:

```bash
docker-compose up -d
```

### 4. Node.js Application Setup

In the same directory, run:

```bash
npm install express clickhouse body-parser
```

### 5. Start the Node.js Application

Run the Node.js server:

```bash
npm start
```

### 6. Testing the API

You can test the API endpoints using tools like Postman or curl:

- **Create Table**: 
  - `POST http://localhost:3000/create-table`
  
- **Insert Data**: 
  - `POST http://localhost:3000/insert`
  - Body:
    ```json
    {
      "id": 1,
      "name": "Alice",
      "age": 25
    }
    ```

- **Select Data**: 
  - `GET http://localhost:3000/select`

### Troubleshooting

- If you encounter permission issues with the ClickHouse container, ensure the `clickhouse_data` directory has the correct permissions and ownership.
- Check the logs of the ClickHouse container using:
  
  ```bash
  docker-compose logs clickhouse-server
  ```

### Cleanup

To stop and remove the containers and volumes, run:

```bash
docker-compose down
```

