# Component Inventory

Last reviewed: 2026-04-17

## Summary

- Shared exported components in `components/`: 5
- Feature exported components in `features/`: 44
- Screen components in `features/*/screens`: 16
- Repeated hardcoded UI patterns found:
  - rounded selection chips
  - sticky top page headers
  - ad hoc icon buttons and CTA buttons
  - section blocks with repeated border/background/text tokens

This inventory focuses on the components that currently shape the UI layer of the prototype. Utility hooks, analytics helpers, and route files are omitted unless they directly render UI.

## Shared Components

### `components/navigation`

| Component | File | Role |
| --- | --- | --- |
| `BottomNav` | `components/navigation/bottom-nav.tsx` | Fixed bottom navigation shell for main tabs |

### `components/ui`

| Component | File | Role |
| --- | --- | --- |
| `ActionButton` | `components/ui/action-button.tsx` | Seed `Action Button` 개념에 맞춘 CTA/outline/ghost 버튼 프리미티브 |
| `AppToolbar` | `components/ui/app-toolbar.tsx` | 액션 아이콘이 있는 상단 툴바 레이아웃 프리미티브 |
| `AppImage` | `components/ui/app-image.tsx` | Unified image wrapper around Next Image |
| `FieldButton` | `components/ui/field-button.tsx` | Seed `Field Button` 개념에 맞춘 picker/link field 프리미티브 |
| `IconButton` | `components/ui/icon-button.tsx` | 아이콘 전용 button/link/pending-action 프리미티브 |
| `ListSection` / `ListEmptyState` | `components/ui/list-section.tsx` | Seed `List` 개념에 맞춘 섹션/빈 상태 프리미티브 |
| `PageHeader` | `components/ui/page-header.tsx` | Shared sticky top header with centered title layout |
| `PendingFeatureLink` | `components/ui/pending-feature-link.tsx` | Routes interactions to pending-feature placeholders |
| `SelectionChipButton` / `SelectionChipLink` | `components/ui/selection-chip.tsx` | Shared rounded filter/selection chip primitives |
| `TabsList` / `TextTabLink` / `UnderlineTabLink` | `components/ui/tabs.tsx` | Seed `Tabs` 개념에 맞춘 텍스트/언더라인 탭 프리미티브 |
| `UserAvatar` | `components/ui/user-avatar.tsx` | Seed `Avatar` 개념에 맞춘 사용자 아바타 프리미티브 |

## Seed-Aligned UI Concepts

The project now has a small set of shared primitives extracted around concepts that also exist in SEED Design:

| SEED concept | Local primitive | Current callers |
| --- | --- | --- |
| `Action Button` | `ActionButton` | item detail CTA, chat appointment complete CTA, community detail reaction/save buttons, appointment card CTA |
| `Avatar` | `UserAvatar` | chat thread row, chat bubble seller avatar, item detail seller header, community author/comment avatars |
| `Field Button` | `FieldButton` | chat appointment picker rows, sell-write location selector |
| `Chip` | `SelectionChipButton` / `SelectionChipLink` | home category chips, community topic chips, chat filter chips, sell trade chips |
| `List` | `ListSection` / `ListEmptyState` | community post list, cafe post list, meetup list, chat thread list |
| `Page Header` | `PageHeader` | sell write, home services, shared location selection layout |
| `Toolbar/Header Actions` | `AppToolbar` + `IconButton` | chat header, community detail header, town-map business detail header |
| `Tabs` | `TextTabLink` / `UnderlineTabLink` | community top tabs, town-map business detail tabs |

Reviewed against SEED React component docs:
- `Action Button`
- `Avatar`
- `Field Button`
- `Chip`
- `Tabs`
- `List`

## Home Feature

### Screens

| Component | File | Role |
| --- | --- | --- |
| `HomeServicesScreen` | `features/home/screens/home-services-screen.tsx` | “전체 서비스” grid screen |
| `ItemDetailScreen` | `features/home/screens/item-detail-screen.tsx` | Marketplace item detail shell |
| `ItemLocationScreen` | `features/home/screens/item-location-screen.tsx` | Item location screen |
| `SellLocationScreen` | `features/home/screens/sell-location-screen.tsx` | Sell flow location step |
| `SellPhotoSelectionScreen` | `features/home/screens/sell-photo-selection-screen.tsx` | Sell flow photo step |
| `SellPreviewScreen` | `features/home/screens/sell-preview-screen.tsx` | Sell flow preview step |
| `SellPriceScreen` | `features/home/screens/sell-price-screen.tsx` | Sell flow price step |
| `SellWriteScreen` | `features/home/screens/sell-write-screen.tsx` | Sell flow write step |

### Reusable Components

