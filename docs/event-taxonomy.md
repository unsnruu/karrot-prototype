# 이벤트 택소노미

## 문서 목적
이 문서는 현재 코드베이스에서 실제로 Amplitude로 전송되는 이벤트와 각 이벤트의 속성 스키마를 정리하는 단일 기준 문서다.

- 기준 시점: 2026-05-20
- 기준 범위: `components/`, `features/`, `lib/analytics/`
- 제외 범위: 테스트 코드, `archive/` 보관 코드
- 기준 방식: `trackEvent(...)`, `amplitude.track(...)`, 공용 analytics helper 직접 확인

이 문서는 아래를 함께 다룬다.

- 이벤트 이름을 언제 새로 만들고 언제 기존 이벤트를 재사용할지
- `screen_viewed`를 어떤 기준 이벤트로 사용할지
- 이벤트를 어떤 속성 구조로 해석할지
- 현재 코드에서 실제로 어떤 이벤트가 수집되는지

이 문서는 아래 성격의 문서는 아니다.

- Amplitude SDK 설정 가이드 전체
- 모든 이벤트 payload의 최종 확정 사전
- SQL, 차트, 대시보드 작성법 문서

## 핵심 판단 기준

### 1. 이벤트 이름은 행동을 표현한다

이벤트 이름은 사용자가 무엇을 했는지 표현해야 한다.

권장 예시:

- `screen_viewed`
- `element_clicked`
- `element_exposed`
- `component_interacted`

비권장 예시:

- `home_experiment_screen_viewed`
- `town_map_search_header_clicked`
- `sell_write_price_chip_click`

### 2. 맥락 차이는 속성으로 표현한다

같은 행동이지만 발생 위치, 실험 조건, 대상이 다를 때는 이벤트를 새로 만들기보다 속성으로 구분한다.

예:

- 같은 화면 진입이면 `screen_viewed`
- 같은 클릭이면 `element_clicked`
- 같은 노출이면 `element_exposed`
- 같은 드래그/확장/스크롤이면 `component_interacted`

그리고 차이는 아래 속성으로 분리한다.

- 어느 화면인가: `screen_name`
- 어느 UI 영역인가: `surface`
- 무엇과 상호작용했는가: `target_type`, `target_name`, `target_id`
- 어떤 실험인가: `experiment_id`, `variant`, `iteration`

### 3. 새 이벤트는 행동 의미가 달라질 때만 만든다

새 이벤트는 아래 조건일 때만 만든다.

- 사용자의 행동 의미가 기존 이벤트와 명확히 다르다.
- 기존 이벤트와 속성 조합만으로는 분석 질문에 답하기 어렵다.
- 같은 행동으로 묶으면 해석이 왜곡된다.

현재는 이벤트 이름을 늘리기보다 `screen_viewed`, `element_clicked`, `element_exposed`, `component_interacted` 네 가지 명시 이벤트에 속성을 붙여 해석하는 방향을 기본으로 둔다.

### 4. 분석 질문이 병목이면 상태를 먼저 본다

모든 UI 조작을 클릭 이벤트로 먼저 수집하지 않는다.

특히 입력 플로우에서는 "무엇을 몇 번 눌렀는가"보다 "어느 단계에서 무엇이 비어 있는가"가 더 직접적인 제품 질문일 수 있다.

판매 플로우에서는 우선 아래 질문을 본다.

- 어떤 step까지 진입했는가
- 제목, 설명, 가격, 위치가 채워져 있었는가
- 사진 수가 전환에 어떤 영향을 주는가

그래서 sell flow는 `screen_viewed`에 `flow_name`, `step_name`, `has_*`, `photo_count`를 함께 붙여 해석한다.

### 5. fallback 화면도 같은 행동이면 같은 이벤트로 본다

미구현 기능 안내 화면도 제품 안의 하나의 화면으로 취급한다.

즉, `/developing` 진입은 별도 이벤트를 새로 만들지 않고 `screen_viewed`로 수집하며, 맥락은 속성으로 구분한다.

## `page_viewed`와 `screen_viewed`

이 프로젝트의 제품 분석 기준 이벤트는 `screen_viewed`다.

Amplitude Browser SDK의 자동 수집 page view 이벤트는 특정 URL path, referrer, page title, page URL 기준의 보조 분석과 디버깅에만 사용한다. 제품 퍼널, 실험 해석, 화면 흐름 분석에서는 팀이 명시적으로 보내는 `screen_viewed`를 우선 사용한다.

