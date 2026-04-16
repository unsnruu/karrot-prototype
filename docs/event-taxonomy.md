# 이벤트 택소노미

## 문서 목적
이 문서는 현재 프로토타입에서 사용하는 Amplitude 이벤트를 어떤 기준으로 설계하고 해석할지 정의하기 위한 문서입니다.

이 문서는 아래 내용을 설명하기 위해 존재합니다.

- 이벤트 이름을 언제 새로 만들고 언제 기존 이벤트를 재사용할지
- `screen_viewed`를 어떤 기준 이벤트로 사용할지
- 이벤트를 속성으로 어떻게 구분할지
- Amplitude 자동 수집 이벤트와 제품 이벤트를 어떻게 구분해서 볼지

이 문서는 아래 성격의 문서가 아닙니다.

- Amplitude SDK 설정 가이드 전체
- 모든 이벤트 payload의 최종 확정 사전
- SQL, 차트, 대시보드 작성법 문서

## 현재 상태 요약
현재 저장소에는 Amplitude 연동 코드가 존재하지만, 이벤트 택소노미 자체를 설명하는 전용 문서는 없습니다.

- Amplitude 초기화와 `trackEvent()` 유틸은 `lib/analytics/amplitude.ts`에 존재합니다.
- 화면 진입 이벤트는 기본적으로 `screen_viewed`로 전송합니다.
- 공통 화면은 `components/analytics-provider.tsx`에서 전송하고, 추가 상태 속성이 필요한 일부 화면은 로컬 화면 컴포넌트에서 직접 전송합니다.
- 일부 실험 전용 이벤트와 도메인 이벤트는 화면/컴포넌트 단위에서 개별적으로 호출합니다.
- `autocapture: true` 설정으로 인해 Amplitude Browser SDK의 자동 수집 이벤트도 함께 들어올 수 있습니다.

즉, 현재는 명시 문서보다 코드 패턴이 사실상의 규칙 역할을 하고 있습니다.

## 핵심 원칙

### 1. 이벤트 이름은 행동을 표현한다
이벤트 이름은 사용자가 무엇을 했는지 표현해야 합니다.

좋은 예시는 아래와 같습니다.

- `screen_viewed`
- `search_submitted`
- `element_clicked`
- `form_completed`

반대로 아래처럼 행동과 맥락을 한 번에 모두 이름에 넣기 시작하면 이벤트 수가 빠르게 늘어나고, 비슷한 이벤트가 여러 개 생기기 쉽습니다.

- `home_experiment_screen_viewed`
- `town_map_search_screen_viewed`
- `home_header_category_clicked`

맥락은 가능하면 이벤트 이름이 아니라 속성으로 구분합니다.

### 2. 맥락 차이는 속성으로 표현한다
같은 행동이지만 발생한 위치나 실험 조건이 다를 때는 이벤트를 새로 만들기보다 속성으로 구분합니다.

예를 들면 아래와 같습니다.

- 같은 화면 진입이면 `screen_viewed`
- 같은 클릭이면 `element_clicked`
- 같은 검색 제출이면 `search_submitted`

그리고 차이는 아래 속성으로 분리합니다.

- 어느 화면인가: `screen_name`
- 어느 UI surface인가: `surface`
- 무엇을 눌렀는가: `target_type`, `target_id`, `target_label`
- 어떤 실험인가: `experiment_name`, `experiment_variant`

### 3. 새 이벤트는 행동 의미가 달라질 때만 만든다
새 이벤트는 아래 조건일 때만 만드는 것을 원칙으로 합니다.

- 사용자의 행동 의미가 기존 이벤트와 명확히 다르다
- 분석 질문이 기존 이벤트와 속성 조합만으로는 깔끔하게 답되지 않는다
- 같은 행동으로 묶으면 오히려 해석이 왜곡된다

예를 들면 아래는 별도 이벤트가 타당합니다.

- `chat_appointment_completed`
- `sell_form_completed`

이벤트 이름만 봐도 제품적으로 별도의 완료 행동을 의미하기 때문입니다.

## `page_viewed`와 `screen_viewed`

### 결론
이 프로젝트의 제품 분석 기준 이벤트는 `screen_viewed`로 정의합니다.

Amplitude Browser SDK의 자동 수집 page view 이벤트는 보조 이벤트로 취급합니다.