| Component | File | Role |
| --- | --- | --- |
| `HomeFab` | `features/home/components/home-fab.tsx` | Floating write menu |
| `HomeFeed` | `features/home/components/home-feed.tsx` | Main home feed composition |
| `HomeHeader` | `features/home/components/home-header.tsx` | Home top bar and category rail |
| `HomeNativeAdBanner` | `features/home/components/home-native-ad-banner.tsx` | Inline ad banner |
| `HomeNativeAdCard` | `features/home/components/home-native-ad-card.tsx` | Feed ad card |
| `HomeNativeAdCarousel` | `features/home/components/home-native-ad-carousel.tsx` | Carousel-style ad rail |
| `HomeNativeAdHeroCarousel` | `features/home/components/home-native-ad-hero-carousel.tsx` | Hero ad carousel |
| `HomeNativeAdHighlightCard` | `features/home/components/home-native-ad-highlight-card.tsx` | Highlighted ad card |
| `HomeNativeAdThumbnail` | `features/home/components/home-native-ad-thumbnail.tsx` | Shared ad image thumb |
| `ItemDetailBottomBar` | `features/home/components/item-detail-bottom-bar.tsx` | Sticky bottom action area |
| `ItemDetailChatButton` | `features/home/components/item-detail-chat-button.tsx` | Primary CTA button on item detail |
| `ItemDetailHero` | `features/home/components/item-detail-hero.tsx` | Image hero/header for item detail |
| `ItemDetailKakaoMap` | `features/home/components/item-detail-kakao-map.tsx` | Item detail map preview |
| `ItemDetailMainColumn` | `features/home/components/item-detail-main-column.tsx` | Main item detail body |
| `MarketplaceListItem` | `features/home/components/marketplace-list-item.tsx` | Feed row for marketplace items |
| `SellLocationPickerMap` | `features/home/components/sell-location-picker-map.tsx` | Location picker map panel |
| `SellPreviewBottomBar` | `features/home/components/sell-preview-bottom-bar.tsx` | Preview step bottom CTA |

## Community Feature

### Screens

| Component | File | Role |
| --- | --- | --- |
| `CommunityScreen` | `features/community/screens/community-screen.tsx` | Community shell and tab routing |
| `CommunityPostDetailScreen` | `features/community/screens/community-post-detail-screen.tsx` | Post detail screen |

### Reusable Components

| Component | File | Role |
| --- | --- | --- |
| `CafePostCard` | `features/community/components/cafe-post-card.tsx` | Cafe feed item |
| `CafePostList` | `features/community/components/cafe-post-list.tsx` | Cafe feed list shell |
| `CommunityBannerLink` | `features/community/components/community-banner-link.tsx` | Meetup promo banner |
| `CommunityCategoryRail` | `features/community/components/community-category-rail.tsx` | Circular category rail |
| `CommunityCommentThread` | `features/community/components/community-comment-thread.tsx` | Nested comments section |
| `CommunityHeader` | `features/community/components/community-header.tsx` | Community title, top tabs, topic filters |
| `CommunityMeetupCard` | `features/community/components/community-meetup-card.tsx` | Meetup card |
| `CommunityMeetupList` | `features/community/components/community-meetup-list.tsx` | Meetup list shell |
| `CommunityPostCard` | `features/community/components/community-post-card.tsx` | Town post card |
| `CommunityPostList` | `features/community/components/community-post-list.tsx` | Town post list |
| `CommunityRecommendedPostRow` | `features/community/components/community-recommended-post-row.tsx` | Related post row |

## Chat Feature

### Screens

| Component | File | Role |
| --- | --- | --- |
| `ChatAppointmentLocationScreen` | `features/chat/screens/chat-appointment-location-screen.tsx` | Appointment location step |
| `ChatAppointmentScreen` | `features/chat/screens/chat-appointment-screen.tsx` | Appointment detail screen |
| `ChatLandingScreen` | `features/chat/screens/chat-landing-screen.tsx` | Chat inbox screen |
| `ChatScreen` | `features/chat/screens/chat-screen.tsx` | Chat thread screen |

### Reusable Components

| Component | File | Role |
| --- | --- | --- |
| `ChatCategoryChip` | `features/chat/components/chat-category-chip.tsx` | Filter chip for chat inbox |
| `ChatMessageRow` | `features/chat/components/chat-message-row.tsx` | Message bubble row |
| `ChatThreadListClient` | `features/chat/components/chat-thread-list-client.tsx` | Client list wrapper |
| `ChatThreadRow` | `features/chat/components/chat-thread-row.tsx` | Chat inbox row |
| `HistoryBackButton` | `features/chat/components/history-back-button.tsx` | Smart back navigation button |

## Town Map Feature

### Screens

