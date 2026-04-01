# hype. Microservices

hype. is a simple microservices-based backend built with FastAPI.

## Services

- API Gateway (`gateway`) on port `8000`
- User Service (`user-service`) on port `8001`

The gateway forwards requests to backend services using internal service URLs.

## Project Structure

- `gateway/` - API Gateway service
- `user-service/` - User management service
- `requirements.txt` - Python dependencies for the project

## Prerequisites

- Python 3.10+
- `pip`

## Setup

From the project root:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run Services

Open separate terminals for each service.

### 1. Run User Service

```bash
cd user-service
uvicorn main:app --reload --port 8001
```

### 2. Run API Gateway

```bash
cd gateway
uvicorn main:app --reload --port 8000
```

## API Endpoints

### Gateway

- `GET /` - Gateway health/status
- `GET /gateway/users` - Fetch users through gateway

### User Service

- `GET /` - User service health/status
- `GET /api/users` - List all users
- `GET /api/users/{user_id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user

## Example Request

Create a user:

```bash
curl -X POST http://127.0.0.1:8001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"secret"}'
```

## Notes

- `user-service/user.db` is a local SQLite database.
- Make sure `user-service` is running before calling user endpoints through the gateway.
