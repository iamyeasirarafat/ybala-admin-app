# Production-Ready Expo Boilerplate

A complete, production-ready Expo + React Native boilerplate with TypeScript, Expo Router, NativeWind, Gluestack UI, Zustand, React Query, and more.

## Features

- **Expo Router** - File-based routing with bottom tabs
- **NativeWind** - Tailwind CSS for React Native
- **Dark Mode Support** - Class-based dark mode strategy
- **Gluestack UI** - Beautiful, accessible UI components
- **Zustand** - Lightweight state management
- **React Query** - Powerful data fetching and caching
- **Axios** - HTTP client with interceptors
- **Secure Storage** - Token storage with Expo Secure Store
- **Auth Flow** - Complete authentication with protected routes
- **TypeScript** - Full type safety

## Project Structure

```
app/
├─ (tabs)/
│   ├─ _layout.tsx           # Tab navigation layout
│   ├─ index.tsx             # Home screen
│   └─ settings.tsx          # Settings screen
├─ (auth)/
│   └─ login.tsx             # Login screen
├─ _layout.tsx               # Root layout with providers
└─ index.tsx                 # Root redirect

components/
├─ Screen.tsx                # Custom screen wrapper (like Flutter Scaffold)
└─ ui/
    └─ index.ts              # Gluestack UI exports

constants/
├─ colors.ts                 # Theme colors
└─ config.ts                 # App configuration

hooks/
└─ useProfile.ts             # Example React Query hook

providers/
├─ ThemeProvider.tsx         # Gluestack UI theme provider
├─ QueryProvider.tsx         # React Query provider
└─ AuthProvider.tsx          # Auth state and routing

services/
└─ api.ts                    # Axios instance with interceptors

store/
└─ auth.store.ts             # Zustand auth store

storage/
└─ secure.ts                 # Secure token storage

types/
└─ index.ts                  # TypeScript types

utils/
└─ index.ts                  # Utility functions
```

## Installation

### 1. Remove Unnecessary Dependencies

```bash
npm uninstall expo-haptics expo-image expo-web-browser expo-symbols react-native-worklets
```

### 2. Install Required Dependencies

```bash
npm install expo-secure-store nativewind zustand axios @tanstack/react-query @react-native-async-storage/async-storage react-native-svg @gluestack-ui/themed @gluestack-style/react
```

### 3. Install Dev Dependencies

```bash
npm install -D tailwindcss
```

### 4. Clean Up Old Files (Optional)

Remove template files that are no longer needed:

```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force app\(tabs)\explore.tsx
Remove-Item -Recurse -Force app\modal.tsx
Remove-Item -Recurse -Force components\external-link.tsx
Remove-Item -Recurse -Force components\haptic-tab.tsx
Remove-Item -Recurse -Force components\hello-wave.tsx
Remove-Item -Recurse -Force components\parallax-scroll-view.tsx
Remove-Item -Recurse -Force components\themed-text.tsx
Remove-Item -Recurse -Force components\themed-view.tsx
Remove-Item -Recurse -Force components\ui\collapsible.tsx
Remove-Item -Recurse -Force components\ui\icon-symbol.ios.tsx
Remove-Item -Recurse -Force components\ui\icon-symbol.tsx
Remove-Item -Recurse -Force constants\theme.ts
Remove-Item -Recurse -Force hooks\use-color-scheme.ts
Remove-Item -Recurse -Force hooks\use-color-scheme.web.ts
Remove-Item -Recurse -Force hooks\use-theme-color.ts

# macOS/Linux
rm app/(tabs)/explore.tsx
rm app/modal.tsx
rm components/external-link.tsx
rm components/haptic-tab.tsx
rm components/hello-wave.tsx
rm components/parallax-scroll-view.tsx
rm components/themed-text.tsx
rm components/themed-view.tsx
rm components/ui/collapsible.tsx
rm components/ui/icon-symbol.ios.tsx
rm components/ui/icon-symbol.tsx
rm constants/theme.ts
rm hooks/use-color-scheme.ts
rm hooks/use-color-scheme.web.ts
rm hooks/use-theme-color.ts
```

## Running the App

```bash
# Start Expo dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web
```

## Configuration

### API Configuration

Update the API base URL in [constants/config.ts](constants/config.ts):

```typescript
export const APP_CONFIG = {
  name: 'Ybala Customer App',
  version: '1.0.0',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || 'https://your-api.com',
  enableMockAuth: false, // Set to false in production
};
```

Or create a `.env` file:

```
EXPO_PUBLIC_API_URL=https://your-api.com
```

### Authentication

The login screen accepts any email/password for demonstration. To connect to a real API:

1. Update the login endpoint in [store/auth.store.ts](store/auth.store.ts#L18)
2. Update the API base URL in [constants/config.ts](constants/config.ts)
3. Set `enableMockAuth: false` in the config

## Key Components

### Screen Component

A custom wrapper that behaves like Flutter's Scaffold:

```tsx
import { Screen } from '@/components/Screen';

export default function MyScreen() {
  return (
    <Screen scroll safe>
      {/* Your content */}
    </Screen>
  );
}
```

Props:
- `scroll` - Enable scrolling
- `safe` - Use SafeAreaView
- `className` - Tailwind classes

### Auth Store

Zustand store with auto-hydration from secure storage:

```tsx
import { useAuthStore } from '@/store/auth.store';

const { user, token, login, logout, isAuthenticated } = useAuthStore();
```

### API Service

Axios instance with automatic token attachment:

```tsx
import { api } from '@/services/api';

// Automatically includes Authorization header
const response = await api.get('/user/profile');
```

### React Query Hook

Example data fetching hook:

```tsx
import { useProfile } from '@/hooks/useProfile';

const { data, isLoading, error } = useProfile();
```

## Styling

### NativeWind (Tailwind CSS)

Use Tailwind classes directly:

```tsx
<View className="flex-1 bg-white dark:bg-gray-900">
  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
    Hello World
  </Text>
</View>
```

### Custom Colors

Defined in [tailwind.config.js](tailwind.config.js):

- `primary-*` - Primary color shades (blue)
- `secondary-*` - Secondary color shades (purple)

### Dark Mode

Toggle dark mode:

```tsx
import { useColorScheme } from 'nativewind';

const { colorScheme, toggleColorScheme } = useColorScheme();
```

## License

MIT
