HeartHeal Backend 💖
A RESTful API backend for the HeartHeal mental wellness application, built with Node.js, Express, and MongoDB.
🌐 Live Demo

Backend API: https://hearthealbackend.onrender.com
Frontend: https://heart-heal-front-end.vercel.app


✨ Features

🔐 Authentication — Secure signup, login, forgot/reset password with JWT
📝 Journal Entries — Create, read, download journal entries with image uploads
📊 Progress Tracking — Mood stats, streaks, and journal counts
🎵 Music Integration — Spotify API mood-based music recommendations
💬 Quotes & Affirmations — Random quotes, favourites, and motivational affirmations
🎯 Daily Challenges — Earn XP by completing daily wellness challenges
🏆 Achievements & Milestones — Unlock badges and track milestones
👤 User Profile — Update name, bio, and profile picture with XP/level system


🛠 Tech Stack

Node.js — Runtime environment
Express.js — Web framework
MongoDB + Mongoose — Database and ODM
JWT — Authentication tokens
Bcrypt.js — Password hashing
Multer — File/image uploads
Nodemailer — Email sending (password reset)
Helmet — Security headers
Morgan — HTTP request logging
Compression — Response compression


📁 Folder Structure
HeartHealBackEnd/
│
├── config/           → DB connection and rate limiting config
├── controllers/      → Route logic and business logic
├── middleware/        → Auth, error, and upload middleware
├── models/           → Mongoose schemas
├── routes/           → Express route definitions
├── uploads/          → Stored media files
├── utils/            → Email and helper utilities
├── .env              → Environment variables (not committed)
├── .gitignore        → Git ignore file
├── package.json      → Dependencies
└── server.js         → Main entry point
