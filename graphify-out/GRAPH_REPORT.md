# Graph Report - ybala-admin-app  (2026-08-09)

## Corpus Check
- 161 files · ~200,164 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 738 nodes · 1851 edges · 70 communities (26 shown, 44 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9d372eee`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrderForm.tsx
- useAuthStore
- Screen
- types/index.ts
- MenuForm.tsx
- usePromotion.ts
- useUser.ts
- settings/index.ts
- useSettings.ts
- App Boilerplate & Theming
- order.ts
- Dev Tooling & Lint Config
- ui/index.ts
- promotion/index.ts
- TypeScript Config
- dependencies
- ToastManager
- app/_layout.tsx
- Tab Layout & Colors
- Metro Bundler Config
- Auth Route Layout
- ESLint Config
- App Config
- App Icon Asset
- Auth Banner Asset
- Expo Constants Dependency
- Expo Dev Client Dependency
- Expo Font Dependency
- Expo Image Picker Dependency
- Expo Linking Dependency
- Expo Router Dependency
- Expo Secure Store Dependency
- .error
- Expo Status Bar Dependency
- Expo System UI Dependency
- Expo Updates Dependency
- Gluestack Style Dependency
- Gluestack UI Themed Dependency
- NativeWind Dependency
- OneSignal Expo Plugin Dependency
- Async Storage Dependency
- React Native Chart Kit Dependency
- DateTimePicker Dependency
- React Native CSS Interop Dependency
- Gesture Handler Dependency
- React Native OneSignal Dependency
- api.ts
- Safe Area Context Dependency
- React Native Screens Dependency
- React Native SVG Dependency
- React Native Web Dependency
- React Native Worklets Dependency
- Bottom Tabs Navigation Dependency
- React Navigation Elements Dependency
- React Navigation Native Dependency
- Tailwind Merge Dependency
- Zustand Dependency
- App Icon (Standalone)
- Icon Foreground Layer
- promo-banner.tsx
- onesignal.ts
- ToastContainer
- expo-dev-client
- react-dom
- @tanstack/react-query

## God Nodes (most connected - your core abstractions)
1. `extractApiError()` - 46 edges
2. `useAuthStore` - 38 edges
3. `Screen` - 36 edges
4. `Production-Ready Expo Boilerplate` - 32 edges
5. `Input()` - 20 edges
6. `toast` - 20 edges
7. `SectionHeading()` - 18 edges
8. `Button()` - 18 edges
9. `useProfile()` - 18 edges
10. `mediaUrl()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `useAuthStore` --implements--> `Zustand`  [EXTRACTED]
  store/auth.store.ts → README.md
- `Screen` --conceptually_related_to--> `NativeWind`  [EXTRACTED]
  components/Screen.tsx → README.md
- `Production-Ready Expo Boilerplate` --references--> `Screen`  [EXTRACTED]
  README.md → components/Screen.tsx
- `useProfile()` --implements--> `React Query`  [EXTRACTED]
  hooks/useProfile.ts → README.md
- `Production-Ready Expo Boilerplate` --references--> `useProfile()`  [EXTRACTED]
  README.md → hooks/useProfile.ts

## Import Cycles
- 2-file cycle: `components/settings/StoreFormContainer.tsx -> components/settings/index.ts -> components/settings/StoreFormContainer.tsx`
- 2-file cycle: `components/settings/StoreLocationManager.tsx -> components/settings/index.ts -> components/settings/StoreLocationManager.tsx`

## Hyperedges (group relationships)
- **Root Layout Provider Composition** — app__layout_rootlayout, providers_themeprovider_themeprovider, providers_queryprovider_queryprovider, providers_authprovider_authprovider [EXTRACTED 1.00]
- **Auth Token Persistence and Attachment Flow** — store_auth_store_useauthstore, storage_secure_securestorage, services_api_api [INFERRED 0.85]

## Communities (70 total, 44 thin omitted)

### Community 0 - "OrderForm.tsx"
Cohesion: 0.07
Nodes (51): SingleSelectField(), SingleSelectFieldProps, CartLinesSection(), CartLinesSectionProps, CouponSection(), CouponSectionProps, DeliveryMethod, DeliverySection() (+43 more)

### Community 1 - "useAuthStore"
Cohesion: 0.07
Nodes (52): Index(), AnalyticsScreen(), DashboardScreen(), CountReport(), CountReportProps, FoodReport(), ProductReportCard(), ProductReportCardProps (+44 more)

### Community 3 - "types/index.ts"
Cohesion: 0.18
Nodes (12): APP_CONFIG, QUERY_CONFIG, fetchProfile(), queryClient, QueryProviderProps, protectedApi, ApiError, AuthState (+4 more)

### Community 4 - "MenuForm.tsx"
Cohesion: 0.06
Nodes (47): CategoryList(), emptyLocale(), Lang, LangImages, MenuForm(), normalizeLocale(), SeoKind, AVAIL_TABS (+39 more)

### Community 5 - "usePromotion.ts"
Cohesion: 0.09
Nodes (34): BannerForm(), BannerFormProps, BannerType, ComplexCouponFields(), ComplexCouponFieldsProps, MultiSelectField(), MultiSelectFieldProps, PromoCodeList() (+26 more)

### Community 6 - "useUser.ts"
Cohesion: 0.13
Nodes (17): CustomerSelectField(), CustomerSelectFieldProps, GUEST, SelectedCustomer, TYPE_TABS, typeBadge(), UserList(), useDeleteUser() (+9 more)

### Community 7 - "settings/index.ts"
Cohesion: 0.17
Nodes (7): LogoutButton(), PreferenceToggle(), SettingsMenu(), ShopSettingsForm(), StoreFormContainer(), StoreLocationManager(), useStoreLocations()

### Community 8 - "useSettings.ts"
Cohesion: 0.06
Nodes (47): emptyLangImages(), emptyLocale(), FullLocale, FullMeta, ImageKind, LangImages, normalizeLocale(), PAGES (+39 more)

### Community 9 - "App Boilerplate & Theming"
Cohesion: 0.10
Nodes (29): Login Screen (app/(auth)/login.tsx), Root Layout (app/_layout.tsx), Tab Navigation Layout (app/(tabs)/_layout.tsx), Home Screen (app/(tabs)/index.tsx), Settings Screen (app/(tabs)/settings.tsx), Root Redirect (app/index.tsx), Gluestack UI Exports (components/ui/index.ts), Theme Colors (constants/colors.ts) (+21 more)

### Community 10 - "order.ts"
Cohesion: 0.15
Nodes (16): StoreFormProps, managerLabel(), StoreList(), StoreListProps, orderService, NOTE: this endpoint intentionally has no trailing slash (matches backend)., BranchInfo, CouponValidatePayload (+8 more)

### Community 11 - "Dev Tooling & Lint Config"
Cohesion: 0.08
Nodes (24): @babel/core, eslint, eslint-config-expo, devDependencies, @babel/core, eslint, eslint-config-expo, tailwindcss (+16 more)

### Community 12 - "ui/index.ts"
Cohesion: 0.08
Nodes (42): CategoryForm(), CouponForm(), num(), EditableItem, emptyItem(), HomeSliderForm(), AccountInfoForm(), appendImage() (+34 more)

### Community 13 - "promotion/index.ts"
Cohesion: 0.15
Nodes (3): DateField(), DateFieldProps, toYMD()

### Community 14 - "TypeScript Config"
Cohesion: 0.17
Nodes (11): expo-env.d.ts, expo/tsconfig.base, .expo/types/**/*.ts, nativewind-env.d.ts, **/*.ts, **/*.tsx, compilerOptions, paths (+3 more)

### Community 15 - "dependencies"
Cohesion: 0.18
Nodes (11): axios, expo-splash-screen, @expo/vector-icons, dependencies, axios, expo-splash-screen, @expo/vector-icons, react-native (+3 more)

### Community 17 - "app/_layout.tsx"
Cohesion: 0.30
Nodes (11): RootLayout(), unstable_settings, AuthProvider(), AuthProviderProps, setNavigationHandler(), initializeOneSignal(), requestPushPermission(), initializeAuth() (+3 more)

### Community 19 - "Metro Bundler Config"
Cohesion: 0.50
Nodes (3): config, { getDefaultConfig }, { withNativeWind }

### Community 33 - ".error"
Cohesion: 0.24
Nodes (11): LoginScreen(), deleteAccessToken(), deleteAllTokens(), deleteRefreshToken(), deleteToken, getToken, saveAccessToken(), saveRefreshToken() (+3 more)

### Community 48 - "api.ts"
Cohesion: 0.24
Nodes (11): apiService, createProtectedApiInstance(), createPublicApiInstance(), failedQueue, processQueue(), protectedApiService, publicApi, redirectToLogin() (+3 more)

### Community 65 - "onesignal.ts"
Cohesion: 0.48
Nodes (6): bindPushUser(), poll(), queue, ready, serialize(), unbindPushUser()

### Community 66 - "ToastContainer"
Cohesion: 0.50
Nodes (3): react, react, ToastContainer()

## Knowledge Gaps
- **155 isolated node(s):** `OrderRowProps`, `OrderRow`, `StatusMeta`, `ready`, `queue` (+150 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `Dev Tooling & Lint Config`, `Expo Constants Dependency`, `Expo Dev Client Dependency`, `Expo Font Dependency`, `Expo Image Picker Dependency`, `Expo Linking Dependency`, `Expo Router Dependency`, `Expo Secure Store Dependency`, `Expo Status Bar Dependency`, `Expo System UI Dependency`, `Expo Updates Dependency`, `Gluestack Style Dependency`, `Gluestack UI Themed Dependency`, `NativeWind Dependency`, `OneSignal Expo Plugin Dependency`, `Async Storage Dependency`, `React Native Chart Kit Dependency`, `DateTimePicker Dependency`, `React Native CSS Interop Dependency`, `Gesture Handler Dependency`, `React Native OneSignal Dependency`, `Safe Area Context Dependency`, `React Native Screens Dependency`, `React Native SVG Dependency`, `React Native Web Dependency`, `React Native Worklets Dependency`, `Bottom Tabs Navigation Dependency`, `React Navigation Elements Dependency`, `React Navigation Native Dependency`, `Tailwind Merge Dependency`, `Zustand Dependency`, `ToastContainer`, `expo-dev-client`, `react-dom`, `@tanstack/react-query`?**
  _High betweenness centrality (0.239) - this node is a cross-community bridge._
- **Why does `ToastContainer()` connect `ToastContainer` to `app/_layout.tsx`, `ui/index.ts`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **Why does `react` connect `ToastContainer` to `dependencies`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **What connects `OrderRowProps`, `OrderRow`, `StatusMeta` to the rest of the system?**
  _155 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OrderForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06905370843989769 - nodes in this community are weakly interconnected._
- **Should `useAuthStore` be split into smaller, more focused modules?**
  _Cohesion score 0.0745945945945946 - nodes in this community are weakly interconnected._
- **Should `Screen` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._