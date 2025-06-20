# YLY Website

This is a [Next.js](https://nextjs.org) project for the Youth Leadership for Youth (YLY) organization website. The project includes a registration system powered by Supabase and Redis queue processing.

## Features

- **Multi-language Support**: English and Arabic internationalization
- **Registration System**: Queue-based registration processing with Supabase backend
- **Rate Limiting**: Built-in protection against spam and abuse
- **Real-time Updates**: Queue status monitoring and registration tracking
- **Security**: Input validation, sanitization, and audit logging
- **Performance**: Optimized with Redis caching and background processing

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Queue**: BullMQ with Redis
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Internationalization**: next-intl

## Getting Started

### Prerequisites

- Node.js 18+
- Redis instance (local or cloud)
- Supabase project

### Environment Setup

1. Copy the environment example:

```bash
cp .env.example .env.local
```

2. Update the environment variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Redis Configuration
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_USERNAME=default

# Security
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### Database Setup

1. Run the Supabase migration script:

```sql
-- Execute the contents of database/supabase-setup.sql in your Supabase SQL editor
```

2. Verify the setup by running the test:

```bash
node test-connection.js
```

### Installation and Development

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view the application.

### API Endpoints

- `POST /api/register` - Submit registration form
- `GET /api/register/status/:jobId` - Check registration status
- `GET /api/queue/stats` - View queue statistics (admin)
- `GET /api/test` - Test database connection

### Testing

- **Connection Test**: `node test-connection.js`
- **Queue Test**: `npm run test-queue`
- **Redis Test**: `npm run test-redis`
- **Load Testing**: `npm run test:load`

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── register/      # Registration pages
│   └── _components/   # Page components
├── components/        # Reusable UI components
├── lib/              # Utility libraries
│   ├── supabase.ts   # Database client and helpers
│   ├── supabaseQueue.ts # Queue management
│   └── redis.ts      # Redis configuration
├── messages/         # Internationalization files
└── types/           # TypeScript type definitions
```

## Deployment

The application can be deployed on Vercel, Netlify, or any platform supporting Node.js:

1. Set up environment variables in your deployment platform
2. Ensure Supabase and Redis services are accessible
3. Run the build: `npm run build`
4. Deploy the generated `.next` folder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Migration from Airtable

This project was migrated from Airtable to Supabase for better performance, security, and scalability. Key improvements include:

- **Database Performance**: PostgreSQL with optimized queries and indexes
- **Real-time Capabilities**: Built-in subscriptions and live updates
- **Security**: Row Level Security (RLS) and audit logging
- **Scalability**: Horizontal scaling and connection pooling
- **Cost Efficiency**: More predictable pricing and better resource management
