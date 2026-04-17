# Seed Design Adoption Plan

Last updated: 2026-04-18

## Goal

현재 프로젝트를 당근의 SEED Design과 최대한 가까운 구조로 정렬하고, 이후 실제 `@seed-design/react`, `@seed-design/css`, snippet 기반 도입이 가능하도록 준비한다.

핵심 목표는 두 가지다.

1. 당근이 실제로 제공하는 디자인 시스템을 우선 기준으로 삼는다.
2. 중복 토큰 체계나 임시 스타일 시스템을 더 키우지 않고, SEED로 이행 가능한 구조를 만든다.

## Current 판단

지금 시점에서는 우리만의 토큰 체계를 더 깊게 만드는 것보다, **SEED Design을 실제로 어떻게 도입할지 먼저 판단하는 것**이 우선이다.

그 이유는 다음과 같다.

1. 프로젝트에 아직 SEED가 설치되어 있지 않다.
   - `seed-design.json` 없음
   - `@seed-design/react` 없음
   - `@seed-design/css` 없음

2. 지금 별도 토큰 체계를 만들면 나중에 SEED foundation과 중복될 가능성이 높다.
   - color
   - spacing
   - radius
   - typography

3. 반면 지금까지 진행한 공용 컴포넌트 추출은 낭비가 아니다.
   - `ActionButton`
   - `FieldButton`
   - `UserAvatar`
   - `Tabs`
   - `List`
   - `PageHeader`
   - `AppToolbar`

이 작업은 “우리만의 시스템 구축”이 아니라, 흩어진 하드코딩 UI를 **SEED와 대응 가능한 개념 단위로 정리한 것**으로 본다.

## What We Already Did

현재 코드베이스는 다음 방향으로 1차 정리가 끝난 상태다.

### Shared primitives

- `components/ui/action-button.tsx`
- `components/ui/field-button.tsx`
- `components/ui/user-avatar.tsx`
- `components/ui/selection-chip.tsx`
- `components/ui/tabs.tsx`
- `components/ui/list-section.tsx`
- `components/ui/page-header.tsx`
- `components/ui/app-toolbar.tsx`
- `components/ui/icon-button.tsx`

### 문서화

- `docs/component-inventory.md`

### 의미

이 프리미티브들은 나중에 다음 두 방향 중 하나로 연결될 수 있다.

1. SEED snippet/component로 직접 교체
2. SEED API/스타일 규칙에 맞게 점진적으로 수렴

## Current Project State

현재 프로젝트는 아래 구조를 갖고 있다.

- framework: `Next 15.5.14`
- router: `App Router`
- react: `19.x`
- styling: `Tailwind CSS 3.4.1`
- global css entry: `app/globals.css`
- root layout: `app/layout.tsx`
- tsconfig alias: `@/*`

현재는 아래 항목이 없다.

- `@seed-design/react`
- `@seed-design/css`
- `seed-design.json`
- `seed-design/` snippet 디렉토리
- `seed-design/*` tsconfig path alias

즉, SEED는 아직 전혀 도입되지 않은 상태다.

## Principle

앞으로의 원칙은 아래와 같다.

1. **SEED를 프로젝트의 주축 디자인 시스템으로 삼는다.**
2. **SEED를 먼저 이해하고 도입 경로를 판단한다.**
3. **토큰은 SEED 도입 전략이 정해진 뒤에만 정리한다.**
4. **구조 정리는 계속하되, SEED 개념과 대응되는 방향으로만 한다.**
5. **하드코딩 UI 제거는 “SEED 치환 준비”라는 목적 아래 진행한다.**

## SEED-First Rule

앞으로의 구현 기준은 아래 순서를 따른다.

1. 가능한 경우에는 **SEED가 제공하는 foundation, component, snippet을 우선 사용**한다.
2. 현재 프로젝트의 로컬 프리미티브는 SEED를 대체하는 독자 시스템이 아니라, **SEED로 이행하거나 보완하기 위한 임시 정리층**으로 본다.
3. SEED에 없는 패턴이나, 현재 프로젝트의 도메인 특화 UI만 **로컬 컴포넌트로 추가 구현**한다.
4. 로컬 구현이 필요하더라도 naming, structure, props 방향은 가능한 한 SEED 개념과 충돌하지 않게 맞춘다.

즉, 앞으로의 기본 전략은 “우리 시스템을 먼저 만들고 SEED를 참고한다”가 아니라, **SEED를 기준으로 삼고 비어 있는 부분만 로컬에서 메운다**는 것이다.

## Why Tokens Are Deferred

지금 시점에 우리만의 `light-only` 토큰을 더 만드는 것은 우선순위가 아니다.

