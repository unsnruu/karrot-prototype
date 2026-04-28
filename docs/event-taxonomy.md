# 이벤트 택소노미

## 문서 목적
이 문서는 현재 코드베이스에서 실제로 호출되는 Amplitude 이벤트를 기준으로, 이벤트를 어떤 원칙으로 설계하고 해석할지 함께 정의한 운영 문서다.

- 기준 시점: 현재 저장소 코드
- 범위: `components/`, `features/`, `lib/analytics/`
- 제외: 테스트 코드

이 문서는 아래 내용을 설명한다.

- 이벤트 이름을 언제 새로 만들고 언제 기존 이벤트를 재사용할지
- `screen_viewed`를 어떤 기준 이벤트로 사용할지
- 이벤트를 어떤 속성 구조로 해석할지
- 현재 코드에서 실제로 어떤 이벤트가 수집되는지

이 문서는 아래 성격의 문서는 아니다.

- Amplitude SDK 설정 가이드 전체
- 모든 이벤트 payload의 최종 확정 사전
- SQL, 차트, 대시보드 작성법 문서

## 현재 상태 요약
현재 저장소에는 Amplitude 연동 코드가 존재하며, 구조는 이미 아래 패턴으로 수렴해 있다.

- 화면 진입은 `screen_viewed`
- 화면 내 클릭은 `element_clicked`
- 검색 플로우는 `search_*`
- 완료, 실패, 검증처럼 의미가 분명히 다른 행동만 개별 이벤트

Amplitude 초기화는 `lib/analytics/amplitude.ts`에 있으며, SDK는 `@amplitude/unified`를 사용한다. 설정에는 `autocapture: true`가 켜져 있으므로 아래 두 계층이 함께 존재한다.

1. 팀이 명시적으로 보내는 제품 이벤트
2. Amplitude autocapture가 보내는 자동 이벤트

제품 분석의 기준은 1번이다.

현재 활성 실험 variant는 identify로 함께 세팅한다.

- `app_version`
- `experiment_id`
- `iteration`
- `variant`

현재 활성 값은 `app_version=3.0`, `experiment_id=chat_appointment_place_recommendation`, `iteration=1`, `variant=message | callout`이다.

코드 위치: `lib/analytics/visitor-experiment.ts`

## 변경 기록

### 2026-04-20

- `screen_exited`는 현재 코드베이스에서 더 이상 명시적으로 전송되지 않는다.
- 저장소 전체 검색 기준 `screen_exited` 호출 및 관련 트래킹 코드는 존재하지 않는다.
- 운영 기준 이벤트는 계속 `screen_viewed`를 사용한다.

## 핵심 원칙

### 1. 이벤트 이름은 행동을 표현한다
이벤트 이름은 사용자가 무엇을 했는지 표현해야 한다.

권장 예시:

- `screen_viewed`
- `element_clicked`
- `component_interacted`
- `chat_appointment_completed`

비권장 예시:

- `home_experiment_screen_viewed`
- `town_map_search_header_clicked`
- `sell_write_price_chip_click`

### 2. 맥락 차이는 속성으로 표현한다
같은 행동이지만 발생 위치, 실험 조건, 대상이 다를 때는 이벤트를 새로 만들기보다 속성으로 구분한다.

예:

- 같은 화면 진입이면 `screen_viewed`
- 같은 클릭이면 `element_clicked`
- 같은 드래그/확장/스크롤이면 `component_interacted`

그리고 차이는 아래 속성으로 분리한다.

- 어느 화면인가: `screen_name`
- 어느 UI 영역인가: `surface`
- 무엇과 상호작용했는가: `target_type`, `target_name`, `target_id`
- 어떤 실험인가: `experiment_name`, `experiment_variant`

### 3. 새 이벤트는 행동 의미가 달라질 때만 만든다
새 이벤트는 아래 조건일 때만 만든다.

- 사용자의 행동 의미가 기존 이벤트와 명확히 다르다
- 기존 이벤트와 속성 조합만으로는 분석 질문에 답하기 어렵다
- 같은 행동으로 묶으면 해석이 왜곡된다

예:

