# Front-End Development Guidelines (Next.js)

This document outlines the standards and best practices for developing the front-end application using Next.js, specifically tailored for integration with Strapi CMS.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **CMS Integration:** Strapi v5
- **State Management:** React Context / Zustand
- **Data Fetching:** Native `fetch` / TanStack Query

## Project Structure (App Router)

```
front/
├── src/
│   ├── app/                 # App Router pages and layouts
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── [slug]/          # Dynamic routes
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Atomic UI elements (Button, Input)
│   │   └── blocks/          # Strapi Dynamic Zone components
│   ├── lib/                 # Utilities
│   │   ├── strapi.ts        # Strapi API client / fetch wrappers
│   │   └── utils.ts         # Helper functions
│   ├── hooks/               # Custom hooks
│   └── types/               # TypeScript interfaces (sync with Strapi types)
└── public/                  # Static assets
```

## Strapi Integration

### API Calls

- Use a centralized fetch wrapper to handle base URL and authentication tokens.
- Example helper: `getStrapiURL(path: string)`
- Always handle `populate` parameters to fetch related data efficiently.

```typescript
// lib/strapi.ts
export function getStrapiURL(path = '') {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'}${path}`;
}

export async function fetchAPI(path: string, options = {}) {
  // Implementation with error handling and headers
}
```

### Image Handling

- Strapi returns relative URLs for images. Ensure you prepend the Strapi URL.
- Use `next/image` and configure `remotePatterns` in `next.config.js` to allow loading images from the Strapi domain.

### Dynamic Zones

- Create a component map to render Strapi Dynamic Zones.
- Iterate through the dynamic zone array and render the corresponding React component based on the `__component` field.

## Coding Standards

### Components

- **Server Components:** Default for fetching data and rendering static content.
- **Client Components:** Use `'use client'` for interactive elements (forms, sliders, toggles).
- **Props:** Define strict interfaces.

### Data Fetching

- Use `fetch` with `next: { revalidate: ... }` for ISR (Incremental Static Regeneration).
- Use `no-store` for dynamic data that changes frequently.

```tsx
async function getPageData(slug: string) {
  const res = await fetch(getStrapiURL(`/api/pages?filters[slug][$eq]=${slug}&populate=*`), {
    next: { revalidate: 60 },
  });
  return res.json();
}
```

## Performance & SEO

- **Metadata:** Use the `generateMetadata` function in `page.tsx` to fetch SEO data from Strapi and populate meta tags.
- **Fonts:** Use `next/font/google`.
- **Scripts:** Use `next/script` with appropriate loading strategies (`lazyOnload`, `afterInteractive`).

## Git Workflow

- **Branches:** `feature/`, `fix/`, `chore/`.
- **Commit Messages:** Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`).

---

*Keep this guide updated as the project architecture evolves.*