그 이유는 다음과 같다.

1. SEED는 이미 foundation을 제공한다.
   - color
   - spacing
   - radius
   - typography

2. 우리가 지금 별도 토큰을 깊게 만들수록, 나중에 SEED를 실제 도입할 때 걷어내야 할 가능성이 커진다.

3. 지금 더 가치 있는 작업은 “토큰 설계”보다 “SEED 도입 경로 확인”이다.
   - 무엇을 설치해야 하는지
   - 현재 프로젝트 구조와 충돌이 없는지
   - 어떤 컴포넌트를 직접 교체할 수 있는지

정리하면, 지금 보류하는 것은 토큰 작업 자체가 불필요해서가 아니라, **SEED를 실제로 쓸 계획이라면 순서가 뒤여야 하기 때문**이다.

## Official Setup Summary

SEED 공식 문서와 스킬 기준으로, 처음 도입할 때의 핵심 흐름은 아래와 같다.

1. 패키지 설치
   - `@seed-design/react`
   - `@seed-design/css`

2. CLI 초기화
   - `npx @seed-design/cli@latest init`
   - `seed-design.json` 생성

3. base CSS import
   - `@seed-design/css/base.css`

4. tsconfig path 추가
   - `seed-design/*`

5. 필요 시 snippet 추가
   - `npx @seed-design/cli@latest add ui:{name}`

Tailwind 3 프로젝트의 경우, 공식 문서는 `@seed-design/tailwind3-plugin` 사용도 안내한다.

## Immediate Plan

### Phase 1. SEED 도입 가능성 조사

목표:
- 현재 Next.js 구조에서 SEED를 어떻게 넣을 수 있는지 판단

할 일:
- `@seed-design/react`, `@seed-design/css` 설치 요구사항 확인
- `seed-design.json` 초기화 방식 확인
- `base.css` import 위치 검토
- 현재 App Router/Next 15 구조에서 manual setup이 맞는지 검토
- plugin 방식이 필요한지, manual 방식으로 충분한지 확인

결과물:
- “이 프로젝트에서 SEED를 도입하는 최소 경로” 문서

### Phase 2. 직접 대체 가능한 컴포넌트 분류

목표:
- 이미 정리한 공용 컴포넌트 중 실제 SEED 컴포넌트로 대체 가능한 범위를 식별

우선 검토 대상:
- `ActionButton`
- `FieldButton`
- `UserAvatar`
- `Tabs`
- `List`
- `Chip`

결과물:
- “직접 대체 가능”
- “스타일/구조만 참고”
- “당분간 로컬 유지”

형태의 매핑표

### Phase 3. snippet 도입 후보 선정

목표:
- 한 번에 전체 도입하지 않고, 가장 안전한 컴포넌트부터 실제 snippet 또는 package 기반 도입을 검토

우선순위 후보:
1. `Action Button`
2. `Avatar`
3. `Field Button`
4. `Tabs`
5. `List`

제외 후보:
- 화면 고유 복합 패턴
- 앱 특화된 business/detail/feed 카드

## Setup Assessment

현재 프로젝트는 SEED를 도입할 수 있는 구조에 가깝다.

### 1. React / Next 호환성

현재 프로젝트는 `react@19`, `next@15` 기반이다.

이번 검토에서는 peer dependency 충돌을 실제 설치로 검증하지는 않았지만, 문서상 SEED React는 현대 React 프로젝트를 대상으로 하고 있으며, App Router 구조 자체가 도입의 직접적인 장애로 보이진 않는다.

판단:
- **도입 검토 가능**
- 실제 설치 시 peer dependency 경고 여부는 별도 확인 필요

### 2. Styling 구조 호환성

현재 프로젝트는 이미 `app/globals.css`를 전역 엔트리로 사용하고 있고, Tailwind 3를 사용한다.

이 구조는 SEED 공식 Tailwind 3 가이드와 접점이 있다.

가능한 기본 경로:
- `@seed-design/css/base.css` import
- `@seed-design/tailwind3-plugin` 추가
- 기존 `tailwind.config.ts`에 plugin 연결

판단:
- **호환 가능성이 높음**
- 다만 현재 `globals.css`의 기존 토큰 레이어와 역할이 겹친다

### 3. Theming 구조 호환성

현재 `app/layout.tsx`의 `<html lang="ko">`에는 SEED 관련 data attribute가 없다.

SEED manual 설치 문서는 `<html>`에 아래 속성을 사용한다.

- `data-seed`
- `data-seed-color-mode`
- `data-seed-user-color-scheme`

