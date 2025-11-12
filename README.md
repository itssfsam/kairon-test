# Kairon Test
Take home assignment for Friday

---

## Tech Stack

- Frontend: Next.js + Tailwind CSS
  - Language: TypeScript
- Backend: Python (FastAPI)
- Database / Storage: SQLite

---

## Running the Project

### Without Docker
1. `cd backend`
2. `pip3 install -r requirements.txt`
3. `uvicorn main:app --host 0.0.0.0 --reload`
4. `cd ../frontend`
5. `npm install`
6. `npm run dev`

---

### With Docker

1. `docker compose up`
2. Open the app in your browser:
   http://0.0.0.0:3000

---

## Remarks / Notes

- Caching:
  Back and forth data can be far better cached both for database queries and for http requests but simplicity was prioritized for this project.

- Environment Variables:
  .env files are shared for ease of setup. In production, this is unsafe and should be avoided.