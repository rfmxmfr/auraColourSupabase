# AuraColor

Professional color analysis and styling service platform.

## Overview

AuraColor is a B2C service marketplace for personal styling services founded by Tania Hernando Crespo. The platform offers personalized color palette recommendations using the 12-season color system and styling services.

### Services

- 12-Season Color Analysis (£75) - Personal color season identification with comprehensive palette
- Virtual Wardrobe Curation (£100) - Wardrobe audit and outfit combinations
- Personal Shopping Service (£150) - Guided shopping assistance
- Style Evolution Coaching (£300) - Complete style transformation program
- Gift Vouchers (From £75) - Flexible gift options

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/auracolor.git
cd auracolor
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
auracolor/
├── app/                # Next.js App Router
│   ├── api/            # API routes
│   ├── components/     # Shared components
│   ├── (routes)/       # App routes
│   └── layout.tsx      # Root layout
├── public/             # Static assets
├── lib/                # Utility functions and services
├── styles/             # Global styles
└── types/              # TypeScript type definitions
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Deployment**: Vercel

## Development

### Code Standards

- Follow ESLint and Prettier configurations
- Use TypeScript for type safety
- Follow the component structure in the project
- Write tests for new features

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - For new features
- `bugfix/*` - For bug fixes
- `hotfix/*` - For urgent production fixes

### Commit Guidelines

Follow conventional commits format:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Formatting changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## License

This project is proprietary and confidential. All rights reserved.