- `chat_appointment_completed`

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

### 결론
이 프로젝트의 제품 분석 기준 이벤트는 `screen_viewed`다.

Amplitude Browser SDK의 자동 수집 page view 이벤트는 보조 이벤트로 취급한다.

### 왜 `screen_viewed`를 기준으로 삼는가
현재 프로토타입에서 분석하고 싶은 질문은 대부분 URL 자체보다 제품 화면 흐름에 가깝다.

예:

- 사용자가 홈에 진입했는가
- 사용자가 동네지도 검색 화면까지 갔는가
- 사용자가 상품 상세를 봤는가
- 사용자가 판매 작성 플로우 어느 단계까지 갔는가

이 질문은 URL보다 제품이 정의한 `screen_name`으로 보는 편이 더 자연스럽다.

또한 동적 경로가 있는 경우에도 여러 URL을 하나의 제품 화면으로 묶을 수 있다.

예:

- `/community/123`
- `/community/456`

둘 다 제품 관점에서는 `community_post_detail`이다.

### `page_viewed`의 역할
Amplitude autocapture의 page view 이벤트는 아래 질문에는 유용하다.

- 특정 URL path가 실제로 몇 번 열렸는가
- referrer, page title, page URL 기준으로 어떤 유입이 있었는가
- SPA navigation이 URL 단위로 어떻게 움직였는가

하지만 팀의 표준 화면 진입 이벤트는 `screen_viewed`로 통일한다.

### 문서상 취급 원칙

- `screen_viewed`는 제품 표준 이벤트다
- `[Amplitude] Page Viewed`는 SDK 자동 수집 이벤트다
- 대시보드, 퍼널, 실험 해석에서는 `screen_viewed`를 우선 사용한다
- `[Amplitude] Page Viewed`는 디버깅, URL 검증, 보조 분석 용도로만 사용한다

## 네이밍 규칙

### 이벤트 이름

- 전부 `snake_case`를 사용한다
- 이벤트 이름은 행동 중심으로 작성한다
- 가능하면 과거형 동사를 사용한다

### 속성 이름

- 전부 `snake_case`를 사용한다
- Boolean은 `has_*` 형태를 우선 사용한다
- 개수는 `*_count`, 순서는 `*_index` 또는 `*_position`, 비율은 `*_percent`를 우선 사용한다
- 클릭 대상 이름은 기본적으로 `[screen]_[ui_name]` 형태의 정규화 이름을 사용한다
- 행동이 없으면 의미가 모호한 경우에만 action suffix를 추가한다

예:

- `has_title`
- `photo_count`
- `depth_percent`
- `home_search_input`
- `home_item_card`
- `home_sell_fab_start_sell`

## 표준 속성 구조

### 1. 공통 컨텍스트 속성
화면과 위치를 설명하는 기본 속성이다.

- `screen_name`
- `path`
- `query_string`

향후 필요하면 아래도 검토할 수 있다.

- `previous_screen_name`
- `session_id`
- `app_version`
- `platform`

### 2. UI 맥락 속성
같은 행동이 화면 안 어디에서 일어났는지 설명한다.

- `surface`
- `screen_type`

`screen_name`은 제품이 정의한 화면 자체이고, `surface`는 그 화면 안의 UI 영역이다.

예:

- `screen_name=home`
- `surface=header`

### 3. 액션 대상 속성
사용자가 무엇과 상호작용했는지 설명한다.

- `target_type`
- `target_name`
- `target_id`
- `target_position`

`target_name`은 사람이 읽는 자유 텍스트가 아니라 팀이 고정해서 쓰는 taxonomy 이름이다.

### 4. 도메인 속성
도메인별 분석에 필요한 속성이다.

- `category`
- `query`
- `item_id`
- `business_id`
- `trade_type`
- `photo_count`
- `feature_label`
- `return_to`

### 5. 실험 속성
실험 이벤트를 별도 이름으로 과하게 분리하지 않기 위해 쓰는 속성이다.

- `experiment_name`
- `experiment_variant`
- `experiment_surface`
- `experiment_source`

## 현재 실제 이벤트 목록

