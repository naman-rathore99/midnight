# Midnight Radio - Project Progress State

**Last Updated:** August 14, 2026

This file tracks the current state of the "Midnight Radio" project to help resume work after switching environments.

## Current Architecture & Stack
* **Framework:** Next.js (App Router)
* **Styling:** Pure Vanilla CSS Modules (`.module.css`) with CSS Custom Properties
* **Design System:** Premium Glassmorphism (frosted glass, dark moody gradients, glowing accents, heavy drop shadows)
* **Animation:** Framer Motion (`motion/react`) for layout/modals, and highly optimized CSS `@keyframes` for the parallax background engine
* **Media:** YouTube IFrame API (via `useYouTubePlayer` hook)

## Features Completed
1. **The Music Engine (`useYouTubePlayer`)**
   * Seamless playback, pause, and skip functionality.
   * `previous()` track functionality powered by a 50-song history queue.
   * Circular "spinning vinyl" thumbnail animation during playback.

2. **The Parallax Background Engine (`CinematicBackground`) - INDIAN AESTHETIC OVERHAUL**
   * **HRTC Bus Window:** Parallax view out of an Indian bus into the snowy Himalayas with falling CSS snow.
   * **Indian Highway Truck:** Cabin view of an Indian truck at sunset with fast-moving road dash animations.
   * **Cutting Chai:** Moody night rain falling over a silhouetted local tea stall.
   * **Rooftop Mehfil:** A couple sitting on a rooftop with a city skyline and twinkling CSS stars.
   * **DJ Rakesh:** A vibrant street DJ setup with pulsing, colorful overlay lights.
   * **Sadabahar Charpai:** A man sleeping peacefully in a field under the moonlight with glowing CSS fireflies.

3. **Asset Generation**
   * High-quality 2D flat vector art scenes were generated to match the Indian aesthetic.
   * Assets live in `public/` as `.jpg` images (`hrtc_window.jpg`, `indian_truck.jpg`, `cutting_chai.jpg`, `rooftop_mehfil.jpg`, `dj_rakesh.jpg`, `sadabahar_charpai.jpg`).

4. **Lyrics Engine (`LyricsDisplay`)**
   * Time-synced lyrics that slide up the screen like Apple Music.
   * Demo synced data currently populated in `playlist.json` for "Kal Ho Naa Ho" and "Tum Hi Ho".

5. **Shayari / Quote System (`useShayari` & `ShayariDisplay`)**
   * Quotes appear *only* once when a track changes, lingering for 8 seconds before beautifully fading out.
   * Left-aligned, pure typography design with heavy drop shadows to pop against the animated backgrounds.

6. **"Drop a Thought" Modal (`ShayariInput`)**
   * Highly polished glassmorphic modal for users to submit their own quotes/thoughts.

## Pending / Next Steps
1. **Supabase Integration:** The Shayari API currently falls back to a hardcoded list because the Supabase backend isn't fully configured/seeded yet.
2. **Lyrics Data:** Add time-synced lyrics for the rest of the songs in `playlist.json`.

---
*Note: The dev server (`npm run dev`) was halted during the switch. You will need to restart it in the new environment.*
