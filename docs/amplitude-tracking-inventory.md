# Amplitude Tracking Inventory

## 문서 목적
이 문서는 현재 코드베이스에서 실제로 Amplitude로 전송되는 이벤트와 각 이벤트의 속성 스키마를 정리한 문서다.

- 기준 시점: 2026-04-21
- 기준 범위: `components/`, `features/`, `lib/analytics/`
- 제외 범위: 테스트 코드
- 기준 방식: `trackEvent(...)`, `amplitude.track(...)`, 공용 analytics helper 직접 확인

## 현재 명시 이벤트 이름

현재 코드 기준으로 살아 있는 명시 이벤트 이름은 아래 6개다.

- `screen_viewed`
- `element_clicked`
- `element_exposed`
- `component_interacted`
- `home_experiment_scroll_depth_reached`
- `sell_flow_redirected_missing_photos`

즉 아래 이벤트들은 현재 코드에서 제거되었거나 더 이상 전송되지 않는다.

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
| `target_type` | `string` | 예 | `button`, `link`, `tab`, `chip`, `card`, `input` 등 |
| `target_name` | `string` | 예 | 제품 내 정규화된 클릭 대상 이름 |
| `surface` | `string` | 아니오 | UI 영역 |
| `path` | `string` | 아니오 | 현재 pathname |
| `query_string` | `string` | 아니오 | 현재 query string |
| `target_id` | `string` | 아니오 | 클릭 대상 식별자 |
| `target_position` | `number` | 아니오 | 리스트/광고 내 위치 |
| `destination_path` | `string` | 아니오 | 클릭 후 이동 경로 |

### `element_exposed`

공통 helper: [lib/analytics/element-exposed.ts](/Users/unsnruu/Documents/projects/dev/2026/karrot/lib/analytics/element-exposed.ts:1)

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `screen_name` | `string` | 예 | 노출이 발생한 화면 |
| `target_type` | `string` | 예 | 노출 대상 타입 |
| `target_name` | `string` | 예 | 노출 대상 이름 |
| `surface` | `string` | 아니오 | UI 영역 |
| `path` | `string` | 아니오 | 현재 pathname |
| `query_string` | `string` | 아니오 | 현재 query string |
| `target_id` | `string` | 아니오 | 노출 대상 식별자 |
| `target_position` | `number` | 아니오 | 노출 대상 위치 |

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

추가 속성:

| 속성 | 타입 | 조건 | 설명 |
| --- | --- | --- | --- |
| `category` | `string` | 홈 실험 홈 화면 | 홈 카테고리 |
| `experiment_name` | `string` | 홈 실험 홈 화면 또는 실험 유입 town map 화면 | 현재는 `home_to_town_map_entry` |
| `experiment_variant` | `string` | 홈 실험 홈 화면 또는 실험 유입 town map 화면 | `a`, `b`, `c`, `d` |
| `experiment_surface` | `string` | 실험 유입 town map 화면 | 유입 surface |
| `target_id` | `string` | 실험 유입 town map 화면 | 광고/타겟 id |
| `target_name` | `string` | 실험 유입 town map 화면 | 기본값 `home_native_ad` |
| `target_position` | `number` | 실험 유입 town map 화면 | 광고 위치 |
| `target_type` | `string` | 실험 유입 town map 화면 | 기본값 `ad` |
| `feature_label` | `string` | `/developing` | 미구현 기능 라벨 |
| `return_to` | `string` | `/developing` | 복귀 경로 |
| `screen_type` | `string` | `/developing` | 현재는 `pending_feature` |
| `flow_name` | `string` | 판매 플로우 화면 | 현재는 `sell` |
| `step_name` | `string` | 판매 플로우 화면 | `photos`, `write`, `price`, `location`, `preview` |
| `photo_count` | `number` | 판매 플로우 화면 | 선택 사진 개수 |
| `has_title` | `boolean` | `sell_write` | 제목 존재 여부 |
| `has_description` | `boolean` | `sell_write` | 설명 존재 여부 |
| `has_price` | `boolean` | `sell_write`, `sell_price` | 가격 존재 여부 |
| `has_location` | `boolean` | `sell_write`, `sell_location` | 위치 존재 여부 |
| `has_published_item` | `boolean` | `sell_preview` | 미리보기 게시물 존재 여부 |
| `item_id` | `string` | `chat_appointment` | 상품 id |
| `seller_name` | `string` | `chat_appointment` | 판매자 이름 |
| `thread_id` | `string` | `chat_appointment` | 현재 구현에서는 item id 사용 |

### `element_clicked`

전송 위치:

- 여러 UI 컴포넌트

기본 스키마:

- `screen_name: string`
- `target_type: string`
- `target_name: string`
- `surface?: string`
- `path?: string`
- `query_string?: string`
- `target_id?: string`
- `target_position?: number`
- `destination_path?: string`

현재 코드에서 반복되는 추가 속성:

| 속성 | 타입 | 예시 |
| --- | --- | --- |
| `tab_label` | `string` | 하단 탭 이름 |
| `category` | `string` | 홈 카테고리 |
| `previous_category` | `string` | 카테고리 전환 전 값 |
| `action_icon` | `string` | FAB 액션 아이콘 이름 |
| `is_promoted` | `boolean` | 홈 상품 카드 |
| `ad_destination` | `string` | 홈 광고 목적지 |
| `ad_feature` | `string` | 홈 광고 feature |
| `experiment_name` | `string` | 실험 맥락 |
| `experiment_surface` | `string` | 실험 노출 surface |
| `experiment_variant` | `string` | 실험 variant |
| `chat_key` | `string` | 상품 상세 채팅 버튼 |
| `seller_name` | `string` | 채팅 상대/판매자 이름 |
| `town` | `string` | 동네 |
| `has_meetup_address` | `boolean` | 거래 희망 장소 링크 |
| `item_title` | `string` | 상품 제목 |
| `meetup_hint` | `string` | 거래 장소 힌트 |
| `previous_tab` | `string` | 탭 전환 이전 값 |
| `counterparty_name` | `string` | 채팅 상대 이름 |
| `category_label` | `string` | 동네지도 카테고리 라벨 |
| `pin_label` | `string` | 지도 핀 라벨 |
| `action_label` | `string` | 퀵 액션 라벨 |
| `business_name` | `string` | 업체명 |
| `contact_type` | `string` | `call`, `chat` |
| `query` | `string` | town map 검색 제출 |
| `has_query` | `boolean` | town map 검색 제출 |
| `has_location` | `boolean` | sell submit, appointment complete |
| `has_reminder` | `boolean` | appointment complete |
| `photo_count` | `number` | sell submit |
| `price_text` | `string` | sell submit |
| `trade_type` | `string` | sell submit |
| `item_id` | `string` | appointment complete |
| `scheduled_date` | `string` | appointment complete |
| `scheduled_time` | `string` | appointment complete |
| `thread_id` | `string` | appointment complete |

현재 추가된 target:

- `town_map_search_input`
- `town_map_search_history_clear`
- `town_map_search_submit`
- `sell_write_submit_button`
- `chat_appointment_complete_button`

### `element_exposed`

전송 위치:

- [features/home/components/use-home-experiment-impression.ts](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/home/components/use-home-experiment-impression.ts:1)

기본 스키마:

- `screen_name: string`
- `target_type: string`
- `target_name: string`
- `surface?: string`
- `path?: string`
- `query_string?: string`
- `target_id?: string`
- `target_position?: number`

현재 구현 추가 속성:

| 속성 | 타입 | 설명 |
| --- | --- | --- |
| `ad_destination` | `string` | 광고 목적지 |
| `ad_feature` | `string` | 광고 feature |
| `experiment_name` | `string` | 현재는 `home_to_town_map_entry` |
| `experiment_surface` | `string` | 광고 surface |
| `experiment_variant` | `string` | variant |
| `scroll_depth_percent` | `number` | 노출 시점 스크롤 퍼센트 |
| `scroll_depth_bucket` | `number` | `25`, `50`, `75`, `100` |

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

### `home_experiment_scroll_depth_reached`

전송 위치:

- [components/analytics-provider.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/components/analytics-provider.tsx:109)

스키마:

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `depth_percent` | `number` | 예 | `25`, `50`, `75`, `100` |
| `experiment_name` | `string` | 예 | `home_to_town_map_entry` |
| `experiment_variant` | `string` | 예 | variant |
| `path` | `string` | 예 | 현재 pathname |
| `screen_name` | `string` | 예 | 현재 화면명 |

### `sell_flow_redirected_missing_photos`

전송 위치:

- [features/home/screens/sell-write-screen.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/home/screens/sell-write-screen.tsx:54)
- [features/home/screens/sell-price-screen.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/home/screens/sell-price-screen.tsx:19)
- [features/home/screens/sell-location-screen.tsx](/Users/unsnruu/Documents/projects/dev/2026/karrot/features/home/screens/sell-location-screen.tsx:17)

스키마:

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `source` | `string` | 예 | `sell_write`, `sell_price`, `sell_location` |
| `target_step` | `string` | 예 | 현재는 `photos` |

## 현재 해석상의 주의점

### 1. 검색 전용 이벤트는 현재 모두 `element_clicked`로 흡수됐다

`search_opened`, `search_submitted`, `search_history_cleared`는 현재 코드에서 별도 이벤트로 남아 있지 않다.

### 2. 채팅 약속의 시작/완료도 전용 이벤트가 아니다

- 약속 화면 진입은 `screen_viewed(chat_appointment)`로 본다.
- 약속 완료는 `element_clicked(chat_appointment_complete_button)`로 본다.

### 3. 홈 실험 town map 진입도 별도 이벤트가 아니다

`home_experiment_town_map_entered`는 현재 `screen_viewed`의 추가 속성으로 흡수되어 있다.

### 4. `sell_flow_redirected_missing_photos` 의미

이 이벤트는 사용자가 `sell_write`, `sell_price`, `sell_location` 같은 뒤 단계로 들어왔지만 사진이 하나도 없어서 `photos` 단계로 강제 리다이렉트된 상황을 의미한다.

즉 “버튼 클릭”이 아니라 판매 플로우 가드가 동작했다는 의미라서 현재 별도 이벤트로 유지되고 있다.

### 5. 상품 상세 추천 목록은 아직 클릭 추적이 없다

상품 상세 하단 추천 목록(`다른 물품 보러가기`, 추천 상품 카드)은 현재 `element_clicked`를 전송하지 않는다.

따라서 추천 목록을 통해 다른 상품 상세로 이동한 경우, 현재 기준으로는 도착 화면의 `screen_viewed`만 확인할 수 있다.