## 네이밍 규칙

- 이벤트 이름과 속성 이름은 전부 `snake_case`를 사용한다.
- 이벤트 이름은 행동 중심으로 작성하고, 가능하면 과거형 동사를 사용한다.
- Boolean은 `has_*` 형태를 우선 사용한다.
- 개수는 `*_count`, 순서는 `*_index` 또는 `*_position`, 비율은 `*_percent`를 우선 사용한다.
- 클릭 대상 이름은 기본적으로 `[screen]_[ui_name]` 형태의 정규화 이름을 사용한다.
- 행동이 없으면 의미가 모호한 경우에만 action suffix를 추가한다.

## 현재 명시 이벤트 이름

현재 라이브 화면 코드 기준으로 살아 있는 명시 이벤트 이름은 아래 4개다.

- `screen_viewed`
- `element_clicked`
- `element_exposed`
- `component_interacted`

즉 아래 이벤트들은 현재 코드에서 제거되었거나 더 이상 전송되지 않는다.

- `home_experiment_scroll_depth_reached`
- `sell_flow_redirected_missing_photos`
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
- `component_exposed`

## 초기화

Amplitude 초기화는 [lib/analytics/amplitude.ts](/Users/unsnruu/Projects/dev/2026/Karrot/lib/analytics/amplitude.ts:1) 에서 수행한다.

- SDK: `@amplitude/unified`
- 초기화: `amplitude.initAll(...)`
- 자동 수집: `analytics: { autocapture: true }`
- 사용자 식별: 앱 초기화 시 새 익명 visitor id를 생성해 `setUserId(...)`로 설정
- 실험 컨텍스트: [lib/analytics/visitor-experiment.ts](/Users/unsnruu/Projects/dev/2026/Karrot/lib/analytics/visitor-experiment.ts:1) 에서 `userId`, `appVersion`, `experiment`를 함께 생성해 메모리에 유지하고 `localStorage`에도 기록
- user property 세팅:
  - `app_version`
  - `experiment_id`
  - `iteration`
  - `variant`

## 공통 실험 속성

현재 `trackEvent(...)`를 통해 전송되는 모든 명시 이벤트에는 아래 실험/방문자 속성이 함께 붙는다.

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `user_id` | `string` | 예 | 앱 초기화 시 새로 생성되는 익명 visitor id |
| `app_version` | `string` | 예 | 현재 앱 버전 (`package.json`, 현재 `4.0`) |
| `experiment_id` | `string` | 예 | 현재 활성 실험 id |
| `iteration` | `string` | 예 | 현재 실험 iteration |
| `variant` | `string` | 예 | 현재 실험 variant |

현재 활성 실험은 아래 하나다.

- `experiment_id=item_location_map_chat_callout`
- `iteration=1`
- `variant=control | map_flow_callout`

## 공통 helper 스키마

### `screen_viewed`

공통 helper: [lib/analytics/screen-view.ts](/Users/unsnruu/Projects/dev/2026/Karrot/lib/analytics/screen-view.ts:1)  
scroll milestone helper: [lib/analytics/screen-scroll.ts](/Users/unsnruu/Projects/dev/2026/Karrot/lib/analytics/screen-scroll.ts:1)

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `screen_name` | `string` | 예 | pathname을 제품 화면명으로 정규화한 값 |
| `path` | `string` | 예 | 현재 pathname |
| `query_string` | `string` | 아니오 | query string이 있을 때만 포함 |
| `scroll_reached` | `number` | 아니오 | 일부 화면에서만 붙는 scroll milestone 퍼센트 |
| `query` | `string` | 아니오 | 동네지도 검색 결과 화면의 검색어 |
| `entry_source` | `string` | 아니오 | 동네지도 검색 결과 화면 진입 출처 |
| `return_to` | `string` | 아니오 | 동네지도 검색 결과 화면의 뒤로가기 목적지 |

운영 원칙:

- 기본 진입은 기존처럼 `screen_viewed` 1회를 보낸다.
- 일부 화면은 추가로 `screen_viewed + scroll_reached`를 milestone 도달 시 재전송한다.
- 현재 milestone은 `25`, `50`, `75` 세 값만 사용한다.

