
# Blissful Planner - Wedding Planning App

A comprehensive PWA for wedding planning with guest management, budgeting, timeline tracking, and more.

## Features

- 📱 Progressive Web App (PWA) with offline capabilities
- 👥 Guest list management with RSVP tracking
- 💰 Budget planning and expense tracking
- 📅 Wedding timeline and task management
- 🏛️ Venue comparison and booking
- 🌸 Flower arrangement planning
- 👗 Wedding dress tracking
- 📸 Photo gallery management

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Netlify (Recommended)

1. Connect your repository to Netlify
2. Build settings are configured in `netlify.toml`
3. Deploy automatically on git push

### Other Static Hosts

The app builds to a `dist/` folder that can be deployed to any static hosting service:

- Vercel
- GitHub Pages
- Firebase Hosting
- AWS S3 + CloudFront

## PWA Features

- Install prompt for mobile devices
- Offline functionality via service worker
- App shortcuts for quick access
- Responsive design optimized for mobile

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind CSS
- **State**: TanStack Query
- **Forms**: React Hook Form + Zod
- **PWA**: Service Worker + Web App Manifest