### 왜 `screen_viewed`를 기준으로 삼는가
현재 프로토타입에서 분석하고 싶은 질문은 대부분 URL 자체보다 제품 화면 흐름에 가깝습니다.

예시는 아래와 같습니다.

- 사용자가 홈에 진입했는가
- 사용자가 동네지도 검색 화면까지 갔는가
- 사용자가 상품 상세를 봤는가
- 사용자가 판매 작성 플로우 어느 단계까지 갔는가

이 질문은 페이지 URL보다는 제품이 정의한 화면 이름으로 보는 것이 더 자연스럽습니다.

또한 동적 경로가 있는 경우에도 여러 URL을 하나의 제품 화면으로 묶을 수 있습니다.

예를 들면 아래 두 경로는 URL은 다르지만 같은 화면으로 해석할 수 있습니다.

- `/community/123`
- `/community/456`

둘 다 제품 관점에서는 `community_post_detail`입니다.

### `page_viewed`의 역할
Amplitude Browser SDK는 page view tracking이 켜져 있으면 `[Amplitude] Page Viewed` 이벤트를 자동으로 수집할 수 있습니다.

이 이벤트는 아래와 같은 웹 기술 관점의 질문에는 유용합니다.

- 특정 URL path가 실제로 몇 번 열렸는가
- referrer, page title, page URL 기준으로 어떤 유입이 있었는가
- SPA navigation이 URL 단위로 어떻게 움직였는가

하지만 현재 프로토타입의 주요 분석 질문은 대부분 제품 화면 기준이므로, 팀의 표준 화면 진입 이벤트는 `screen_viewed`로 통일하는 것이 더 적합합니다.

### 문서상 취급 원칙

- `screen_viewed`는 제품 표준 이벤트다.
- `[Amplitude] Page Viewed`는 SDK 자동 수집 이벤트다.
- 대시보드, 퍼널, 실험 해석에서 화면 기준 지표는 `screen_viewed`를 우선 사용한다.
- `[Amplitude] Page Viewed`는 디버깅, URL 검증, 보조 분석 용도로만 사용한다.

## 표준 속성 구조
이벤트를 통합적으로 운영하려면 속성도 역할별로 나누어야 합니다.

### 1. 공통 컨텍스트 속성
화면과 위치를 설명하는 기본 속성입니다.

- `screen_name`
- `path`
- `query_string`

향후 필요하면 아래도 추가 검토할 수 있습니다.

- `previous_screen_name`
- `session_id`
- `app_version`
- `platform`

### 2. UI 맥락 속성
같은 행동이 화면 안 어디에서 일어났는지를 설명합니다.

- `surface`
- `section`
- `component_name`
- `slot`
- `tab_name`

### 3. 액션 대상 속성
사용자가 무엇과 상호작용했는지 설명합니다.

- `target_type`
- `target_id`
- `target_label`
- `target_position`

### 4. 도메인 속성
도메인별 분석에 필요한 속성입니다.

- `category`
- `query`
- `item_id`
- `business_id`
- `trade_type`
- `photo_count`

### 5. 실험 속성
실험 이벤트를 별도 이름으로 과하게 분리하지 않기 위해 쓰는 속성입니다.

- `experiment_name`
- `experiment_variant`
- `experiment_surface`
- `experiment_source`

## 네이밍 규칙

### 이벤트 이름

- 전부 `snake_case`를 사용합니다.
- 이벤트 이름은 행동 중심으로 작성합니다.
- 가능하면 과거형 동사를 사용합니다.

권장 예시:

- `screen_viewed`
- `element_clicked`
- `search_submitted`
- `form_completed`
- `appointment_completed`

비권장 예시:

- `home_experiment_screen_viewed`
- `town_map_search_header_clicked`
- `sell_write_price_chip_click`

### 속성 이름

- 전부 `snake_case`를 사용합니다.
- Boolean은 `has_*` 형태를 우선 사용합니다.
- 개수는 `*_count`, 순서는 `*_index`, 비율은 `*_percent` 형식을 우선 사용합니다.

예시:

- `has_title`
- `photo_count`
- `ad_index`
- `depth_percent`

## 현재 구현된 `screen_viewed`
현재 코드 기준 `screen_viewed`는 두 방식으로 전송합니다.

- 공통 화면은 `components/analytics-provider.tsx`에서 라우트 변경 시점에 전송합니다.
- 판매 플로우처럼 추가 상태 속성이 필요한 화면은 각 화면 컴포넌트에서 직접 전송합니다.

