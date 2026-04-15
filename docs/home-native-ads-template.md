# 홈 Native Ad 데이터 입력 템플릿

## 문서 목적
이 문서는 `home_native_ads` 테이블에 넣을 더미 데이터나 운영용 광고 데이터를 작성하기 위한 템플릿입니다.

이 문서는 아래 목적을 가집니다.

- 홈 피드 중간에 들어가는 Native 광고 데이터를 일관된 형식으로 정리한다.
- 생성형 AI에게 광고 데이터를 요청할 때 필요한 입력 형식을 제공한다.
- 광고별 목적지와 노출 위치를 빠짐없이 정리한다.

## 사용 원칙
- 광고 1개당 아래 템플릿 1세트를 사용합니다.
- 현재 placement 는 기본적으로 `home_feed_inline` 을 사용합니다.
- 현재 홈 피드의 as-is 규칙은 `상품 3개마다 광고 1개` 입니다.
- 이번 데이터 세트는 총 `10개`를 기준으로 작성합니다.
- 권장 구성은 아래와 같습니다.
- `동네지도` 광고
- `동네 생활` 광고
- `모임` 광고
- `카페` 광고
- 광고 클릭 시 목적지에 따라 해당 feature 로 이동합니다.
- 현재는 데이터 작성 단계이므로, 우선 광고 내용 자체를 안정적으로 정리하는 데 집중합니다.

## 필드 설명

`title`
- 광고 카드의 메인 문구입니다.
- 1~2줄 안에 들어오도록 짧고 강하게 작성합니다.

`feature`
- 광고가 연결되는 feature 이름입니다.
- 현재 허용값은 아래 네 개로 제한합니다.
- `동네지도`
- `동네 생활`
- `모임`
- `카페`
- 카드에서는 기존 `subtitle` 자리에 노출되지만, 데이터 의미상으로는 보조 문구가 아니라 feature 라벨입니다.

`image_url`
- 광고 카드 썸네일 이미지 경로 또는 URL 입니다.
- 로컬 이미지 경로 또는 원격 URL 모두 가능합니다.
- 현재 단계에서는 비워둡니다.
- 이미지 작업은 추후 `supabase/**` 자산 경로를 기준으로 별도 반영합니다.

`destination`
- 광고 클릭 시 이동할 목적지 feature 입니다.
- 현재 허용값은 아래 네 개로 제한합니다.
- `동네지도`
- `동네 생활`
- `모임`
- `카페`
- 실제 path 는 이후 구현 단계에서 feature 값에 맞춰 연결합니다.
- 즉, 지금 데이터 문서에는 URL path 를 직접 적지 않습니다.

`likes_count`
- 카드 하단 관심 수 표시에 사용합니다.
- 정수로 작성합니다.

`placement_key`
- 광고가 노출되는 위치를 구분하는 값입니다.
- 현재는 기본적으로 `home_feed_inline` 을 사용합니다.

`sort_order`
- 같은 placement 안에서의 정렬 순서입니다.
- 숫자가 작을수록 먼저 사용됩니다.
- 현재 단계에서는 홈 피드 안에서의 기본 순서를 정하는 역할만 합니다.

## 작성 템플릿

```md
## 광고 1
title:
feature:
image_url:
destination:
likes_count:
placement_key:
sort_order:
```

## 여러 개를 한 번에 작성할 때의 템플릿

```md
## 광고 1
title:
feature:
image_url:
destination:
likes_count:
placement_key: home_feed_inline
sort_order: 1

## 광고 2
title:
feature:
image_url:
destination:
likes_count:
placement_key: home_feed_inline
sort_order: 2

## 광고 3
title:
feature:
image_url:
destination:
likes_count:
placement_key: home_feed_inline
sort_order: 3
```

## 생성형 AI 요청용 권장 프롬프트 틀

아래 형식으로 생성해줘:

- 총 10개의 홈 Native 광고 데이터
- feature 값은 아래 네 개 안에서만 사용
- `동네지도`
- `동네 생활`
- `모임`
- `카페`
- 제목은 당근 홈 피드 안에 자연스럽게 섞일 정도로 짧고 클릭 유도형으로 작성
- `feature` 값은 위 네 개 중 하나로만 작성
- `destination` 값도 위 네 개 중 하나로만 작성
- `feature` 와 `destination` 은 서로 동일하게 맞춘다
- likes_count 는 1~99 사이 자연스러운 값으로 작성
- placement_key 는 모두 `home_feed_inline`
- sort_order 는 1부터 순차 증가
- image_url 은 비워둔다
- 결과는 아래 템플릿 형식으로 출력

```md
## 광고 1
title:
feature:
image_url:
destination:
likes_count:
placement_key:
sort_order:
```

## 참고 메모
- 현재 홈 피드에서는 `상품 3개마다 광고 1개`가 들어가는 as-is 를 목표로 합니다.
- 따라서 광고는 “피드 문맥에 섞여도 어색하지 않은 제목”으로 작성하는 것이 중요합니다.
- 이번 작성 범위는 총 10개입니다.
- `feature` 와 `destination` 은 현재 `동네지도`, `동네 생활`, `모임`, `카페` 네 값으로만 제한합니다.
- 실제 URL path 연결과 이미지 경로 연결은 이후 구현 단계에서 별도로 반영합니다.
