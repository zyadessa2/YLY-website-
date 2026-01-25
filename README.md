# 🌟 Youth Leading Youth (YLY) - Official Website

<div align="center">

![YLY Logo](public/images/hero.jpg)

**Empowering Egyptian Youth Through Leadership, Sports, and Community**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)

[Live Demo](https://yly-frontend.vercel.app) · [Report Bug](https://github.com/your-repo/issues) · [Request Feature](https://github.com/your-repo/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About The Project

Youth Leading Youth (YLY) is Egypt's premier youth empowerment initiative, dedicated to developing leadership skills, promoting sports, and fostering community engagement among young Egyptians across all 27 governorates.

This modern, full-stack web application serves as the digital hub for YLY, featuring:

- **Multi-language Support**: Seamless Arabic/English experience
- **Interactive Governorate Maps**: Explore YLY presence across Egypt
- **Event Management**: Browse and register for upcoming events
- **News Portal**: Stay updated with latest achievements and initiatives
- **Admin Dashboard**: Comprehensive content management system
- **Registration System**: Queue-based registration with real-time tracking

### 🎨 Design Philosophy

- **User-Centric**: Intuitive navigation for both Arabic and English speakers
- **Responsive**: Optimized for all devices (mobile-first approach)
- **Accessible**: WCAG 2.1 compliant for inclusive user experience
- **Performance**: Blazing fast with Next.js 16 and optimized assets
- **Modern**: Beautiful animations and micro-interactions using Framer Motion

---

## ✨ Key Features

### 🌐 Public-Facing Features

#### 🏠 **Homepage**
- Hero section with dynamic animations
- Statistics showcase (events, news, impact)
- About YLY section
- Vision & Mission statements
- Egypt interactive map
- YLY Board of Directors

#### 📰 **News & Updates**
- Grid-based news article display
- Featured articles
- Social media sharing
- Related news suggestions
- SEO-optimized article pages

#### 🎉 **Events**
- Central YLY events showcase
- Governorate-specific events
- Event registration system
- Event details with image galleries
- Calendar integration

#### 🗺️ **Governorate Pages**
- 27 governorate-specific pages
- Board member profiles
- Local news and events
- Contact information
- Photo galleries

#### 📞 **Contact Us**
- Multi-channel contact form
- Office locations
- Social media links
- Interactive map integration

### 🔐 **Admin Dashboard**

#### 📊 **Dashboard Overview**
- Real-time statistics
- Recent activity feed
- Quick actions menu
- User analytics

#### 📝 **Content Management**
- **News Management**: Create, edit, delete news articles with rich text editor
- **Events Management**: Manage events with date/time, locations, and registrations
- **Governorate Management**: Update governorate information and board members
- **User Management**: Role-based access control (Admin/Governorate User)

#### 🎨 **Media Library**
- Image upload with Google Drive integration
- Image optimization and compression
- Gallery management
- Cover image selection

#### ⚙️ **Settings**
- Profile management
- Password change
- System preferences
- Theme customization (Dark/Light mode)

---

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 16** - React framework with App Router
- **React 18** - UI library with latest features
- **TypeScript** - Type-safe development

### Styling & UI
- **Tailwind CSS 3** - Utility-first CSS framework
- **Radix UI** - Headless component library
- **Framer Motion** - Animation library
- **GSAP** - Advanced animations
- **Lucide Icons** - Beautiful icon library

### State & Data Management
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Form management
- **Yup** - Schema validation

### Internationalization
- **next-intl** - i18n solution for Next.js
- **negotiator** - Language detection

### Developer Experience
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Turbopack** - Fast bundler (dev mode)

### Backend Integration
- **RESTful API** - Backend communication
- **JWT Authentication** - Secure user sessions
- **Google Drive API** - Image storage

---

## 📁 Project Structure

```
yly-project/
├── public/                    # Static assets
│   ├── images/               # Images and media
│   │   ├── Board/           # Board members photos
│   │   ├── eventLogos/      # Event logos
│   │   ├── centralEvents/   # Central events
│   │   └── governorate-board-webp/  # Governorate boards
│   └── ...
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Authentication pages
│   │   ├── dashboard/       # Admin dashboard
│   │   │   ├── _components/ # Dashboard components
│   │   │   ├── events/      # Events management
│   │   │   ├── news/        # News management
│   │   │   ├── users/       # User management
│   │   │   └── governorates/ # Governorate management
│   │   ├── events/          # Public events pages
│   │   ├── news/            # Public news pages
│   │   ├── Governorate/     # Governorate pages
│   │   ├── contactUs/       # Contact page
│   │   ├── register/        # Registration page
│   │   └── _components/     # Shared components
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI primitives
│   │   ├── my-components/  # Custom components
│   │   └── providers/      # Context providers
│   ├── lib/                 # Utilities and helpers
│   │   ├── api/            # API services
│   │   │   ├── auth.service.ts
│   │   │   ├── news.service.ts
│   │   │   ├── events.service.ts
│   │   │   ├── users.service.ts
│   │   │   └── governorates.service.ts
│   │   ├── utils/          # Utility functions
│   │   └── database.ts     # Database helpers
│   ├── messages/            # i18n translations
│   │   ├── ar.json         # Arabic translations
│   │   └── en.json         # English translations
│   ├── types/              # TypeScript definitions
│   └── styles/             # Global styles
├── .env.local              # Environment variables
├── next.config.ts          # Next.js configuration
├── tailwind.config.js      # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/yly-website.git
   cd yly-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration (see [Environment Variables](#environment-variables))

4. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:


```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://yly-backend.vercel.app/api/v1

# Optional: Google Analytics (if applicable)
NEXT_PUBLIC_GA_ID=your_ga_id
```

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `https://yly-backend.vercel.app/api/v1` |

---

## 🔌 API Integration

The application communicates with a RESTful backend API. All API services are located in `src/lib/api/`.

### Authentication Flow

1. User logs in via `/signin`
2. Backend returns `accessToken` and `refreshToken`
3. Tokens stored in `localStorage`
4. API client automatically adds `Authorization` header
5. Token refresh handled automatically on 401 errors

### API Services

```typescript
// Example: News Service
import { newsService } from '@/lib/api';

// Get all published news
const news = await newsService.getAll({ published: true, limit: 10 });

// Get single news by slug
const article = await newsService.getBySlug('article-slug');

// Create new article (admin only)
const newArticle = await newsService.create({
  title: 'Article Title',
  arabicTitle: 'عنوان المقال',
  content: '<p>Article content</p>',
  // ...
});
```

### Available Services

- `authService` - Authentication & authorization
- `newsService` - News management
- `eventsService` - Events management
- `governoratesService` - Governorate data
- `usersService` - User management (admin only)
- `dashboardService` - Dashboard statistics

---

## 💻 Development

### Available Scripts

```bash
# Development server (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

### Code Structure Guidelines

#### Components
- Use TypeScript for all components
- Follow compound component pattern for complex UI
- Keep components small and focused (Single Responsibility)
- Use `'use client'` directive only when needed

#### Styling
- Use Tailwind CSS utility classes
- Utilize CSS variables for theming
- Follow mobile-first responsive design
- Use semantic HTML elements

#### State Management
- Use React hooks for local state
- Lift state up when needed
- Context for global state (theme, language)
- API state managed by services

#### Best Practices
- Write semantic, accessible HTML
- Optimize images (use Next.js Image component)
- Implement proper error boundaries
- Add loading states for async operations
- Use TypeScript for type safety

### Dark Mode Support

The application supports dark mode using `next-themes`:

```typescript
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  );
}
```

### Internationalization

Language switching is handled via URL prefix:

```typescript
// English: /en/news
// Arabic: /ar/news