공통 기본 속성은 아래 3개입니다.

- `path`
- `screen_name`
- `query_string`

전송 형태는 아래와 같습니다.

```ts
trackEvent("screen_viewed", {
  path: pathname,
  screen_name: screenName,
  query_string: search || undefined,
});
```

### 현재 `screen_name` 매핑 예시

- `/` -> `root`
- `/home` -> `home`
- `/community` -> `community`
- `/community/[id]` -> `community_post_detail`
- `/town-map` -> `town_map`
- `/town-map/search` -> `town_map_search`
- `/chat/[id]` -> `chat_detail`
- `/home/items/[id]` -> `item_detail`
- `/exp/a/home` -> `exp_a_home`

### 현재 추가로 붙는 대표 속성 예시
일부 화면은 `screen_viewed`에 화면별 상태 속성을 함께 전달합니다.

- 홈 실험 홈 화면
  - `experiment_name`
  - `experiment_variant`
  - `category`
- 판매 플로우 화면
  - `flow_name`
  - `step_name`
  - `photo_count`
  - `has_title`
  - `has_description`
  - `has_price`
  - `has_location`
  - `has_published_item`

## 현재 이벤트 inventory 요약
현재 코드에 존재하는 주요 커스텀 이벤트는 아래와 같습니다.

### 공통

- `screen_viewed`

### 홈 / 실험

- `home_experiment_ad_viewed`
- `home_experiment_ad_clicked`
- `home_experiment_carousel_interacted`
- `home_experiment_scroll_depth_reached`
- `home_experiment_town_map_entered`
- `home_category_selected`
- `home_feed_load_failed`
- `home_fab_opened`
- `home_fab_action_clicked`
- `home_item_clicked`

### 동네지도

- `town_map_landing_engaged`
- `town_map_search_opened`
- `town_map_search_submitted`
- `town_map_search_empty_submitted`
- `town_map_recent_searches_cleared`
- `town_map_category_selected`
- `town_map_pin_clicked`
- `town_map_post_clicked`
- `town_map_quick_action_clicked`
- `town_map_bottom_sheet_expanded`
- `town_map_ad_clicked`
- `town_map_contact_clicked`
- `town_map_business_tab_selected`

### 채팅 / 커뮤니티 / 내비게이션

- `chat_thread_opened`
- `chat_appointment_started`
- `chat_appointment_invalid_state`
- `chat_appointment_completed`
- `community_banner_clicked`
- `community_tab_selected`
- `bottom_nav_clicked`

### 판매 플로우

- `sell_flow_redirected_missing_photos`
- `sell_photo_toggled`
- `sell_form_completed`

## 정리 대상 후보
현재 이벤트 중 일부는 향후 통합 검토가 필요합니다.

대표 예시는 아래와 같습니다.

- `home_experiment_ad_clicked`
  향후 `element_clicked` 또는 `ad_clicked` 같은 공통 이벤트로 일반화할 수 있습니다.
- `bottom_nav_clicked`, `community_banner_clicked`, `home_category_selected`
  장기적으로는 클릭 이벤트 계층을 어떻게 통합할지 검토할 수 있습니다.

단, 이 문서의 목적은 현재 즉시 모든 이벤트를 개편하는 것이 아니라, 이후 개편의 판단 기준을 먼저 정하는 데 있습니다.

## 새 이벤트 추가 체크리스트
새 이벤트를 만들기 전에 아래 질문을 먼저 확인합니다.

- 이 이벤트는 기존 이벤트에 속성만 추가해도 표현 가능한가?
- 이벤트 이름이 행동 자체를 설명하는가?
- 화면, 실험, 위치 정보가 이벤트 이름에 과도하게 들어가 있지 않은가?
- 이 이벤트가 없으면 실제 분석 질문에 답할 수 없는가?
- 같은 계열 이벤트와 속성 구조가 일관적인가?

위 질문에 대부분 `아니오`라면 새 이벤트보다 기존 이벤트 재사용을 우선 검토합니다.

## 현재 기준의 한 줄 원칙
이 프로젝트의 이벤트 택소노미는 `행동은 이벤트 이름으로, 맥락은 속성으로` 표현하며, 화면 진입 분석의 표준 이벤트는 `screen_viewed`로 정의합니다.
