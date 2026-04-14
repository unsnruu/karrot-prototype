# 당근 프로토타입 아키텍처

## 문서 목적
이 문서는 프로젝트의 권장 코드 구조를 정의하기 위한 문서입니다.

이 문서는 아래 내용을 설명하기 위해 존재합니다.

- 페이지 단위 코드를 어떻게 나눌지
- 책임을 어떤 기준으로 분리할지
- 새로운 코드가 보통 어디에 위치해야 하는지
- 프로토타입이 커질 때 어떤 정도의 타협이 허용되는지

이 문서는 아래 성격의 문서가 아닙니다.

- 제품 전략 문서
- 기능 로드맵
- 시각 디자인 명세
- 모든 파일에 기계적으로 강제되는 엄격한 규칙

제품 배경은 `docs/product-context.md`를 참고합니다.
구현 순서와 현재 우선순위는 `docs/roadmap.md`를 참고합니다.
데이터, 반응형, 변경 범위와 관련된 안정적인 구현 규칙은 `docs/implementation-principles.md`를 참고합니다.

## 사용 범위
이 문서는 아래 상황에서 참고합니다.

- 새 라우트를 추가할 때
- 너무 커진 페이지를 리팩터링할 때
- 데이터 fetching 위치를 결정할 때
- 어떤 UI가 screen, feature component, shared component 중 어디에 속하는지 판단할 때
- 한 파일이 너무 많은 책임을 섞고 있는지 검토할 때

이 문서는 명시적 요청 없이 큰 범위의 리팩터링을 정당화하는 근거로 사용하면 안 됩니다.

## 핵심 원칙
프로젝트는 아래 세 가지를 분리하는 방향을 기본으로 합니다.

- 데이터 fetching
- screen 또는 layout 조합
- 작은 UI component

목표는 라우트 관심사, 페이지 조합 관심사, 재사용 UI 관심사가 하나의 큰 파일로 뭉개지지 않게 하는 것입니다.

한 줄로 요약하면 아래와 같습니다.

`데이터 조회는 route에서, 페이지 조합은 screen에서, 세부 UI는 더 작은 component에서 맡는다.`

## 권장 구조
### 1. Route entry
위치:

- `app/**/page.tsx`

주요 책임:

- route entry 정의
- `params`, `searchParams` 읽기
- 서버 사이드 데이터 fetching 수행
- `redirect`, `notFound` 같은 route-level 제어 처리
- 준비된 데이터를 다음 UI 레이어로 전달

이 레이어에는 큰 페이지 마크업을 오래 쌓아두지 않는 것이 좋습니다.

### 2. Screen composition
위치:

- `features/**/screens/*`

주요 책임:

- 전체 화면 레이아웃 조합
- feature 단위 section 연결
- 이미 조회된 데이터를 props로 받아 사용
- 페이지가 커져도 screen 파일의 가독성을 유지

페이지 크기의 UI 조합은 이 레이어에 두는 것이 기본입니다.

### 3. Feature components
위치:

- `features/**/components/*`

주요 책임:

- 하나의 feature screen 안에 들어가는 더 작은 조각 렌더링
- 전역 재사용 컴포넌트인 척하지 않고 feature 맥락 안에서 역할 수행
- screen 파일이 비대해지지 않도록 지역 UI 로직 분리

예시:

- 리스트 아이템
- 특정 feature 전용 헤더
- 한 feature 안에서만 쓰는 카드
- 지역 인터랙션 위젯

### 4. Shared components
위치:

- `components/**`

주요 책임:

- 여러 feature나 screen에서 실제로 공유되는 UI 보관
- 범용적이거나 cross-feature 성격의 building block 제공

예시:

- navigation
- 공통 layout primitive
- button, modal, 공통 UI 패턴

이 디렉터리는 “component”라는 이름 아래 사실상 페이지 전체를 숨기는 장소가 되면 안 됩니다.

## 책임 경계
코드 위치를 판단할 때는 아래 규칙을 우선합니다.

- routing, params, redirect, server fetching을 안다면 `app` 가까이에 둡니다.
- 페이지 전체 크기의 UI라면 `features/**/screens`에 둡니다.
- 하나의 feature에서만 쓰는 더 작은 조각이면 `features/**/components`에 둡니다.
- 여러 feature에서 재사용된다면 `components/**`에 둡니다.

## Client / Server 가이드
가능하면 client boundary를 작게 유지합니다.

즉 아래를 기본으로 봅니다.

- 인터랙션이 한 부분만 필요한데 screen 전체를 client component로 만들지 않습니다.
- 서버에서 렌더링 가능한 layout과 content는 가능한 한 server에 둡니다.
- 지역 인터랙션만 작은 client component로 분리합니다.

권장 패턴은 아래와 같습니다.

- route가 데이터를 조회한다.
- screen은 가능하면 server-compatible 하게 유지한다.
- 실제 인터랙션이 필요한 작은 island만 `"use client"`를 사용한다.

## 왜 이런 구조를 쓰는가
이 구조는 아래를 개선하기 위해 권장됩니다.

- route 파일의 가독성
- 책임과 소유권의 명확성
- 데이터 소스 변경에 대한 유연성
- route logic을 건드리지 않고도 screen을 리팩터링할 수 있는 구조
- 페이지 전체를 옮기지 않고 작은 UI 조각을 재사용할 수 있는 구조

또한 팀이 변경 영향을 더 안전하게 판단하는 데도 도움이 됩니다.

- route 변경은 routing과 data flow에 영향을 준다.
- screen 변경은 layout과 page composition에 영향을 준다.
- component 변경은 지역 UI 디테일에 영향을 준다.

## 허용 가능한 예외
이 구조는 기본값이지 절대 법칙은 아닙니다.

아래 조건에서는 마크업을 `app/**/page.tsx` 안에 그대로 두어도 괜찮습니다.

- route가 매우 작다.
- UI가 커질 가능성이 낮다.
- 정말 one-off 페이지다.
- 파일을 더 나누는 것이 오히려 과한 ceremony를 만든다.

실무적으로는 아래 기준이 좋습니다.

- 페이지가 작으면 단순하게 유지한다.
- route logic과 큰 UI composition이 한 파일에 섞이기 시작하면 분리한다.

## 실전 리뷰 질문
페이지를 리뷰하거나 새 코드를 계획할 때는 아래를 확인합니다.

- 이 route 파일은 routing과 data flow를 설명하고 있는가, 아니면 거대한 UI 파일이 되어가고 있는가?
- 이 page-sized UI는 진짜 재사용 component인가, 아니면 사실상 screen인가?
- 이 component는 `components/**`에 둘 만큼 충분히 공유되는가, 아니면 feature 전용인가?
- client boundary를 더 작게 만들 수 있는가?
- 나중에 데이터 소스가 바뀌어도 UI 레이어는 대체로 안정적으로 유지될 수 있는가?

## 한 줄 규칙
기본 아키텍처 규칙은 아래와 같습니다.

`app은 route entry와 fetching, screens는 페이지 조합, components는 더 작은 UI 조각에 사용한다.`
