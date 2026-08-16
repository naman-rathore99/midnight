# Midnight Radio 📻🌙

An immersive, cinematic web-radio experience designed with a warm, nostalgic Indian aesthetic. Listen to curated lofi and soulful tracks while watching beautiful parallax scenes like an HRTC bus window in the rain, a sadabahar charpai setup, and more.

## ✨ Features

- **Cinematic Parallax Engine:** 6 unique, responsive 2D vector art scenes (HRTC Bus, Cutting Chai Rain, Rooftop Mehfil, etc.) that bring the music to life.
- **Dual Playlists:** Listen to the curated "Main Radio" or build your own vibe by adding songs to "My Playlist" (saved locally).
- **Hidden YouTube Engine:** Streams high-quality audio directly from YouTube in the background.
- **Community Driven:** Users can suggest songs and submit Shayaris (thoughts) directly from the interface.
- **Telegram Bot Admin:** Admins receive song and Shayari suggestions directly on Telegram with interactive **Accept / Reject** buttons.
- **Realtime Listeners:** Powered by Supabase Presence, track how many people are vibing with you in real-time.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Vanilla CSS Modules
- **Animations:** `motion/react` (Framer Motion)
- **Database & Realtime:** Supabase (PostgreSQL + Realtime Presence)
- **Integrations:** Telegram Bot API (Webhooks)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/naman-rathore99/midnight.git
cd midnight
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"

ADMIN_PASSWORD="your_admin_dashboard_password"

# Telegram Bot Integration (For receiving suggestions)
TELEGRAM_BOT_TOKEN="your_telegram_bot_token"
TELEGRAM_ADMIN_CHAT_ID="your_personal_telegram_chat_id"
```

### 4. Database Setup (Supabase)
Run the provided SQL script (`supabase_suggest_setup.sql`) in your Supabase SQL Editor to create the `song_suggestions` table.

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/naman-rathore99/midnight/issues) if you want to contribute. 

## ☕ Support the Project

If you love this project and want to help keep the servers running, consider buying me a coffee!

[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/cc4cc5bb-33f1-4ac6-a7e2-e180ae640a95)