현재 코드에서 명시적으로 호출되는 이벤트는 총 14개다.

`screen_exited`는 이 목록에 포함되지 않으며, 현재 미사용 상태다.

### 공통 이벤트

- `screen_viewed`
- `element_clicked`
- `search_opened`
- `search_submitted`
- `search_history_cleared`

### 실험/퍼널 이벤트

- `home_experiment_town_map_entered`
- `home_experiment_carousel_interacted`
- `town_map_landing_engaged`

### 도메인 이벤트

- `town_map_bottom_sheet_expanded`
- `home_feed_load_failed`
- `sell_photo_toggled`
- `sell_form_completed`
- `chat_appointment_invalid_state`
- `chat_appointment_started`
- `chat_appointment_completed`

## 공통 이벤트 표준

### `screen_viewed`

#### 기본 속성

- `screen_name`
- `path`
- `query_string`

#### 전송 위치

- 공통 화면: `components/analytics-provider.tsx`
- 로컬 화면 상태가 필요한 sell flow 화면: 각 화면 컴포넌트에서 직접 전송

#### 기본 `screen_name` 매핑
정의: `lib/analytics/screen-view.ts`

- `/` -> `root`
- `/home` -> `home`
- `/community` -> `community`
- `/community/[id]` -> `community_post_detail`
- `/town-map` -> `town_map`
- `/town-map/search` -> `town_map_search`
- `/town-map/businesses/[id]` -> `town_map_business_detail`
- `/chat` -> `chat`
- `/chat/[id]` -> `chat_detail`
- `/chat/[id]/appointment` -> `chat_appointment`
- `/chat/[id]/appointment/location` -> `chat_appointment_location`
- `/my-karrot` -> `my_karrot`
- `/home/services` -> `home_services`
- `/home/sell` -> `sell_entry`
- `/home/sell/photos` -> `sell_photos`
- `/home/sell/write` -> `sell_write`
- `/home/sell/price` -> `sell_price`
- `/home/sell/location` -> `sell_location`
- `/home/sell/preview` -> `sell_preview`
- `/home/items/[id]` -> `item_detail`
- `/home/items/[id]/location` -> `item_location`
- `/exp/[variant]/*` -> `exp_{variant}_{screen}`

#### 로컬 tracked screen
아래 5개는 provider가 아니라 각 화면에서 직접 `screen_viewed`를 보낸다.

- `sell_photos`
  - 추가 속성: `flow_name=sell`, `step_name=photos`, `photo_count`
- `sell_write`
  - 추가 속성: `flow_name=sell`, `step_name=write`, `photo_count`, `has_title`, `has_description`, `has_price`, `has_location`
- `sell_price`
  - 추가 속성: `flow_name=sell`, `step_name=price`, `photo_count`, `has_price`
- `sell_location`
  - 추가 속성: `flow_name=sell`, `step_name=location`, `photo_count`, `has_location`
- `sell_preview`
  - 추가 속성: `flow_name=sell`, `step_name=preview`, `photo_count`, `has_published_item`

#### provider가 붙이는 추가 속성
`components/analytics-provider.tsx`

- 홈 실험 화면
  - `category`
  - `experiment_name=home_to_town_map_entry`
  - `experiment_variant`
- `/developing` 화면
  - `feature_label`
  - `return_to`
  - `screen_type=pending_feature`

### `element_clicked`

클릭 계열 이벤트의 기본 이벤트 이름은 `element_clicked`다.

#### 권장 속성

필수:

- `screen_name`
- `target_name`

권장:

- `path`

선택:

- `experiment_name`
- `experiment_variant`
- `destination_path`

#### `target_name`

- `target_name`은 요소의 제품 역할을 설명하는 정규화 이름이다
- UI 형태나 위치보다 "무엇을 눌렀는가"가 더 직접적인 분석 기준이면 `target_name` 중심으로 충분하다

예:

- `home_search_input`
- `home_item_card`
- `home_sell_fab_start_sell`
- `item_detail_chat_button_open_chat`

#### 현재 `target_name` taxonomy
현재 `target_name` 기준 taxonomy는 아래 22개다.