우리는 현재 light 모드만 우선 고려 중이므로, 처음 단계에서는 `light-only` 기준 검토가 자연스럽다.

판단:
- **수정 범위가 작음**
- `app/layout.tsx` 수준에서 제어 가능

### 4. TypeScript / 경로 alias 호환성

현재 `tsconfig.json`에는 `@/*`만 등록되어 있다.

SEED snippet을 사용할 경우 아래 alias가 추가로 필요하다.

- `seed-design/*`: `./seed-design/*`

판단:
- **수정 범위가 작음**
- 기존 alias와 공존 가능

## Expected Touch Points

SEED 최소 도입을 위해 가장 먼저 영향을 받는 파일은 아래와 같다.

1. `package.json`
   - 패키지 추가

2. `app/layout.tsx`
   - `<html>` data attribute 추가 검토

3. `app/globals.css`
   - `@seed-design/css/base.css` import 위치 결정
   - 기존 글로벌 토큰과 역할 충돌 여부 확인

4. `tailwind.config.ts`
   - `@seed-design/tailwind3-plugin` 추가 검토

5. `tsconfig.json`
   - `seed-design/*` path alias 추가

6. `seed-design.json`
   - CLI 초기화 결과물

7. `seed-design/`
   - snippet 추가 시 생성될 디렉토리

## Working Order

실행 순서는 아래와 같이 고정한다.

1. SEED 셋업 경로 조사
2. 현재 공용 프리미티브와 SEED 컴포넌트 매핑
3. 실제 snippet 또는 package 도입 후보 선정
4. 필요한 경우에만 foundation 토큰 정리
5. 남는 화면 고유 패턴 커스텀 정리

즉, 앞으로의 작업은 “토큰을 먼저 만들고 나중에 SEED를 맞춘다”가 아니라, **SEED를 먼저 기준으로 세우고 필요한 정리만 뒤따라간다**는 순서를 따른다.

## Integration Strategy

SEED를 현재 프로젝트에 합칠 때는, 한 번에 전체를 갈아끼우지 않는다.

과도기에는 **SEED를 기준 시스템으로 두고, 현재 로컬 공용 컴포넌트를 완충층으로 활용하는 방식**을 사용한다.

### 1. Foundation 먼저, component는 나중

합치는 순서는 아래를 따른다.

1. `@seed-design/css`와 관련 설정을 먼저 검토한다.
2. color, spacing, radius 같은 foundation 기준을 SEED 쪽으로 정렬한다.
3. 컴포넌트는 공용 프리미티브부터 점진적으로 수렴시킨다.
4. 직접 교체가 가능한 경우에만 snippet 또는 package 기반 SEED 컴포넌트로 바꾼다.

즉, **foundation 충돌과 component 충돌을 동시에 일으키지 않도록 단계적으로 나눈다.**

### 2. 로컬 프리미티브는 즉시 삭제하지 않는다

현재의 로컬 공용 컴포넌트는 과도기 동안 유지한다.

예:
- `ActionButton`
- `FieldButton`
- `UserAvatar`
- `Tabs`
- `ListSection`

이 컴포넌트들은 독자 시스템이 아니라, 아래 역할을 하는 adapter로 본다.

1. 기존 사용처의 외부 API를 안정적으로 유지
2. 내부 구현을 SEED 기준으로 점진 전환
3. 충분히 안정화된 후에만 직접 SEED import로 이동

### 3. Source of Truth는 SEED로 고정한다

과도기에도 기준은 하나여야 한다.

- color 기준: SEED
- spacing 기준: SEED
- radius 기준: SEED
- 새 컴포넌트 탐색 기준: SEED

로컬 구현은 이 기준을 벗어나는 독자 규칙을 만들지 않는다.

### 4. CSS는 전역 덮어쓰기보다 점진 연결을 우선한다

초기에는 SEED 스타일을 무작정 전면 적용하지 않는다.

우선순위는 아래와 같다.

1. `base.css` 또는 필요한 foundation 연결 검토
2. Tailwind와의 공존 방식 확인
3. 공용 프리미티브 내부에서 SEED 기준 사용
4. 점진적으로 실제 화면에 확장

즉, 초반 목표는 “전역을 한 번에 바꾸는 것”이 아니라, **새 기준을 무리 없이 연결하는 것**이다.

### 5. 컴포넌트는 세 그룹으로 나눠 관리한다

과도기에는 모든 컴포넌트를 같은 방식으로 다루지 않는다.

#### 직접 교체 가능

SEED component 또는 snippet으로 비교적 자연스럽게 전환 가능한 것

예상 후보:
- `ActionButton`
- `UserAvatar`
- `FieldButton`
- `Tabs`

