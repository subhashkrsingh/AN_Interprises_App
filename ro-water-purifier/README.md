# RO Water Purifier Business Website

Full-stack RO Water Purifier Business website with a React + Vite frontend and Node.js + Express backend.

## Project structure

- `client/` — React + Vite frontend
- `server/` — Node.js + Express backend

## Setup

1. Install dependencies for server and client:

```bash
cd ro-water-purifier/server
npm install
cd ../client
npm install
```

2. Create environment files:

- Copy `.env.example` into `ro-water-purifier/.env`
- In `client`, create `.env` with `VITE_API_URL=http://localhost:5000`
- In `server`, create `.env` with `PORT=5000` and `CLIENT_ORIGIN=http://localhost:5173`

3. Run backend and frontend:

```bash
cd ro-water-purifier/server
npm run dev
```

In another terminal:

```bash
cd ro-water-purifier/client
npm run dev
```

## Notes

- The frontend uses `VITE_API_URL` to connect to the backend.
- Contact submissions are saved to `server/contacts.json`.
- The backend includes validation and centralized error handling.