Navigation:

- `bottom_nav_tab`
  - `target_type=tab`
  - `surface=bottom_navigation`
  - 추가 속성: `tab_label`

Home:

- `home_town_selector`
  - `target_type=button`
  - `surface=header`
- `home_search_input`
  - `target_type=button`
  - `surface=header`
- `home_notification_button`
  - `target_type=button`
  - `surface=header`
- `home_menu_button`
  - `target_type=button`
  - `surface=header`
- `home_category_chip`
  - `target_type=chip`
  - `surface=header`
  - 추가 속성: `category`, `previous_category`
- `home_fab_trigger_open_menu`
  - `target_type=button`
  - `surface=floating_action_button`
- `home_lesson_fab_entry`
  - `target_type=button`
  - `surface=fab_menu`
  - 추가 속성: `action_icon=lesson`
- `home_real_estate_fab_entry`
  - `target_type=button`
  - `surface=fab_menu`
  - 추가 속성: `action_icon=home`
- `home_used_car_fab_entry`
  - `target_type=button`
  - `surface=fab_menu`
  - 추가 속성: `action_icon=car`
- `home_community_fab_entry`
  - `target_type=button`
  - `surface=fab_menu`
  - 추가 속성: `action_icon=community`
- `home_story_fab_entry`
  - `target_type=button`
  - `surface=fab_menu`
  - 추가 속성: `action_icon=story`
- `home_bundle_sale_fab_entry`
  - `target_type=button`
  - `surface=fab_menu`
  - 추가 속성: `action_icon=bundle`
- `home_sell_fab_start_sell`
  - `target_type=button`
  - `surface=fab_menu`
  - 추가 속성: `action_icon=sell`
- `home_item_card`
  - `target_type=card`
  - `surface=feed`
  - 추가 속성: `category`, `is_promoted`
- `home_native_ad`
  - 사용 surface: `inline_card`, `inline_banner`, `top_carousel`
  - 추가 속성: `ad_destination`, `ad_feature`, `experiment_name`, `experiment_surface`, `experiment_variant`

Item Detail:

- `item_detail_location_link`
  - `target_type=link`
  - `surface=content`
  - 추가 속성: `has_meetup_address`, `item_title`, `meetup_hint`
- `item_detail_chat_button_open_chat`
  - `target_type=button`
  - `surface=sticky_footer`
  - 추가 속성: `chat_key`, `seller_name`, `town`

Community:

- `community_top_tab`
  - `target_type=tab`
  - `surface=header`
  - 추가 속성: `previous_tab`
- `community_town_map_banner`
  - `target_type=banner`
  - `surface=meetup_banner`

Chat:

- `chat_thread_row`
  - `target_type=list_item`
  - `surface=thread_list`
  - 추가 속성: `counterparty_name`, `town`

Town Map:

- `town_map_category_chip`
  - `target_type=chip`
  - `surface=header`
  - 추가 속성: `category_label`
- `town_map_business_pin`
  - `target_type=pin`
  - `surface=map`
  - 추가 속성: `pin_label`
- `town_map_quick_action_card`
  - `target_type=card`
  - `surface=bottom_sheet`
  - 추가 속성: `action_label`
- `town_map_bottom_sheet_ad_button`
  - `target_type=button`
  - `surface=bottom_sheet`
- `town_map_post_card`
  - `target_type=card`
  - `surface=bottom_sheet`
  - 추가 속성: `business_name`
- `town_map_business_tab`
  - `target_type=tab`
  - `surface=tab_bar`
  - 추가 속성: `previous_tab`
- `town_map_business_call_button`
  - `target_type=button`
  - `surface=sticky_footer`
  - 추가 속성: `business_name`, `contact_type=call`
- `town_map_business_chat_button`
  - `target_type=button`
  - `surface=sticky_footer`
  - 추가 속성: `business_name`, `contact_type=chat`

### 검색 이벤트

검색 진입과 제출은 클릭 이벤트와 별도로 해석한다.

#### 기본 속성

- `screen_name`
- `path`
- `query_string`
- `search_name`
- `surface`
- `destination_path`
- `query`
- `has_query`