| Component | File | Role |
| --- | --- | --- |
| `TownMapBusinessDetailScreen` | `features/town-map/screens/town-map-business-detail-screen.tsx` | Business detail page |
| `TownMapScreen` | `features/town-map/screens/town-map-screen.tsx` | Main town map screen |
| `TownMapSearchScreen` | `features/town-map/screens/town-map-search-screen.tsx` | Town map search UI |

### Reusable Components

| Component | File | Role |
| --- | --- | --- |
| `TownMapBottomSheet` | `features/town-map/components/town-map-bottom-sheet.tsx` | Draggable bottom sheet |
| `TownMapBusinessMiniMap` | `features/town-map/components/town-map-business-mini-map.tsx` | Mini map preview |
| `TownMapCategoryChip` | `features/town-map/components/town-map-category-chip.tsx` | Search category chip |
| `TownMapKakaoMap` | `features/town-map/components/town-map-kakao-map.tsx` | Kakao map renderer |
| `TownMapPostCard` | `features/town-map/components/town-map-post-card.tsx` | Post card in map feed |
| `TownMapQuickActionCard` | `features/town-map/components/town-map-quick-action-card.tsx` | Quick action tile |

## Shared Feature-Specific Components

| Component | File | Role |
| --- | --- | --- |
| `LocationSelectionLayout` | `features/shared/components/location-selection-layout.tsx` | Shared shell for map/location flows |
| `DevelopmentPendingScreen` | `features/shared/screens/development-pending-screen.tsx` | Generic pending-state screen |

## My Karrot Feature

| Component | File | Role |
| --- | --- | --- |
| `MyKarrotScreen` | `features/my-karrot/screens/my-karrot-screen.tsx` | My Karrot overview screen |

## Inline / Private Subcomponents Worth Noting

These are still local to a single file but they already behave like reusable UI parts:

- `TradeChip` in `features/home/screens/sell-write-screen.tsx`
- `ProfileCard` and `PayCard` in `features/my-karrot/screens/my-karrot-screen.tsx`
- `Section`, `TabButton`, `InfoRow`, `StarRow` in `features/town-map/screens/town-map-business-detail-screen.tsx`
- `AppointmentRow` in `features/chat/screens/chat-appointment-screen.tsx`
- `SellerSection`, `ItemBodySection`, `RecommendationsSection` in `features/home/components/item-detail-main-column.tsx`

## Hardcoded UI Hotspots

These areas still rely heavily on one-off classes or inline SVG/UI composition and are good candidates for future extraction:

1. `features/town-map/screens/town-map-business-detail-screen.tsx`
2. `features/community/screens/community-post-detail-screen.tsx`
3. `features/chat/screens/chat-screen.tsx`
4. `features/home/components/home-fab.tsx`
5. `features/home/screens/sell-write-screen.tsx`

## Changes Made In This Pass

- Added `PageHeader` to reduce repeated sticky header markup.
- Added `SelectionChipButton` and `SelectionChipLink` to centralize the repeated rounded chip pattern.
- Added `ActionButton`, `FieldButton`, and `UserAvatar` around SEED-equivalent component concepts.
- Added `ListSection` / `ListEmptyState` and `TextTabLink` / `UnderlineTabLink` around SEED `List` and `Tabs` concepts.
- Added `AppToolbar` and expanded `IconButton` to absorb repeated header/action chrome.
- Migrated the following callers to shared UI primitives:
  - `features/home/components/home-header.tsx`
  - `features/community/components/community-header.tsx`
  - `features/chat/components/chat-category-chip.tsx`
  - `features/home/screens/sell-write-screen.tsx`
  - `features/shared/components/location-selection-layout.tsx`
  - `features/home/screens/home-services-screen.tsx`
  - `features/chat/components/chat-thread-row.tsx`
  - `features/chat/components/chat-message-row.tsx`
  - `features/home/components/item-detail-main-column.tsx`
  - `features/home/components/item-detail-chat-button.tsx`
  - `features/community/components/community-comment-thread.tsx`
  - `features/community/screens/community-post-detail-screen.tsx`
  - `features/chat/screens/chat-appointment-location-screen.tsx`
  - `features/chat/screens/chat-appointment-screen.tsx`
  - `features/home/screens/sell-price-screen.tsx`
  - `features/community/components/community-post-list.tsx`
  - `features/community/components/cafe-post-list.tsx`
  - `features/community/components/community-meetup-list.tsx`
  - `features/chat/components/chat-thread-list-client.tsx`
  - `features/community/components/community-header.tsx`
  - `features/town-map/screens/town-map-business-detail-screen.tsx`
  - `features/chat/screens/chat-screen.tsx`
  - `features/community/screens/community-post-detail-screen.tsx`
