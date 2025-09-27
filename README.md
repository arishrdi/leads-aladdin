# Leads Aladdin

A lead management system for the carpet industry built with Laravel 12 and React. This application provides a complete workflow for managing sales prospects from initial contact to customer conversion.

## 🚀 Key Features

- **Multi-Level User Management**: Super User, Supervisor, and Marketing roles with different access levels
- **Comprehensive Lead Tracking**: From WARM status to CUSTOMER with structured follow-up workflow
- **Automated Follow-up System**: 10 stages with maximum 3 follow-ups per stage
- **Document Management**: Upload and categorize lead-related documents
- **Dashboard & Reports**: Data visualization and exportable reports
- **Responsive Design**: Optimized for mobile usage

## 🛠 Tech Stack

### Backend
- **Laravel 12** with PHP 8.2+
- **SQLite** (development)
- **Pest** for testing
- **Laravel Breeze** for authentication

### Frontend
- **React 19** with TypeScript
- **Inertia.js** for routing
- **Tailwind CSS v4** with shadcn/ui components
- **Vite** for build tool

## 📋 Prerequisites

- PHP 8.2+
- Node.js 18+
- Composer
- SQLite

## 🏃‍♂️ Quick Start

### 1. Clone & Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate
```

### 3. Start Development

```bash
# Start all development services (Laravel, queue, logs, Vite)
composer dev
```

Application will be available at `http://localhost:8000`

## 🔧 Development Commands

### Running Environment

```bash
composer dev        # Start all development services
composer dev:ssr    # Development with SSR enabled
```

### Build & Assets

```bash
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run build:ssr   # Build with SSR support
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
composer test       # Run PHP tests (Pest)
vendor/bin/pest     # Direct Pest runner
```

## 📊 Lead Workflow

### Lead Status
- **WARM**: Potential customer making first contact
- **HOT**: Requested design/location survey
- **CUSTOMER**: Decided to purchase
- **EXIT**: Decided not to purchase
- **COLD**: No clarity after 3 follow-ups
- **CROSS_SELLING**: Testimonials and other product offers

### Follow-up Stages
1. Greeting
2. Impression
3. Small Talk
4. Recommendation
5. Survey Request
6. Presentation
7. Order Form
8. Up/Cross Selling
9. Invoice (Payment)
10. Installation Confirmation

**Rules**: Maximum 3 follow-ups per stage, automatic +3 day intervals

## 👥 User Roles

### Super User
- CRUD Users, Branches, Lead Sources
- Assign branches to supervisors and marketing staff
- Access reports from all branches
- Access to all branches

### Supervisor
- View reports
- Can manage 1+ branches

### Marketing
- Create leads and follow-ups
- Create documents
- Can only have 1 branch

## 🗂 Project Structure

### Frontend (`resources/js/`)
```
pages/          # Inertia.js page components
components/     # Reusable React components
layouts/        # Layout components
hooks/          # Custom React hooks
lib/            # Utility functions
types/          # TypeScript type definitions
```

### Backend (`app/`)
```
Http/Controllers/   # Laravel controllers
Models/            # Eloquent models
```

## 🎨 Design System

- **Primary Color**: #2B5235
- **Secondary Color**: #DDBE75
- **Sidebar**: White background
- **Language**: Indonesian UI (except lead stages/statuses)
- **Components**: shadcn/ui for consistency

## 📝 Database Schema

**Main Tables:**
- Users (with roles)
- Branches
- Lead Sources
- Carpet Types
- Leads
- Follow Ups
- Documents

## 🔧 Configuration

### Closing Reasons
Promo, Survey, Bonus, Negotiation, Recommendation, Repeat Order

### Non-Closing Reasons
Far location, Product not available, Price, Installation service only, No response

## 📱 Mobile-First

The application is designed mobile-first as the majority of users access the system via smartphones.