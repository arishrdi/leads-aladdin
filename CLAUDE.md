# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a lead management system called "Leads Aladdin" - a Laravel + React application for managing sales leads in the carpet industry. The system uses Laravel 12 as the backend API with Inertia.js + React for the frontend.

## Development Commands

### Starting Development Environment

```bash
composer dev
# Starts: Laravel server, queue worker, logs (pail), and Vite dev server concurrently
```

### Building and Assets

```bash
npm run build           # Build for production
npm run build:ssr       # Build with SSR support
npm run dev             # Start Vite dev server
```

### Code Quality

```bash
npm run lint            # ESLint with auto-fix
npm run format          # Prettier formatting
npm run format:check    # Check formatting without fixing
npm run types           # TypeScript type checking
vendor/bin/pint         # Laravel Pint (PHP CS Fixer)
```

### Testing

```bash
composer test           # Run PHP tests (Pest)
vendor/bin/pest         # Direct Pest runner
```

### SSR Development

```bash
composer dev:ssr        # Development with SSR enabled
```

## Architecture

### Backend (Laravel)

- **Framework**: Laravel 12 with PHP 8.2+
- **Database**: SQLite (development), supports migration to other databases
- **Testing**: Pest framework for PHP testing
- **Authentication**: Laravel Breeze with Inertia.js

### Frontend (React + Inertia.js)

- **Framework**: React 19 with TypeScript
- **Routing**: Inertia.js (server-side routing)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **State Management**: Inertia.js handles page state, React hooks for component state
- **Icons**: Lucide React
- **Build Tool**: Vite with Laravel integration

### Key Technologies

- **Laravel Wayfinder**: Enhanced form handling and routing
- **Inertia.js**: SPA-like experience without API complexity
- **shadcn/ui**: Pre-built React components with Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework

## Project Structure

### Frontend Structure

- `resources/js/pages/` - Inertia.js page components
- `resources/js/components/` - Reusable React components
- `resources/js/layouts/` - Layout components for different page types
- `resources/js/hooks/` - Custom React hooks
- `resources/js/lib/` - Utility functions
- `resources/js/types/` - TypeScript type definitions

### Backend Structure

- `app/Http/Controllers/` - Laravel controllers organized by feature
- `app/Models/` - Eloquent models
- `routes/` - Route definitions (web.php, auth.php, settings.php)
- `database/migrations/` - Database schema migrations

## Business Domain

This application manages sales leads for a carpet business with:

### User Roles

- **Super User**: Full system access, manages users, branches, lead sources
- **Supervisor**: Reports access, can manage multiple branches
- **Marketing**: Creates leads, follow-ups, documents (single branch)

### Lead Status Flow

- **WARM** → **HOT** → **CUSTOMER** (success path)
- **EXIT** (declined) / **COLD** (no response) / **CROSS_SELLING** (upsell opportunities)

### Follow-up Process

- 10 stages: Greeting → Impresi → Small Talk → Rekomendasi → Pengajuan Survei → Presentasi → Form Pemesanan → Up/Cross Selling → Invoice → Konfirmasi Pemasangan
- Maximum 3 follow-ups per stage before lead becomes COLD
- Auto-scheduling with +3 day intervals (configurable)

## Important Notes

### UI/UX Requirements (from GUIDE.md)

- Primary color: #2B5235, Secondary: #DDBE75
- White sidebar background, primary color for active buttons
- Mobile-responsive design (users primarily use mobile)
- Indonesian language for UI (except lead stages/statuses)
- Use shadcn/ui components instead of browser alerts
- Date range filters for data
- Simple, easy-to-understand interface

### Configuration Lists (store in config files)

- Closing reasons: Promo, Survei, Bonus, Nawar, Rekomendasi, Repeat Order
- Non-closing reasons: Lokasi jauh, Barang yang dicari tidak ada, Harga, Jasa Pasang Aja, Tidak ada respon

### Phone Number Format

- Store phone numbers in international format (62xxx...)

### Development Practices

- Use existing shadcn/ui components consistently
- Follow the established Inertia.js patterns for page components
- Maintain TypeScript strict typing
- Use Laravel's form request validation
- Follow Laravel naming conventions for routes and controllers
- always check the guide @GUIDE.md
- store uploaded files directly to public
