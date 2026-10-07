# Graph Report - ybala-admin-app  (2026-10-07)

## Corpus Check
- 192 files · ~211,907 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 804 nodes · 2072 edges · 71 communities (30 shown, 41 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7cfaa9ca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- OrderForm.tsx
- useAuthStore
- Screen
- types/index.ts
- MenuForm.tsx
- extractApiError
- useDelivery.ts
- settings/index.ts
- PageSeoForm.tsx
- Production-Ready Expo Boilerplate
- order.ts
- Dev Tooling & Lint Config
- SectionHeading
- toast.tsx
- TypeScript Config
- dependencies
- useSettings.ts
- DeliveryManForm.tsx
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
- ui/index.ts
- Expo Status Bar Dependency
- Expo System UI Dependency
- Expo Updates Dependency
- OrderList.tsx
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
- ToastManager
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
- SingleSelectField.tsx
- withAdiRegistration.js
- OrderDetail.tsx
- OrderSummary.tsx
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

## Communities (71 total, 41 thin omitted)

### Community 0 - "OrderForm.tsx"
Cohesion: 0.20
Nodes (17): CouponSection(), CustomerSelectField(), CustomerSelectFieldProps, GUEST, SelectedCustomer, emptyAddress, OrderForm(), stripCode() (+9 more)

### Community 1 - "useAuthStore"
Cohesion: 0.08
Nodes (51): Index(), AnalyticsScreen(), CountReport(), CountReportProps, FoodReport(), ProductReportCard(), ProductReportCardProps, ProductRowItem (+43 more)

### Community 2 - "Screen"
Cohesion: 0.05
Nodes (7): MenuItem(), MenuItemProps, DateField(), DateFieldProps, toYMD(), Screen, ScreenProps

### Community 3 - "types/index.ts"
Cohesion: 0.06
Nodes (58): RootLayout(), unstable_settings, DashboardScreen(), AccountInfoForm(), APP_CONFIG, QUERY_CONFIG, fetchProfile(), useProfile() (+50 more)

### Community 4 - "MenuForm.tsx"
Cohesion: 0.07
Nodes (41): CategoryList(), emptyLocale(), Lang, LangImages, MenuForm(), normalizeLocale(), SeoKind, AVAIL_TABS (+33 more)

### Community 5 - "extractApiError"
Cohesion: 0.08
Nodes (43): LoginScreen(), BannerForm(), BannerFormProps, BannerType, ComplexCouponFields(), ComplexCouponFieldsProps, CouponForm(), num() (+35 more)

### Community 6 - "useDelivery.ts"
Cohesion: 0.08
Nodes (45): DeliveryManList(), DeliveryManSelectField(), DeliveryManSelectFieldProps, DeliveryManStats(), ASSIGNABLE_ORDER_STATUSES, ASSIGNMENT_STATUS_META, assignmentMeta(), formatTimestamp() (+37 more)

### Community 7 - "settings/index.ts"
Cohesion: 0.19
Nodes (9): LogoutButton(), PreferenceToggle(), ProfileHeader(), SettingsMenu(), StoreFormContainer(), managerLabel(), StoreList(), StoreLocationManager() (+1 more)

### Community 8 - "PageSeoForm.tsx"
Cohesion: 0.15
Nodes (14): emptyLangImages(), emptyLocale(), FullLocale, FullMeta, ImageKind, LangImages, normalizeLocale(), PAGES (+6 more)

### Community 9 - "Production-Ready Expo Boilerplate"
Cohesion: 0.10
Nodes (29): Login Screen (app/(auth)/login.tsx), Root Layout (app/_layout.tsx), Tab Navigation Layout (app/(tabs)/_layout.tsx), Home Screen (app/(tabs)/index.tsx), Settings Screen (app/(tabs)/settings.tsx), Root Redirect (app/index.tsx), Gluestack UI Exports (components/ui/index.ts), Theme Colors (constants/colors.ts) (+21 more)

### Community 10 - "order.ts"
Cohesion: 0.14
Nodes (17): getVariations(), MenuAddSection(), MenuAddSectionProps, orderService, NOTE: this endpoint intentionally has no trailing slash (matches backend)., AddCartPayload, BranchInfo, CouponValidatePayload (+9 more)

### Community 11 - "Dev Tooling & Lint Config"
Cohesion: 0.08
Nodes (24): @babel/core, eslint, eslint-config-expo, devDependencies, @babel/core, eslint, eslint-config-expo, tailwindcss (+16 more)

### Community 12 - "SectionHeading"
Cohesion: 0.20
Nodes (13): EMPTY, OthersSettingsForm(), PageContentForm(), PageContentFormProps, SectionHeading(), SectionHeadingProps, SocialLinkForm(), SocialLinkFormProps (+5 more)

### Community 13 - "toast.tsx"
Cohesion: 0.21
Nodes (15): CategoryForm(), EditableItem, appendImage(), BrandSettingsForm(), buildUpload(), ImagePickerField(), ImagePickerFieldProps, useCategory() (+7 more)

### Community 14 - "TypeScript Config"
Cohesion: 0.17
Nodes (11): expo-env.d.ts, expo/tsconfig.base, .expo/types/**/*.ts, nativewind-env.d.ts, **/*.ts, **/*.tsx, compilerOptions, paths (+3 more)

### Community 15 - "dependencies"
Cohesion: 0.18
Nodes (11): axios, expo-dev-client, dependencies, axios, expo-dev-client, react-dom, react-native, @tanstack/react-query (+3 more)

### Community 16 - "useSettings.ts"
Cohesion: 0.13
Nodes (24): managerName(), ManagerSelector(), ManagerSelectorProps, FormState, initFromStore(), Lang, StoreForm(), StoreFormProps (+16 more)

### Community 17 - "DeliveryManForm.tsx"
Cohesion: 0.31
Nodes (11): DeliveryManForm(), stripCode(), stripCode(), USER_TYPES, UserForm(), useDeliveryProfile(), useSaveDeliveryProfile(), useManagedUser() (+3 more)

### Community 19 - "Metro Bundler Config"
Cohesion: 0.50
Nodes (3): config, { getDefaultConfig }, { withNativeWind }

### Community 33 - "ui/index.ts"
Cohesion: 0.18
Nodes (12): TagForm(), ShopSettingsForm(), Avatar(), AvatarProps, Button(), ButtonProps, Input(), TextFieldProps (+4 more)

### Community 37 - "OrderList.tsx"
Cohesion: 0.18
Nodes (11): OrderRow, OrderRowProps, COMPLETED_TAB_STATUSES, getOrderListTab(), ONGOING_TAB_STATUSES, ORDER_LIST_TABS, OrderListTab, STATUS_ACTIONS (+3 more)

### Community 48 - "ToastManager"
Cohesion: 0.24
Nodes (4): react, react, ToastContainer(), ToastManager

### Community 64 - "SingleSelectField.tsx"
Cohesion: 0.36
Nodes (7): SingleSelectField(), SingleSelectFieldProps, DeliveryMethod, DeliverySection(), DeliverySectionProps, ShippingAddress, SelectOption

### Community 65 - "withAdiRegistration.js"
Cohesion: 0.33
Nodes (4): fs, path, SOURCE, { withDangerousMod }

### Community 67 - "OrderDetail.tsx"
Cohesion: 0.23
Nodes (9): OrderDetail(), OrderList(), STATUS_META, OrderStatusBadge(), OrderStatusBadgeProps, useAssignStoreLocation(), useDeleteOrder(), useUpdateOrderStatus() (+1 more)

### Community 69 - "OrderSummary.tsx"
Cohesion: 0.24
Nodes (9): CartLinesSection(), CartLinesSectionProps, CouponSectionProps, computeDiscount(), computeSubtotal(), OrderSummary(), OrderSummaryProps, CartLine (+1 more)

## Knowledge Gaps
- **166 isolated node(s):** `config`, `{ withDangerousMod }`, `fs`, `path`, `SOURCE` (+161 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **41 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `Dev Tooling & Lint Config`, `Expo Constants Dependency`, `Expo Dev Client Dependency`, `Expo Font Dependency`, `Expo Image Picker Dependency`, `Expo Linking Dependency`, `Expo Router Dependency`, `Expo Secure Store Dependency`, `Expo Status Bar Dependency`, `Expo System UI Dependency`, `Expo Updates Dependency`, `Gluestack Style Dependency`, `Gluestack UI Themed Dependency`, `NativeWind Dependency`, `OneSignal Expo Plugin Dependency`, `Async Storage Dependency`, `React Native Chart Kit Dependency`, `DateTimePicker Dependency`, `React Native CSS Interop Dependency`, `Gesture Handler Dependency`, `React Native OneSignal Dependency`, `ToastManager`, `Safe Area Context Dependency`, `React Native Screens Dependency`, `React Native SVG Dependency`, `React Native Web Dependency`, `React Native Worklets Dependency`, `Bottom Tabs Navigation Dependency`, `React Navigation Elements Dependency`, `React Navigation Native Dependency`, `Tailwind Merge Dependency`, `Zustand Dependency`, `expo-splash-screen`, `@expo/vector-icons`, `react-native-reanimated`?**
  _High betweenness centrality (0.220) - this node is a cross-community bridge._
- **Why does `ToastContainer()` connect `ToastManager` to `types/index.ts`, `toast.tsx`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Why does `react` connect `ToastManager` to `dependencies`?**
  _High betweenness centrality (0.209) - this node is a cross-community bridge._
- **What connects `config`, `{ withDangerousMod }`, `fs` to the rest of the system?**
  _166 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `useAuthStore` be split into smaller, more focused modules?**
  _Cohesion score 0.0762680488707886 - nodes in this community are weakly interconnected._
- **Should `Screen` be split into smaller, more focused modules?**
  _Cohesion score 0.05357142857142857 - nodes in this community are weakly interconnected._
- **Should `types/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.061458718992965566 - nodes in this community are weakly interconnected._