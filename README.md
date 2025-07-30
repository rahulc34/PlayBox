# 🎬 PlayBox - YouTube Clone (MERN Stack)

PlayBox is a full-featured YouTube clone built with the MERN stack. It allows users to upload, watch, like/dislike videos, subscribe to channel, and comment with replies—mimicking the core functionality of YouTube.

## 🚀 Features

- 🔐 User Authentication (Email based verification and password reset )
- 🎥 Upload & stream videos
- 📝 Comment system with replies
- 👍 Like/Dislike functionality
- 📂 User profile with avatar and cover image uploads
- 🔍 Video filters
- 📈 View count tracking
- 📱 Responsive design for mobile and desktop

## 🧰 Tech Stack

### Frontend

- React.js + Vite
- CSS Modules
- Axios (with JWT/cookies)
- React Router

### Backend

- Node.js + Express.js
- MongoDB + Mongoose
- Cloudinary (media storage)
- Multer (file upload middleware)
- JWT Authentication
- CORS, dotenv, cookie-parser, bcrypt, pagination etc.

## 📁 Project Structure

```
playbox/
├── frontend/     # React (Vite) frontend
│   └── public/
│   └── src/
│       └── components/
│       └── pages/
│       └── contexts/
│       └── api/
│       └── assests/
│       └── layouts/
│       └── models/
│       └── utils/
│       └── app.jsx
│       └── main.jsx
├── backend/       # Node.js backend
|   └── public/
│   └── src/
│       └── controllers/
|       └── db/
│       └── models/
│       └── routes/
│       └── middleware/
│       └── utils/
│       └── app.js
│       └── index.js/
├── .env
├── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/playbox.git
cd playbox
```

### 2. Environment Variables

Create `.env` files in both `frontend/` and `backend/` directories.

**Frontend (.env):**

```
VITE_API_URL=https://your-backend-url.com
```

**Backend (.env):**

MONGODB_URI=your_mongodb_uri
REFRESH_TOKEN_SECRET=your_refesh_token_secret_key
ACCESS_TOKEN_SECRET=your_access_token_secret_key
RESET_PASSWORD_SECRET=your_reset_password_secret_key
RESET_PASSWORD_EXPIRY=5m
EMAIL_VERIFY_SECRET=email_verify_expiry_secret
EMAIL_VERIFY_EXPIRY=5m
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d
LOCAL_MONGODB_URI=mongodb://localhost:27017
NODEMAILER_EMAIL=your_email_to_send_email
NODEMAILER_APP_PASSWORD=your_email_app_password
CLIENT_ORIGIN=your_frontend_url

````

### 3. Install dependencies

```bash
# For frontend
cd frontend
npm install

# For backend
cd ../backend
npm install
````

### 4. Run the development servers

```bash
# In backend/
npm run dev

# In frontend/
npm run dev
```

## 🌐 Deployment

- Project Deployment link: https://playbox-frontend.vercel.app
- Frontend: [Vercel](https://vercel.com)
- Backend: [Render](https://render.com) or [Railway](https://railway.app)
- MongoDB: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 📸 Screenshots

### Homepage

![Homepage](./screenshots/homepage.png)

### Video Player

![Video Player](./screenshots/player.png)

## 🧪 Future Improvements

- Video recommendations
- Notifications
- Realtime chat (WebSocket)
- Dark mode toggle

## 📄 License

This project is licensed under the [MIT License](LICENSE).
