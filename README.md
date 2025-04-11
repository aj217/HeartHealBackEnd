# HeartHeal Backend 💖 

This is the backend of HeartHeal built with Node.js, Express, and MongoDB. It handles all data operations, user authentication, media uploads, .txt generation, and XP tracking.

## Note

The backend is currently running locally

## API Base URLs

Use appropriate base URLs as per environment:

- Local:  
  http://localhost:5000

- AWS EC2 (IPv4):  
  http://13.40.182.97:5000

- DuckDNS + HTTPS (Live):  
  https://growstrong.duckdns.org

## Tech Stack

- Node.js
- Express.js
- MongoDB (via Mongoose)
- Multer (for file uploads)
- JSON Web Tokens (JWT)
- Nginx + Certbot (HTTPS with DuckDNS)
- PDFKit (for quote export)

## Folder Structure

backend
│
├── controllers/       --> Route logic
├── models/            --> Mongoose schemas
├── routes/            --> Express routes
├── middleware/        --> Auth & upload middleware
├── uploads/           --> Stored media files
├── utils/             --> PDF export utils
├── .env               --> Environment variables
└── server.js          --> Main entry file

## Getting Started

1. Clone the repo:
   https://github.com/aj217/HeartHealBackEnd.git

2.  Install dependencies:
   npm install

3. Create a `.env` file:
   It includes all the important credentials
 
4. Start the server:
   npm start or node server.js


## API Endpoints

-------------------------
AUTHENTICATION
-------------------------

POST    api/auth/register          → Register a new user  
POST     api/auth/login             → Log in existing user  

-------------------------
JOURNAL ENTRIES
-------------------------

POST     api/journals               → Create a new journal entry  
GET      api/journals               → Get all journal entries (for the logged-in user)  
GET      api/journals/:id           → Get a specific journal entry by ID  
DELETE   api/journals/:id           → Delete a journal entry  

-------------------------
QUOTES
-------------------------

GET      api/quotes                 → Get all quotes  
GET      api/quotes?mood=Happy      → Filter quotes by mood  
POST     api/quotes/favorites       → Save a quote to favorites  
GET      api/quotes/favorites       → Get all favorite quotes  
DELETE   api/quotes/favorites/:id   → Delete a favorite quote  
GET      api/quotes/export/pdf      → Export favorite quotes as PDF  

-------------------------
AFFIRMATIONS
-------------------------

GET      api/affirmations           → Get motivational affirmations (auto-refresh frontend every 10s)

-------------------------
DAILY CHALLENGE
-------------------------

GET      api/challenge              → Get today's daily challenge  
POST     api/challenge/complete     → Mark today’s challenge as completed and gain XP  

-------------------------
MILESTONES & ACHIEVEMENTS
-------------------------

GET      api/milestones             → Get unlocked milestones  
GET      api/achievements           → Get unlocked achievements  

-------------------------
USER PROFILE & XP
-------------------------

GET     /profile                → Get user profile info (XP, level, etc.)

## Security & Deployment

- JWT-based route protection
- File upload security
- HTTPS via DuckDNS, Nginx, and Let's Encrypt
- CORS enabled for frontend communication

---

## License

This project is licensed under the MIT License.



   