import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('HomePage');
  
  return <h1>{t('title')}</h1>;
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   ```bash
   # Push to GitHub
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables
   - Deploy

3. **Environment Variables**
   Add all required environment variables in Vercel dashboard

### Build Optimization

The project is optimized for production:

- ✅ Static page generation where possible
- ✅ Image optimization with Next.js Image
- ✅ Code splitting and lazy loading
- ✅ Minified CSS and JavaScript
- ✅ Font optimization
- ✅ SEO meta tags

### Performance Metrics

Target metrics:
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

---

## 🎨 Customization

### Theme Colors

Edit `src/app/globals.css` to customize theme colors:

```css
:root {
  --primary: oklch(0.55 0.2 240);    /* Blue */
  --secondary: oklch(0.85 0.15 80);  /* Yellow */
  --accent: oklch(0.85 0.15 80);
  --destructive: oklch(0.6 0.25 25); /* Red */
  /* ... */
}
```

### Adding New Languages

1. Create translation file in `src/messages/`
2. Add language to `src/i18n/config.ts`
3. Update language switcher component

### Custom Components

Add custom components in `src/components/my-components/`:

```typescript
// src/components/my-components/CustomCard.tsx
export function CustomCard({ title, content }: Props) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{content}</p>
    </div>
  );
}
```

---

## 📚 Documentation

### Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

### Project-Specific Docs

- [API Integration Guide](docs/api-integration.md) *(coming soon)*
- [Component Library](docs/components.md) *(coming soon)*
- [Deployment Guide](docs/deployment.md) *(coming soon)*

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Coding Standards

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 🐛 Known Issues & Troubleshooting

### Common Issues

**Issue: Dark mode not working**
```bash
# Solution: Clear localStorage and refresh
localStorage.clear();
location.reload();
```

**Issue: API errors (500)**
- Check backend server status
- Verify authentication token
- Check CORS configuration
- Review backend logs

**Issue: Images not loading**
- Verify image paths
- Check Google Drive permissions
- Ensure Next.js Image optimization is enabled

**Issue: Translations missing**
- Check `messages/` folder for language files
- Verify translation keys match
- Clear Next.js cache: `rm -rf .next`

---

## 📄 License

This project is proprietary and confidential. All rights reserved by Youth Leading Youth (YLY) organization.

**© 2024-2026 Youth Leading Youth. All Rights Reserved.**

---

## 👥 Team

### Development Team
- **Frontend Developer**: [Your Name]
- **Backend Developer**: [Backend Dev Name]
- **UI/UX Designer**: [Designer Name]
- **Project Manager**: [PM Name]

### YLY Organization
- **Website**: [yly-egypt.org](https://yly-egypt.org)
- **Email**: info@yly-egypt.org
- **Facebook**: [Youth Leading Youth](https://facebook.com/yly)
- **Instagram**: [@yly_egypt](https://instagram.com/yly_egypt)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Radix UI for accessible components
- Tailwind CSS for the utility-first approach
- All open-source contributors

---

<div align="center">

**Made with ❤️ for Egyptian Youth**

[Back to Top](#-youth-leading-youth-yly---official-website)

</div>
