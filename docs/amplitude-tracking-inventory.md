# Amplitude Tracking Inventory

## 문서 목적
이 문서는 현재 코드베이스에서 실제로 Amplitude로 전송되는 이벤트와 각 이벤트의 속성 스키마를 정리한 문서다.

- 기준 시점: 2026-04-21
- 기준 범위: `components/`, `features/`, `lib/analytics/`
- 제외 범위: 테스트 코드
- 기준 방식: `trackEvent(...)`, `amplitude.track(...)`, 공용 analytics helper 직접 확인

## 현재 명시 이벤트 이름

현재 코드 기준으로 살아 있는 명시 이벤트 이름은 아래 3개다.

- `screen_viewed`
- `element_clicked`
- `component_interacted`

즉 아래 이벤트들은 현재 코드에서 제거되었거나 더 이상 전송되지 않는다.

- `home_experiment_scroll_depth_reached`
- `sell_flow_redirected_missing_photos`
- `element_exposed`
- `home_experiment_town_map_entered`
- `home_feed_load_failed`
- `search_opened`
- `search_submitted`
- `search_history_cleared`
- `sell_form_completed`
- `sell_photo_toggled`
- `town_map_bottom_sheet_expanded`
- `town_map_landing_engaged`
- `chat_appointment_started`
- `chat_appointment_invalid_state`
- `chat_appointment_completed`

## 초기화

Amplitude 초기화는 [lib/analytics/amplitude.ts](/Users/unsnruu/Documents/projects/dev/2026/karrot/lib/analytics/amplitude.ts:1) 에서 수행한다.

- SDK: `@amplitude/unified`
- 초기화: `amplitude.initAll(...)`
- 자동 수집: `analytics: { autocapture: true }`
- 사용자 식별: `localStorage` 기반 익명 visitor id를 생성해 `setUserId(...)`로 설정

## 공통 helper 스키마

### `screen_viewed`

공통 helper: [lib/analytics/screen-view.ts](/Users/unsnruu/Documents/projects/dev/2026/karrot/lib/analytics/screen-view.ts:1)

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `screen_name` | `string` | 예 | pathname을 제품 화면명으로 정규화한 값 |
| `path` | `string` | 예 | 현재 pathname |
| `query_string` | `string` | 아니오 | query string이 있을 때만 포함 |

### `element_clicked`

공통 helper: [lib/analytics/element-click.ts](/Users/unsnruu/Documents/projects/dev/2026/karrot/lib/analytics/element-click.ts:1)

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `screen_name` | `string` | 예 | 클릭이 발생한 화면 |
| `target_name` | `string` | 예 | 제품 내 정규화된 클릭 대상 이름 |
| `path` | `string` | 아니오 | 현재 pathname |
| `destination_path` | `string` | 아니오 | 클릭 후 이동 경로 |

## 이벤트별 스키마

### `screen_viewed`

전송 위치:

- [components/analytics-provider.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/components/analytics-provider.tsx:61)
- [features/home/screens/sell-photo-selection-screen.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/home/screens/sell-photo-selection-screen.tsx:23)
- [features/home/screens/sell-write-screen.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/home/screens/sell-write-screen.tsx:66)
- [features/home/screens/sell-price-screen.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/home/screens/sell-price-screen.tsx:31)
- [features/home/screens/sell-location-screen.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/home/screens/sell-location-screen.tsx:29)
- [features/home/screens/sell-preview-screen.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/home/screens/sell-preview-screen.tsx:34)
- [features/chat/screens/chat-appointment-screen.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/chat/screens/chat-appointment-screen.tsx:56)

기본 스키마:

- `screen_name: string`
- `path: string`
- `query_string?: string`

### `element_clicked`

전송 위치:

- 여러 UI 컴포넌트

기본 스키마:

- `screen_name: string`
- `target_name: string`
- `path?: string`
- `destination_path?: string`

현재 추가된 target:

- `town_map_search_input`
- `town_map_search_history_clear`
- `town_map_search_submit`
- `sell_write_submit_button`
- `chat_appointment_complete_button`

### `component_interacted`

전송 위치:

- [features/home/components/home-native-ad-carousel.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/home/components/home-native-ad-carousel.tsx:134)
- [features/home/components/home-native-ad-hero-carousel.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/home/components/home-native-ad-hero-carousel.tsx:126)
- [features/town-map/components/town-map-bottom-sheet.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/town-map/components/town-map-bottom-sheet.tsx:74)

스키마:

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `component_name` | `string` | 예 | `home_native_ad_carousel`, `town_map_bottom_sheet` |
| `interaction_type` | `string` | 예 | `scroll`, `expand` |
| `screen_name` | `string` | 예 | 화면명 |
| `surface` | `string` | 예 | UI 영역 |
| `item_count` | `number` | 아니오 | 캐러셀 아이템 개수 |
| `experiment_name` | `string` | 아니오 | 현재는 `home_to_town_map_entry` |
| `experiment_variant` | `string` | 아니오 | variant |

## 현재 해석상의 주의점

### 1. 검색 전용 이벤트는 현재 모두 `element_clicked`로 흡수됐다

`search_opened`, `search_submitted`, `search_history_cleared`는 현재 코드에서 별도 이벤트로 남아 있지 않다.

### 2. 채팅 약속의 시작/완료도 전용 이벤트가 아니다

- 약속 화면 진입은 `screen_viewed(chat_appointment)`로 본다.
- 약속 완료는 `element_clicked(chat_appointment_complete_button)`로 본다.

### 3. 홈 실험 town map 진입도 별도 이벤트가 아니다

`home_experiment_town_map_entered`는 현재 `screen_viewed`의 추가 속성으로 흡수되어 있다.

### 4. 상품 상세 추천 목록은 아직 클릭 추적이 없다

상품 상세 하단 추천 목록(`다른 물품 보러가기`, 추천 상품 카드)은 현재 `element_clicked`를 전송하지 않는다.

따라서 추천 목록을 통해 다른 상품 상세로 이동한 경우, 현재 기준으로는 도착 화면의 `screen_viewed`만 확인할 수 있다.
