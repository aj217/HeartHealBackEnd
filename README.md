# HeartHeal Backend 💖

A RESTful API backend for the HeartHeal mental wellness application, built with Node.js, Express, and MongoDB.

## 🌐 Live Demo
- **Backend API:** https://hearthealbackend.onrender.com
- **Frontend:** https://heart-heal-front-end.vercel.app

---

## ✨ Features
- 🔐 **Authentication** — Secure signup, login, forgot/reset password with JWT
- 📝 **Journal Entries** — Create, read, download journal entries with image uploads
- 📊 **Progress Tracking** — Mood stats, streaks, and journal counts
- 🎵 **Music Integration** — Spotify API mood-based music recommendations
- 💬 **Quotes & Affirmations** — Random quotes, favourites, and motivational affirmations
- 🎯 **Daily Challenges** — Earn XP by completing daily wellness challenges
- 🏆 **Achievements & Milestones** — Unlock badges and track milestones
- 👤 **User Profile** — Update name, bio, and profile picture with XP/level system

---

## 🛠 Tech Stack
- **Node.js** — Runtime environment
- **Express.js** — Web framework
- **MongoDB + Mongoose** — Database and ODM
- **JWT** — Authentication tokens
- **Bcrypt.js** — Password hashing
- **Multer** — File/image uploads
- **Nodemailer** — Email sending (password reset)
- **Helmet** — Security headers
- **Morgan** — HTTP request logging
- **Compression** — Response compression

---

## 📁 Folder Structure
```
HeartHealBackEnd/
│
├── config/           → DB connection and rate limiting config
├── controllers/      → Route logic and business logic
├── middleware/       → Auth, error, and upload middleware
├── models/           → Mongoose schemas
├── routes/           → Express route definitions
├── uploads/          → Stored media files
├── utils/            → Email and helper utilities
├── .env              → Environment variables (not committed)
├── .gitignore        → Git ignore file
├── package.json      → Dependencies
└── server.js         → Main entry point
```

---

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/aj217/HeartHealBackEnd.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_API_URL=https://api.spotify.com/v1
FRONTEND_BASE_URL=https://heart-heal-front-end.vercel.app
```

4. Start the server:
```bash
npm start
```

---

## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/update` | Update user profile |

### 📝 Journal
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/journal` | Create journal entry |
| GET | `/api/journal` | Get all entries |
| GET | `/api/journal/download/:id` | Download entry as file |

### 💬 Quotes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/quotes/random` | Get random quote |
| POST | `/api/quotes/favorite` | Save favourite quote |
| GET | `/api/quotes/favorites` | Get all favourites |
| DELETE | `/api/quotes/favorites/:id` | Delete favourite quote |

### 🎵 Music
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/music/spotify?mood=happy` | Get mood-based music |
| GET | `/api/music/search?query=lofi` | Search music |

### 🎯 Challenges & Achievements
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/challenges/daily` | Get daily challenge |
| POST | `/api/challenges/complete` | Complete challenge |
| GET | `/api/achievements` | Get achievements |
| GET | `/api/milestones` | Get milestones |

### 📊 Progress & Affirmations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/progress` | Get mood stats and streaks |
| GET | `/api/affirmations` | Get affirmations |

---

## 🌍 Deployment

| Service | Platform |
|---|---|
| Backend | Render |
| Database | MongoDB Atlas |
| Frontend | Vercel |

---

## 🔐 Security
- JWT-based route protection
- Password hashing with Bcrypt
- Rate limiting on all API routes
- CORS restricted to allowed origins
- Helmet for secure HTTP headers

---

## 👤 Contributors
- **aj217** — Full Stack Developer

---

## 📄 License
MIT License
