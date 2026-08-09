# Graph Report - ybala-admin-app  (2026-08-09)

## Corpus Check
- 161 files · ~200,075 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 734 nodes · 1849 edges · 64 communities (23 shown, 41 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `45fbe291`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Order Management
- Analytics Dashboard
- App Route Screens
- Auth & Core Infrastructure
- Menu Management
- Promotion & Coupons
- User Management
- Account Settings & Profile
- Store Settings & Locations
- App Boilerplate & Theming
- SEO & Page Settings
- Dev Tooling & Lint Config
- UI Components & Pixel Settings
- Settings Forms
- TypeScript Config
- Core App Dependencies
- Toast Notification System
- Brand Settings
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
- Expo Splash Screen Dependency
- Expo Status Bar Dependency
- Expo System UI Dependency
- Expo Updates Dependency
- Expo Vector Icons Dependency
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
- Reanimated Dependency
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

## Communities (64 total, 41 thin omitted)

### Community 0 - "Order Management"
Cohesion: 0.06
Nodes (62): LoginScreen(), SingleSelectField(), SingleSelectFieldProps, CartLinesSection(), CartLinesSectionProps, CouponSection(), CouponSectionProps, DeliveryMethod (+54 more)

### Community 1 - "Analytics Dashboard"
Cohesion: 0.07
Nodes (53): Index(), AnalyticsScreen(), CountReport(), CountReportProps, FoodReport(), ProductReportCard(), ProductReportCardProps, ProductRowItem (+45 more)

### Community 2 - "App Route Screens"
Cohesion: 0.06
Nodes (8): TagForm(), MenuItem(), MenuItemProps, Screen, ScreenProps, SectionHeading(), useSaveTag(), useTag()

### Community 3 - "Auth & Core Infrastructure"
Cohesion: 0.07
Nodes (49): RootLayout(), unstable_settings, APP_CONFIG, QUERY_CONFIG, AuthProvider(), AuthProviderProps, queryClient, QueryProviderProps (+41 more)

### Community 4 - "Menu Management"
Cohesion: 0.06
Nodes (45): CategoryList(), emptyLocale(), Lang, LangImages, MenuForm(), normalizeLocale(), SeoKind, AVAIL_TABS (+37 more)

### Community 5 - "Promotion & Coupons"
Cohesion: 0.08
Nodes (43): BannerForm(), BannerFormProps, BannerType, ComplexCouponFields(), ComplexCouponFieldsProps, CouponForm(), num(), DateField() (+35 more)

### Community 6 - "User Management"
Cohesion: 0.12
Nodes (22): CustomerSelectField(), CustomerSelectFieldProps, GUEST, SelectedCustomer, stripCode(), USER_TYPES, UserForm(), TYPE_TABS (+14 more)

### Community 7 - "Account Settings & Profile"
Cohesion: 0.13
Nodes (15): DashboardScreen(), AccountInfoForm(), LogoutButton(), PreferenceToggle(), ProfileHeader(), SettingsMenu(), StoreFormContainer(), managerLabel() (+7 more)

### Community 8 - "Store Settings & Locations"
Cohesion: 0.12
Nodes (25): managerName(), ManagerSelector(), ManagerSelectorProps, FormState, initFromStore(), Lang, StoreForm(), StoreFormProps (+17 more)

### Community 9 - "App Boilerplate & Theming"
Cohesion: 0.10
Nodes (29): Login Screen (app/(auth)/login.tsx), Root Layout (app/_layout.tsx), Tab Navigation Layout (app/(tabs)/_layout.tsx), Home Screen (app/(tabs)/index.tsx), Settings Screen (app/(tabs)/settings.tsx), Root Redirect (app/index.tsx), Gluestack UI Exports (components/ui/index.ts), Theme Colors (constants/colors.ts) (+21 more)

### Community 10 - "SEO & Page Settings"
Cohesion: 0.13
Nodes (19): CategoryForm(), EditableItem, emptyLangImages(), emptyLocale(), FullLocale, FullMeta, ImageKind, LangImages (+11 more)

### Community 11 - "Dev Tooling & Lint Config"
Cohesion: 0.08
Nodes (24): @babel/core, eslint, eslint-config-expo, devDependencies, @babel/core, eslint, eslint-config-expo, tailwindcss (+16 more)

### Community 12 - "UI Components & Pixel Settings"
Cohesion: 0.17
Nodes (12): PixelForm(), ShopSettingsForm(), Avatar(), AvatarProps, Button(), ButtonProps, Input(), TextFieldProps (+4 more)

### Community 13 - "Settings Forms"
Cohesion: 0.24
Nodes (10): EMPTY, OthersSettingsForm(), PageContentForm(), PageContentFormProps, SectionHeadingProps, SocialLinkForm(), SocialLinkFormProps, useOtherSettings() (+2 more)

### Community 14 - "TypeScript Config"
Cohesion: 0.17
Nodes (11): expo-env.d.ts, expo/tsconfig.base, .expo/types/**/*.ts, nativewind-env.d.ts, **/*.ts, **/*.tsx, compilerOptions, paths (+3 more)

### Community 15 - "Core App Dependencies"
Cohesion: 0.18
Nodes (11): axios, expo-dev-client, dependencies, axios, expo-dev-client, react-dom, react-native, @tanstack/react-query (+3 more)

### Community 16 - "Toast Notification System"
Cohesion: 0.24
Nodes (4): react, react, ToastContainer(), ToastManager

### Community 17 - "Brand Settings"
Cohesion: 0.70
Nodes (4): appendImage(), BrandSettingsForm(), useBrandStyle(), useUpdateBrandStyle()

### Community 19 - "Metro Bundler Config"
Cohesion: 0.50
Nodes (3): config, { getDefaultConfig }, { withNativeWind }

## Knowledge Gaps
- **153 isolated node(s):** `keys`, `config`, `unstable_settings`, `unstable_settings`, `MenuItemProps` (+148 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Core App Dependencies` to `Dev Tooling & Lint Config`, `Toast Notification System`, `Expo Constants Dependency`, `Expo Dev Client Dependency`, `Expo Font Dependency`, `Expo Image Picker Dependency`, `Expo Linking Dependency`, `Expo Router Dependency`, `Expo Secure Store Dependency`, `Expo Splash Screen Dependency`, `Expo Status Bar Dependency`, `Expo System UI Dependency`, `Expo Updates Dependency`, `Expo Vector Icons Dependency`, `Gluestack Style Dependency`, `Gluestack UI Themed Dependency`, `NativeWind Dependency`, `OneSignal Expo Plugin Dependency`, `Async Storage Dependency`, `React Native Chart Kit Dependency`, `DateTimePicker Dependency`, `React Native CSS Interop Dependency`, `Gesture Handler Dependency`, `React Native OneSignal Dependency`, `Reanimated Dependency`, `Safe Area Context Dependency`, `React Native Screens Dependency`, `React Native SVG Dependency`, `React Native Web Dependency`, `React Native Worklets Dependency`, `Bottom Tabs Navigation Dependency`, `React Navigation Elements Dependency`, `React Navigation Native Dependency`, `Tailwind Merge Dependency`, `Zustand Dependency`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **Why does `ToastContainer()` connect `Toast Notification System` to `Order Management`, `Auth & Core Infrastructure`?**
  _High betweenness centrality (0.229) - this node is a cross-community bridge._
- **Why does `react` connect `Toast Notification System` to `Core App Dependencies`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **What connects `keys`, `config`, `unstable_settings` to the rest of the system?**
  _153 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Order Management` be split into smaller, more focused modules?**
  _Cohesion score 0.056862745098039215 - nodes in this community are weakly interconnected._
- **Should `Analytics Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.07259407259407259 - nodes in this community are weakly interconnected._
- **Should `App Route Screens` be split into smaller, more focused modules?**
  _Cohesion score 0.05632360471070148 - nodes in this community are weakly interconnected._