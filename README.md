# kairon-test
ETH Price Watch + Paper Trades

# Tech stack:
- **Frontend:** Next.js + Tailwind
    - TypeScript
- **Backend:** Python (FastAPI)
- **Storage:** SQLite

# Running Instructions:
**traditional and docker possible**
to run without docker:
- in the frontend folder: `npm install && npm run dev`
- in the backend folder: `pip3 install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --reload`
to run with docker:
- `docker compose up`
- navigate to `0.0.0.0:3000`