#### SEED 참고형

SEED 개념은 있지만 현재 앱 구조에 맞춰 로컬 조합이 더 필요한 것

예상 후보:
- `ListSection`
- `AppToolbar`
- `PageHeader`

#### 로컬 유지

도메인 맥락이 강해서 당분간 로컬 구현이 필요한 것

예상 후보:
- `HomeFab`
- 상세 카드
- 피드 카드
- 지도/비즈니스 상세 복합 블록

### 6. Wrapper -> Adapter -> Direct adoption 순서로 이동한다

직접 교체 가능한 컴포넌트도 한 번에 갈아끼우지 않는다.

기본 이동 순서는 아래와 같다.

1. 기존 로컬 wrapper 유지
2. 내부 구현을 SEED 개념과 API에 맞게 조정
3. 필요하면 내부에서 SEED snippet/component를 감싸는 adapter로 전환
4. 충분히 안정화되면 직접 import 구조로 이동

이 순서를 따르면, 기존 사용처와 스타일이 동시에 크게 흔들리는 일을 줄일 수 있다.

## Risks

### 1. 기존 글로벌 토큰과 역할 중복

현재 `app/globals.css`에는 이미 자체 CSS 변수 시스템이 있다.

이 값들은 SEED foundation과 직접 겹칠 가능성이 높다.

의미:
- 처음부터 둘을 동시에 크게 유지하면 혼선이 생길 수 있다
- 어느 층을 기준으로 삼을지 빠르게 정해야 한다

### 2. Tailwind utility naming 충돌이 아니라 “병행 운영” 복잡성

Tailwind 3 플러그인을 쓰면 SEED 토큰 유틸리티를 같이 사용할 수 있지만, 기존 프로젝트 클래스 체계와 당분간 병행 운영해야 한다.

의미:
- 기술적으로는 가능해도, 적용 기준이 없으면 코드가 더 혼합될 수 있다

### 3. snippet 도입 시 로컬 프리미티브와 중복

우리는 이미 `ActionButton`, `FieldButton`, `UserAvatar`, `Tabs`, `ListSection`을 로컬로 추출해 둔 상태다.

의미:
- snippet을 바로 넣기 전에 “직접 교체”와 “API만 참고”를 나눠야 한다

## Deferred Work

아래 작업은 지금 당장 하지 않는다.

### 1. 독자적인 디자인 토큰 체계 확장

보류 이유:
- SEED foundation과 충돌/중복 가능성 큼

### 2. 전역 컬러 토큰 전면 교체

보류 이유:
- SEED 도입 경로를 먼저 정해야 함

### 3. spacing/radius 전체 재정의

보류 이유:
- SEED foundation을 실제로 어떤 방식으로 수용할지 먼저 결정 필요

## Remaining Hotspots

아직 하드코딩 비중이 높은 영역은 남아 있다.

- `features/home/components/home-fab.tsx`
- `features/chat/screens/chat-screen.tsx`
- `features/town-map/screens/town-map-business-detail-screen.tsx`
- `features/community/screens/community-post-detail-screen.tsx`

다만 이 영역들도 앞으로는 무작정 로컬 토큰을 만드는 방식이 아니라, **SEED 대응 개념으로 정리할 수 있는 범위만 선별적으로 정리**한다.

## Decision

현재 기준의 결론은 다음과 같다.

> 다음 단계는 토큰 설계가 아니라,  
> **SEED Design의 실제 도입 경로를 조사하고, 지금 만든 공용 프리미티브 중 무엇이 SEED로 대체 가능한지 판단하는 것**이다.

추가로 현재 프로젝트는 SEED를 도입할 수 있는 구조에 가깝고, 첫 단계는 컴포넌트 전면 교체가 아니라 **Tailwind 3 + App Router 기준의 최소 foundation 연결 경로를 검증하는 것**이 맞다.

## Next Action

바로 다음 작업:

1. 이 프로젝트에 SEED를 넣는 최소 설치/설정 경로 조사
2. 현재 공용 프리미티브와 SEED 컴포넌트의 매핑표 작성

## Next Questions To Resolve

다음 단계에서 확인해야 할 질문은 아래와 같다.

1. `@seed-design/react`, `@seed-design/css`, `@seed-design/tailwind3-plugin` 설치 시 peer dependency 경고가 있는가
2. `base.css`를 현재 `app/globals.css`에 함께 두는 것이 안전한가
3. 초기에는 package import 방식이 좋은가, snippet 방식이 좋은가
4. 지금의 로컬 프리미티브 중 무엇을 실제 SEED snippet으로 교체할 가치가 큰가