### `element_clicked`

공통 helper: [lib/analytics/element-click.ts](/Users/unsnruu/Projects/dev/2026/Karrot/lib/analytics/element-click.ts:1)

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `screen_name` | `string` | 예 | 클릭이 발생한 화면 |
| `target_name` | `string` | 예 | 제품 내 정규화된 클릭 대상 이름 |
| `path` | `string` | 아니오 | 현재 pathname |
| `destination_path` | `string` | 아니오 | 클릭 후 이동 경로 |
| `target_type` | `string` | 아니오 | 버튼, 카드, 링크 등 대상 유형 |
| `surface` | `string` | 아니오 | 화면 내 UI 영역 |
| `query_string` | `string` | 아니오 | 필요 시 현재 query string |
| `target_id` | `string` | 아니오 | 대상 entity id |
| `target_position` | `number` | 아니오 | 리스트/캐러셀 내 순서 |

### `element_exposed` / `component_exposed`

공통 helper: [lib/analytics/exposure.ts](/Users/unsnruu/Projects/dev/2026/Karrot/lib/analytics/exposure.ts:1)

운영 원칙:

- 모든 UI에 붙이지 않는다.
- 실험 판단이나 핵심 퍼널 해석에 직접 필요한 surface에만 붙인다.
- 기본 노출은 `IntersectionObserver` 기준 60% 이상 보였을 때 1회만 전송한다.

`element_exposed` 권장 속성:

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `screen_name` | `string` | 예 | 노출이 발생한 화면 |
| `target_name` | `string` | 예 | 노출 대상 element taxonomy 이름 |
| `path` | `string` | 아니오 | 현재 pathname |
| `destination_path` | `string` | 아니오 | 클릭 시 이동할 경로 |
| `target_type` | `string` | 아니오 | 카드, 버튼, 링크 등 |
| `surface` | `string` | 아니오 | 노출 위치 |
| `target_id` | `string` | 아니오 | 대상 id |
| `target_position` | `number` | 아니오 | 노출 순서 |

`component_exposed` 권장 속성:

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `component_name` | `string` | 예 | 노출된 component 이름 |
| `screen_name` | `string` | 예 | 노출이 발생한 화면 |
| `surface` | `string` | 예 | 화면 내 UI 영역 |
| `path` | `string` | 아니오 | 현재 pathname |

## 이벤트별 스키마

아래 섹션은 각 이벤트의 "고유 속성"만 정리한다.

- `user_id`
- `app_version`
- `experiment_id`
- `iteration`
- `variant`

는 위 `공통 실험 속성` 섹션에서 한 번만 설명하고, 아래 이벤트별 스키마에서는 반복하지 않는다.

### `screen_viewed`

전송 위치:

- [components/analytics-provider.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/components/analytics-provider.tsx:1)
- [features/home/screens/sell-photo-selection-screen.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/features/home/screens/sell-photo-selection-screen.tsx:1)
- [features/home/screens/sell-write-screen.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/features/home/screens/sell-write-screen.tsx:1)
- [features/home/screens/sell-price-screen.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/features/home/screens/sell-price-screen.tsx:1)
- [features/home/screens/sell-location-screen.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/features/home/screens/sell-location-screen.tsx:1)
- [features/home/screens/sell-preview-screen.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/features/home/screens/sell-preview-screen.tsx:1)
- [features/chat/screens/chat-appointment-screen.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/features/chat/screens/chat-appointment-screen.tsx:1)
- [features/home/components/item-detail-main-column.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/features/home/components/item-detail-main-column.tsx:1)
- [features/home/components/home-feed.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/features/home/components/home-feed.tsx:1)

기본 스키마:

- `screen_name: string`
- `path: string`
- `query_string?: string`
- `scroll_reached?: 25 | 50 | 75`

현재 `scroll_reached`가 붙는 화면:

- `home`
- `item_detail`

### `element_clicked`

전송 위치:

- 여러 UI 컴포넌트

기본 스키마:

- `screen_name: string`
- `target_name: string`
- `path?: string`
- `destination_path?: string`
- `target_type?: string`
- `surface?: string`
- `query_string?: string`
- `target_id?: string`
- `target_position?: number`

현재 추가된 대표 target:

