# Graph Report - ybala-admin-app  (2026-09-26)

## Corpus Check
- 191 files · ~211,630 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 796 nodes · 2062 edges · 75 communities (31 shown, 44 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `10f99663`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- extractApiError
- useAuthStore
- Screen
- types/index.ts
- MenuForm.tsx
- usePromotion.ts
- useDelivery.ts
- store-location.tsx
- useSettings.ts
- App Boilerplate & Theming
- order.ts
- Dev Tooling & Lint Config
- settings/index.ts
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
- analyticsService.ts
- OrderList.tsx
- OrderDetail.tsx
- OrderSummary.tsx
- SingleSelectField.tsx
- CustomerSelectField.tsx
- expo-splash-screen
- @expo/vector-icons
- react-native-reanimated

## God Nodes (most connected - your core abstractions)
1. `extractApiError()` - 49 edges
2. `useAuthStore` - 40 edges
3. `Screen` - 38 edges
4. `Production-Ready Expo Boilerplate` - 32 edges
5. `mediaUrl()` - 24 edges
6. `toast` - 22 edges
7. `SectionHeading()` - 19 edges
8. `Input()` - 19 edges
9. `useProfile()` - 18 edges
10. `formatCurrency()` - 18 edges

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

## Communities (75 total, 44 thin omitted)

### Community 0 - "extractApiError"
Cohesion: 0.27
Nodes (15): CouponSection(), emptyAddress, OrderForm(), stripCode(), keys, useAddCartItem(), useCartItems(), useCreateOrder() (+7 more)

### Community 1 - "useAuthStore"
Cohesion: 0.09
Nodes (41): Index(), AnalyticsScreen(), CountReport(), CountReportProps, FoodReport(), ProductReportCard(), ProductReportCardProps, ProductRowItem (+33 more)

### Community 3 - "types/index.ts"
Cohesion: 0.21
Nodes (10): APP_CONFIG, QUERY_CONFIG, queryClient, QueryProviderProps, ApiError, AuthState, LoginResponse, ProfileResponse (+2 more)

### Community 4 - "MenuForm.tsx"
Cohesion: 0.06
Nodes (47): CategoryForm(), CategoryList(), emptyLocale(), Lang, LangImages, MenuForm(), normalizeLocale(), SeoKind (+39 more)

### Community 5 - "usePromotion.ts"
Cohesion: 0.08
Nodes (38): BannerForm(), BannerFormProps, BannerType, ComplexCouponFields(), ComplexCouponFieldsProps, emptyItem(), HomeSliderForm(), MultiSelectField() (+30 more)

### Community 6 - "useDelivery.ts"
Cohesion: 0.08
Nodes (44): DeliveryManList(), DeliveryManSelectField(), DeliveryManSelectFieldProps, DeliveryManStats(), ASSIGNABLE_ORDER_STATUSES, ASSIGNMENT_STATUS_META, assignmentMeta(), formatTimestamp() (+36 more)

### Community 8 - "useSettings.ts"
Cohesion: 0.07
Nodes (44): emptyLangImages(), emptyLocale(), FullLocale, FullMeta, ImageKind, LangImages, normalizeLocale(), PAGES (+36 more)

### Community 9 - "App Boilerplate & Theming"
Cohesion: 0.10
Nodes (29): Login Screen (app/(auth)/login.tsx), Root Layout (app/_layout.tsx), Tab Navigation Layout (app/(tabs)/_layout.tsx), Home Screen (app/(tabs)/index.tsx), Settings Screen (app/(tabs)/settings.tsx), Root Redirect (app/index.tsx), Gluestack UI Exports (components/ui/index.ts), Theme Colors (constants/colors.ts) (+21 more)

### Community 10 - "order.ts"
Cohesion: 0.17
Nodes (14): MenuAddSectionProps, orderService, NOTE: this endpoint intentionally has no trailing slash (matches backend)., AddCartPayload, BranchInfo, CouponValidatePayload, CouponValidateResponse, CreateOrderPayload (+6 more)

### Community 11 - "Dev Tooling & Lint Config"
Cohesion: 0.08
Nodes (24): @babel/core, eslint, eslint-config-expo, devDependencies, @babel/core, eslint, eslint-config-expo, tailwindcss (+16 more)

### Community 12 - "settings/index.ts"
Cohesion: 0.07
Nodes (56): DashboardScreen(), DeliveryManForm(), stripCode(), CouponForm(), num(), EditableItem, AccountInfoForm(), appendImage() (+48 more)

### Community 13 - "promotion/index.ts"
Cohesion: 0.13
Nodes (3): DateField(), DateFieldProps, toYMD()

### Community 14 - "TypeScript Config"
Cohesion: 0.17
Nodes (11): expo-env.d.ts, expo/tsconfig.base, .expo/types/**/*.ts, nativewind-env.d.ts, **/*.ts, **/*.tsx, compilerOptions, paths (+3 more)

### Community 15 - "dependencies"
Cohesion: 0.18
Nodes (11): axios, expo-dev-client, dependencies, axios, expo-dev-client, react-dom, react-native, @tanstack/react-query (+3 more)

### Community 16 - "ToastManager"
Cohesion: 0.24
Nodes (4): react, react, ToastContainer(), ToastManager

### Community 17 - "app/_layout.tsx"
Cohesion: 0.27
Nodes (12): RootLayout(), unstable_settings, AuthProvider(), AuthProviderProps, setNavigationHandler(), initializeOneSignal(), requestPushPermission(), bindPushSubscription() (+4 more)

### Community 19 - "Metro Bundler Config"
Cohesion: 0.50
Nodes (3): config, { getDefaultConfig }, { withNativeWind }

### Community 33 - ".error"
Cohesion: 0.27
Nodes (10): LoginScreen(), deleteAccessToken(), deleteAllTokens(), deleteRefreshToken(), deleteToken, getToken, saveAccessToken(), saveRefreshToken() (+2 more)

### Community 48 - "api.ts"
Cohesion: 0.24
Nodes (11): apiService, createProtectedApiInstance(), createPublicApiInstance(), failedQueue, processQueue(), protectedApiService, publicApi, redirectToLogin() (+3 more)

### Community 65 - "onesignal.ts"
Cohesion: 0.48
Nodes (6): bindPushUser(), poll(), queue, ready, serialize(), unbindPushUser()

### Community 66 - "analyticsService.ts"
Cohesion: 0.16
Nodes (16): analyticsService, protectedApi, GetUsersParams, UpdateProfilePayload, userService, MenuSummary, OrderReport, Paginated (+8 more)

### Community 67 - "OrderList.tsx"
Cohesion: 0.19
Nodes (12): OrderList(), OrderRow, OrderRowProps, COMPLETED_TAB_STATUSES, getOrderListTab(), ONGOING_TAB_STATUSES, ORDER_LIST_TABS, OrderListTab (+4 more)

### Community 68 - "OrderDetail.tsx"
Cohesion: 0.28
Nodes (8): OrderDetail(), STATUS_META, OrderStatusBadge(), OrderStatusBadgeProps, useAssignStoreLocation(), useDeleteOrder(), useOrder(), OrderStatus

### Community 69 - "OrderSummary.tsx"
Cohesion: 0.24
Nodes (9): CartLinesSection(), CartLinesSectionProps, CouponSectionProps, computeDiscount(), computeSubtotal(), OrderSummary(), OrderSummaryProps, CartLine (+1 more)

### Community 70 - "SingleSelectField.tsx"
Cohesion: 0.36
Nodes (7): SingleSelectField(), SingleSelectFieldProps, DeliveryMethod, DeliverySection(), DeliverySectionProps, ShippingAddress, SelectOption

### Community 71 - "CustomerSelectField.tsx"
Cohesion: 0.40
Nodes (4): CustomerSelectField(), CustomerSelectFieldProps, GUEST, SelectedCustomer

## Knowledge Gaps
- **162 isolated node(s):** `config`, `unstable_settings`, `Meta`, `ASSIGNMENT_STATUS_META`, `RIDER_STATUS_META` (+157 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **44 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `Dev Tooling & Lint Config`, `ToastManager`, `Expo Constants Dependency`, `Expo Dev Client Dependency`, `Expo Font Dependency`, `Expo Image Picker Dependency`, `Expo Linking Dependency`, `Expo Router Dependency`, `Expo Secure Store Dependency`, `Expo Status Bar Dependency`, `Expo System UI Dependency`, `Expo Updates Dependency`, `Gluestack Style Dependency`, `Gluestack UI Themed Dependency`, `NativeWind Dependency`, `OneSignal Expo Plugin Dependency`, `Async Storage Dependency`, `React Native Chart Kit Dependency`, `DateTimePicker Dependency`, `React Native CSS Interop Dependency`, `Gesture Handler Dependency`, `React Native OneSignal Dependency`, `Safe Area Context Dependency`, `React Native Screens Dependency`, `React Native SVG Dependency`, `React Native Web Dependency`, `React Native Worklets Dependency`, `Bottom Tabs Navigation Dependency`, `React Navigation Elements Dependency`, `React Navigation Native Dependency`, `Tailwind Merge Dependency`, `Zustand Dependency`, `expo-splash-screen`, `@expo/vector-icons`, `react-native-reanimated`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **Why does `ToastContainer()` connect `ToastManager` to `app/_layout.tsx`, `settings/index.ts`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **Why does `react` connect `ToastManager` to `dependencies`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **What connects `config`, `unstable_settings`, `Meta` to the rest of the system?**
  _162 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuthStore` be split into smaller, more focused modules?**
  _Cohesion score 0.09375 - nodes in this community are weakly interconnected._
- **Should `Screen` be split into smaller, more focused modules?**
  _Cohesion score 0.11666666666666667 - nodes in this community are weakly interconnected._
- **Should `MenuForm.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06328320802005012 - nodes in this community are weakly interconnected._