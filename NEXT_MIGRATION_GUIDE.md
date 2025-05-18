
# Migrating to Next.js

This guide will help you migrate your React application to Next.js.

## Step 1: Create a new Next.js project

```bash
npx create-next-app@latest your-project-name
```

Choose TypeScript, ESLint, Tailwind CSS, and other options when prompted.

## Step 2: Copy over your files

Copy the following directories/files from your current project to the Next.js project:

- `src/components/` → `components/`
- `src/pages/` → `app/` (Will need to be adapted for Next.js App Router)
- `src/hooks/` → `hooks/`
- `src/lib/` → `lib/`
- `public/` → `public/`

## Step 3: Set up styling

1. Copy `src/styles/globals.css` to your Next.js project's `app/globals.css`

2. Copy the Tailwind configuration:
   - Use `src/styles/tailwind.nextjs.ts` as a reference for your Next.js `tailwind.config.ts`

3. Import the globals CSS in your Next.js layout:
   ```tsx
   // app/layout.tsx
   import './globals.css'
   ```

## Step 4: Adapt your components

1. Update your components to work with Next.js:
   - Replace React Router with Next.js navigation
   - Add proper metadata to pages
   - Convert pages to Next.js route components

2. For React Router routes, adapt them to Next.js App Router:
   - `/app/doctor` → `app/app/doctor/page.tsx`
   - `/blog` → `app/blog/page.tsx`
   - etc.

## Step 5: Theme Provider Setup

For dark mode support, create a theme provider component:

```tsx
// components/theme-provider.tsx
"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

Then use it in your layout:

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Step 6: Update imports

Next.js uses a different import convention. Update your imports to use the `@/` prefix:

```tsx
// Before
import { Button } from '@/components/ui/button';

// After (if components are in the root components folder)
import { Button } from '@/components/ui/button';
```

Make sure to configure these paths in your tsconfig.json:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## Step 7: Set up React Query

For TanStack Query, you'll need to use a provider pattern similar to what you have now:

```tsx
// app/providers.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

Then use this in your layout:

```tsx
// app/layout.tsx
import { Providers } from "./providers"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Step 8: Update Navigation

Replace React Router with Next.js navigation:

```tsx
// Before
import { Link } from 'react-router-dom';

<Link to="/about">About</Link>

// After
import Link from 'next/link';

<Link href="/about">About</Link>
```

## Step 9: Testing

After migrating all components, test your application thoroughly to ensure everything works as expected.

## Need Help?

Check out the official Next.js migration guides:
- [Migrating from React Router](https://nextjs.org/docs/pages/building-your-application/routing/internationalization#react-router)
- [Migrating to App Router](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