#### 현재 구현

`search_opened`

- 위치: town map 메인 검색 진입
- `screen_name=town_map`
- `search_name=town_map_search_input`
- `surface=header`

`search_submitted`

- 위치: town map 검색 화면
- `screen_name=town_map_search`
- `search_name=town_map_search_input`
- `surface=search_screen`
- 추가 속성: `query`, `has_query`

`search_history_cleared`

- 위치: town map 검색 화면 최근 검색 삭제
- `screen_name=town_map_search`
- `search_name=town_map_search_input`
- `surface=recent_searches`

## 실험 이벤트

실험명은 모두 `home_to_town_map_entry`로 수렴한다.

### `home_experiment_town_map_entered`
홈 실험 광고를 통해 town map에 진입했을 때 전송된다.

주요 속성:

- `experiment_name`
- `experiment_surface`
- `experiment_variant`
- `screen_name`
- `path`
- `target_id`
- `target_name`
- `target_position`
- `target_type`

### `home_experiment_carousel_interacted`
홈 상단 carousel이 실제로 스크롤되면 한 번 전송된다.

주요 속성:

- `ad_count`
- `experiment_name`
- `experiment_surface=top_carousel`
- `experiment_variant`

### `town_map_landing_engaged`
실험 광고를 타고 들어온 town map 랜딩에서 첫 engagement가 발생하면 한 번 전송된다.

주요 속성:

- `engagement_type`
- `experiment_name`
- `experiment_surface`
- `experiment_variant`
- `screen_name`
- `path`
- `target_id`
- `target_name`
- `target_position`
- `target_type`

`engagement_type` 값:

- `dwell`
- `scroll`
- `tap`

## 도메인 특화 이벤트

### Home

- `home_feed_load_failed`
  - 속성: `category`, `offset`, `error_message`

### Sell flow

- `sell_photo_toggled`
  - 속성: `photo_id`, `selected`, `next_selected_count`, `step_name=photos`
- `sell_form_completed`
  - 속성: `has_location`, `photo_count`, `price_text`, `trade_type`

### Chat appointment

- `chat_appointment_invalid_state`
  - 속성: `has_item`, `has_seller`, `source=chat_appointment`
- `chat_appointment_started`
  - 속성: `item_id`, `seller_name`, `thread_id`
- `chat_appointment_completed`
  - 속성: `has_location`, `has_reminder`, `item_id`, `scheduled_date`, `scheduled_time`, `seller_name`, `thread_id`
- `element_clicked(target_name=chat_quick_action_appointment)`
  - 채팅 상세에서 약속잡기 진입 클릭
- `element_clicked(target_name=chat_appointment_complete_button)`
  - 약속 잡기 완료 클릭
- `element_clicked(target_name=chat_appointment_place_recommendation_cta)`
  - `message` variant에서 약속 완료 후 주변 장소 CTA 클릭
- `element_clicked(target_name=chat_appointment_place_recommendation_callout_link)`
  - `callout` variant에서 약속 완료 후 Callout 안의 `동네지도 바로가기` 링크 클릭

### Town Map

- `town_map_bottom_sheet_expanded`
  - 속성: `source=town_map_bottom_sheet`

## 실제 surface 목록

- `bottom_navigation`
- `bottom_sheet`
- `content`
- `fab_menu`
- `feed`
- `floating_action_button`
- `header`
- `inline_banner`
- `inline_card`
- `map`
- `meetup_banner`
- `recent_searches`
- `search_screen`
- `sticky_footer`
- `tab_bar`
- `thread_list`
- `top_carousel`

## 정리
현재 코드는 아래 원칙으로 이해하면 된다.

1. 화면은 `screen_viewed`
2. 클릭은 `element_clicked`
3. 검색은 `search_*`
4. 진짜 별도 의미가 있는 퍼널, 완료, 실패만 개별 이벤트

앞으로 taxonomy 복잡도를 줄이려면 새 이벤트를 계속 만들기보다 아래 두 축을 먼저 관리하는 것이 맞다.

- `target_name` 추가 규칙
- `surface` 추가 규칙
