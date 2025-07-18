# Bliss - Wedding Planning App

## Overview

Bliss is a comprehensive wedding planning application built as a client-side web application with local storage. It helps couples organize their wedding by managing guests, budget, venues, general wedding services (makeup, hair, photography, etc.), dresses, timeline tasks, and vendors all in one place. The app features a modern, responsive design with a pastel green color scheme and provides an intuitive user experience for wedding planning. All data is stored locally in the browser for privacy and immediate access.

Key features include:
- Photo upload capability for venues, dresses, and services from device gallery
- Working phone and email functionality with clickable links
- Budget system starting at 0 for easy customization
- General wedding services instead of flower-specific functionality
- Complete offline functionality with local storage

## System Architecture

The application follows a monorepo structure with a clear separation between client and server code:

- **Frontend**: React-based SPA with TypeScript, using modern UI components and state management
- **Backend**: Express.js REST API server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Build System**: Vite for frontend bundling and development, esbuild for server compilation
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom pastel green theme

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **API Design**: RESTful API with consistent error handling
- **File Structure**: Modular route handlers and storage abstraction layer

### Database Schema
The database includes tables for:
- **Guests**: Name, contact info, RSVP status, dietary restrictions
- **Budget Categories & Expenses**: Financial planning with categories and expense tracking
- **Venues**: Venue information, capacity, pricing, booking status
- **Flowers**: Floral arrangements with types, florists, and pricing
- **Dresses**: Wedding dress tracking with fittings, designers, and status
- **Vendors**: Service provider management with categories and contact details
- **Tasks**: Timeline management with priorities, due dates, and status tracking

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express routes handle requests and validate data using Zod schemas
3. **Storage Layer**: Abstracted storage interface manages database operations via Drizzle ORM
4. **Database**: PostgreSQL stores all wedding planning data with relationships
5. **Response Flow**: Data flows back through the same layers with proper error handling

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, React DOM
- **Routing**: wouter
- **State Management**: @tanstack/react-query
- **Form Handling**: react-hook-form, @hookform/resolvers
- **Validation**: zod, drizzle-zod
- **UI Components**: @radix-ui/* components, class-variance-authority
- **Styling**: tailwindcss, clsx, tailwind-merge

### Backend Dependencies
- **Server**: express
- **Database**: drizzle-orm, @neondatabase/serverless
- **Development**: tsx for TypeScript execution
- **Build**: esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin
- **TypeScript**: Full type safety across frontend and backend
- **Development**: Hot reload and error overlay for improved DX

## Deployment Strategy

The application is configured for deployment on Replit with:

- **Development Mode**: `npm run dev` - runs TypeScript server with hot reload
- **Production Build**: `npm run build` - builds both frontend and backend
- **Production Start**: `npm run start` - runs compiled JavaScript server
- **Database**: PostgreSQL 16 module configured in Replit
- **Port Configuration**: Server runs on port 5000, exposed as port 80
- **Environment**: NODE_ENV-based configuration for development vs production

The build process:
1. Frontend builds to `dist/public` using Vite
2. Backend compiles to `dist/index.js` using esbuild
3. Production server serves static files and API from single process

## Recent Changes

```
Recent Changes:
- June 27, 2025: Added scrolling functionality to all select dropdowns across forms for better usability
- June 27, 2025: Fixed Netlify deployment configuration for pure client-side app
- June 27, 2025: Created standalone client build configuration with proper dependencies
- June 27, 2025: Updated build process to work with local storage only (no backend required)
- June 27, 2025: Optimized Netlify configuration with correct publish directory and build commands
- June 26, 2025: Fixed progress calculation to be based on completed tasks vs total tasks
- June 26, 2025: Enhanced photo upload functionality with proper file validation and input clearing
- June 26, 2025: Changed phone display to show information instead of clickable buttons
- June 26, 2025: Added progress connection to timeline with clickable button and task completion card
- June 26, 2025: Implemented bottom footer "More" button with full navigation access including timeline
- June 26, 2025: Fixed scrolling issues for all large forms on big screens with proper overflow constraints
- June 26, 2025: Removed non-functional flower page and updated navigation
- June 26, 2025: Fixed budget system to start at 0 for easy customization
- June 26, 2025: Converted services from flower-specific to general wedding services
- June 26, 2025: All data migrated to local storage for offline functionality
- June 26, 2025: Initial setup completed
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```