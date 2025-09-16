# Governorate Pages Structure

This directory contains all components and pages related to governorate details.

## Structure

```
Governorate/
├── [slug]/                          # Dynamic route for individual governorates
│   ├── _components/                 # Components specific to governorate detail pages
│   │   ├── index.ts                # Export all components for clean imports
│   │   ├── GovernorateHero.tsx     # Hero section with governorate info
│   │   ├── GovernorateStats.tsx    # Statistics display
│   │   ├── GovernorateMembers.tsx  # Team members display
│   │   ├── GovernorateNews.tsx     # News section (coming soon)
│   │   └── GovernorateEvents.tsx   # Events section (coming soon)
│   ├── page.tsx                    # Main governorate detail page
│   ├── loading.tsx                 # Loading state
│   ├── error.tsx                   # Error boundary
│   └── not-found.tsx              # 404 page
├── _components/                     # Components for governorate listing page
├── page.tsx                        # Main governorates listing page
└── README.md                       # This file
```

## Features

### Internationalization (i18n)
- Full Arabic and English support
- Translation keys in `src/messages/ar.json` and `src/messages/en.json`
- Uses `next-intl` for translation management

### Type Safety
- Shared TypeScript interfaces in `src/types/governorate.ts`
- Consistent prop types across all components
- Helper utilities in `src/utils/governorate-translations.ts`

### Dark Mode Support
- All components support both light and dark themes
- Consistent styling with CSS variables
- Smooth transitions between themes

## Translation Keys

### Governorate Detail Pages
All translations are under `governorate.detail.*`:

- `hero.*` - Hero section translations
- `stats.*` - Statistics section translations  
- `members.*` - Team members section translations
- `navigation.*` - Navigation elements
- `contact.*` - Contact section translations

### Example Usage

```tsx
import { useTranslations } from "next-intl";

const t = useTranslations("governorate.detail.hero");
const title = t("ylyIn"); // "YLY في" in Arabic, "YLY in" in English
```

## Components Overview

### GovernorateHero
- Displays governorate name and description
- Shows quick stats (capital, population, area)
- Fully localized with dynamic content

### GovernorateStats  
- Shows YLY impact statistics
- Displays upcoming events, news articles, and programs
- Localized labels and descriptions

### GovernorateMembers
- Lists team members for the governorate
- Shows member photos, names, and positions
- Supports Arabic names and localized position titles

### GovernorateNews & GovernorateEvents
- Coming soon sections with engaging UI
- Uses existing translations from general governorate section
- Consistent styling with call-to-action buttons

## Data Structure

Governorate data is stored in `src/data/governorates-data.json` with the following structure:

```json
{
  "governorate-slug": {
    "name": "English Name",
    "arabic_name": "الاسم العربي", 
    "description": "English description",
    "arabic_description": "الوصف العربي",
    "capital": "Capital City",
    "population": "Population",
    "area": "Area",
    "yly_stats": {
      "members_count": 100,
      "events_count": 25,
      "news_count": 15,
      "programs_count": 10
    },
    "members": [...]
  }
}
```

## Best Practices

1. **Always use TypeScript interfaces** from `src/types/governorate.ts`
2. **Use translation hooks** for all user-facing text
3. **Support both Arabic and English** content
4. **Include dark mode classes** for all styled elements
5. **Use semantic HTML** for accessibility
6. **Import components** from the index file for cleaner imports

## Adding New Components

1. Create the component in `_components/` directory
2. Add proper TypeScript interfaces
3. Include translation support
4. Add dark mode styling
5. Export from `index.ts`
6. Update this README if needed