- `town_map_search_input`
- `town_map_search_history_clear`
- `town_map_search_submit`
- `town_map_recent_search_item`
- `town_map_search_suggestion`
- `town_map_search_complete_button`
- `town_map_search_results_back_button`
- `town_map_search_results_close_button`
- `town_map_search_results_list_button`
- `sell_write_submit_button`
- `chat_quick_action_appointment`
- `chat_appointment_complete_button`
- `chat_appointment_place_recommendation_cta`
- `chat_appointment_place_recommendation_callout_link`
- `item_detail_location_header_link`
- `item_detail_location_map_cta`
- `item_detail_location_distance_link`
- `item_detail_recommendation_card`
- `home_native_ad`
- `home_item_card`

### `element_exposed`

전송 위치:

- [features/home/components/home-native-ad-card.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/features/home/components/home-native-ad-card.tsx:1)

현재는 중요한 entry surface만 부착한다.

기본 스키마:

- `screen_name: string`
- `target_name: string`
- `path?: string`
- `destination_path?: string`
- `target_type?: string`
- `surface?: string`
- `target_id?: string`
- `target_position?: number`

현재 추가된 target:

- `home_native_ad`

### `component_exposed`

전송 위치:

- 현재 라이브 화면 코드에는 없다.
- 이전 `item_detail_nearby_business_carousel` 실험 코드는 `features/home/components/archive/` 아래에 보관되어 있다.

기본 스키마:

- `component_name: string`
- `screen_name: string`
- `surface: string`
- `path?: string`

현재 추가된 component:

- 없음

### `component_interacted`

전송 위치:

- [features/town-map/components/town-map-bottom-sheet.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/features/town-map/components/town-map-bottom-sheet.tsx:1)
- [features/town-map/components/town-map-kakao-map.tsx](/Users/unsnruu/Projects/dev/2026/Karrot/features/town-map/components/town-map-kakao-map.tsx:1)

스키마:

| 속성 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `component_name` | `string` | 예 | `town_map_bottom_sheet`, `town_map_map` |
| `interaction_type` | `string` | 예 | `scroll`, `expand`, `pan`, `zoom`, `tap` |
| `screen_name` | `string` | 예 | 화면명 |
| `surface` | `string` | 예 | UI 영역 |
| `path` | `string` | 아니오 | 현재 path |

현재 추가된 component:

- `town_map_bottom_sheet`
- `town_map_map`

## 현재 해석상의 주의점

### 1. 검색 전용 이벤트는 현재 모두 `element_clicked`로 흡수됐다

`search_opened`, `search_submitted`, `search_history_cleared`는 현재 코드에서 별도 이벤트로 남아 있지 않다.

### 2. 채팅 약속의 시작/완료도 전용 이벤트가 아니다

- 약속 화면 진입은 `screen_viewed(chat_appointment)`로 본다.
- 약속 완료는 `element_clicked(chat_appointment_complete_button)`로 본다.

### 3. 노출 이벤트는 다시 도입됐지만 전면 부착하지 않는다

`element_exposed`, `component_exposed`는 다시 살아났지만, 모든 카드/섹션에 붙이지 않는다.

현재 기준은 아래와 같다.

- 실험 판단에 직접 쓰이는 surface인가
- 클릭률/진입율의 분모로 삼을 가치가 있는가
- 노이즈 대비 해석 이득이 충분한가

즉 현재는 `home_native_ad`처럼 중요한 지점만 선별적으로 추적한다.

### 4. scroll depth도 별도 이벤트가 아니라 `screen_viewed` 속성으로 본다

기존의 `*_scroll_depth_reached` 계열 이벤트는 다시 만들지 않는다.

대신 일부 긴 상세 화면에서만 아래처럼 해석한다.

- 상세 진입: `screen_viewed(screen_name=item_detail)`
- 절반 이상 읽음: `screen_viewed(screen_name=item_detail, scroll_reached=50)`
- 거의 끝까지 읽음: `screen_viewed(screen_name=item_detail, scroll_reached=90)`

현재는 `home`, `item_detail` 두 화면에만 적용한다.

### 5. 상품 상세 근처 업체 carousel 실험은 종료됐다

이전 `item_detail_nearby_business_entry` 실험에서 쓰던 carousel UI와 관련 이벤트는 현재 라이브 화면에서 전송되지 않는다.
관련 코드는 `features/home/components/archive/` 아래에 보관한다.
