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

## Component Mapping

현재 프로젝트의 공용 프리미티브를 기준으로, SEED 컴포넌트와의 대응 관계를 아래처럼 정리한다.

이 매핑표는 “바로 교체 가능한가”, “SEED를 참고해 adapter로 유지해야 하는가”, “당분간 로컬 유지가 필요한가”를 판단하는 기준 문서로 사용한다.

### Mapping Table

| Local primitive | SEED counterpart | 현재 판단 | 이유 |
| --- | --- | --- | --- |
| `ActionButton` | `Action Button` | 직접 교체 가능 | variant naming이 이미 `brandSolid`, `neutralWeak`, `ghost` 등 SEED와 거의 일치하고, 버튼/링크 래핑만 정리하면 snippet 또는 package 기반 전환이 자연스럽다. |
| `FieldButton` | `Field Button` | 직접 교체 가능 | label, description, placeholder, value 구조가 SEED `Field Button`과 매우 가깝고, 현재 구현도 “입력 필드 모양의 버튼” 개념에 맞춰져 있다. |
| `UserAvatar` | `Avatar` | 직접 교체 가능 | 이미지/대체 표시/사이즈 개념이 그대로 대응된다. 현재는 badge, mask 같은 확장 기능만 빠져 있다. |
| `SelectionChipButton` / `SelectionChipLink` | `Chip.Button`, `Chip.Toggle`, `Chip.RadioItem` | 직접 교체 가능 | 현재 rounded selection chip 패턴이 SEED `Chip` 개념과 거의 동일하다. 다만 지금은 button/link 중심이고, 실제 선택 상태 모델은 SEED의 toggle/radio 쪽으로 더 수렴할 수 있다. |
| `TabsList` / `TextTabLink` / `UnderlineTabLink` | `Tabs` | 직접 교체 가능 | 탭 라벨 전환이라는 개념은 정확히 대응된다. 다만 현재는 링크 기반 탭이고, SEED는 stateful tabs primitive라 URL 상태와 연결하는 adapter가 필요하다. |
| `ListSection` / `ListEmptyState` | `List`, `ListHeader` | SEED 참고형 | 현재 구현은 “섹션 + 헤더 + 빈 상태”를 묶은 상위 조합체이고, SEED `List`는 row/item 구조 중심이다. 헤더는 `ListHeader`와 맞지만 전체 구조는 그대로 1:1 치환되진 않는다. |
| `PageHeader` | `Top Navigation` | SEED 참고형 | 역할은 매우 비슷하지만 현재 구현은 sticky header shell에 가깝고, SEED 쪽은 top navigation anatomy와 title/action 구조가 더 정교하다. 직접 import 교체보다는 구조 참고 후 수렴이 맞다. |
| `AppToolbar` | `Top Navigation` 일부 패턴 | SEED 참고형 | leading/center/trailing 배치는 SEED top navigation과 닮았지만, 독립 toolbar layout으로 더 얇다. 현재 앱 헤더 문맥에 맞춰 로컬 유지 후 점진 수렴이 적절하다. |
| `IconButton` | `Action Button` (`layout=\"iconOnly\"`) 또는 top navigation action slot | SEED 참고형 | 아이콘 단독 액션이라는 의미는 대응되지만, 현재는 link/pending route 동작까지 포함한 앱 전용 래퍼다. 바로 치환하기보다 button 계열 정리 후 흡수하는 편이 안전하다. |

### Direct Adoption Candidates

아래 항목은 실제 snippet 또는 package 기반 도입 우선순위가 높다.

1. `ActionButton` -> `Action Button`
2. `UserAvatar` -> `Avatar`
3. `FieldButton` -> `Field Button`
4. `SelectionChip*` -> `Chip`
5. `Tabs*` -> `Tabs`

공통 특징:
- 현재 API나 variant 개념이 이미 SEED와 가깝다
- 구조 차이보다 styling/system 차이가 더 크다
- wrapper -> adapter -> direct adoption 경로로 옮기기 쉽다

### Reference-First Components

아래 항목은 SEED를 바로 import해서 대체하기보다, **SEED 구조를 참고하면서 로컬 조합체로 유지**하는 편이 더 적절하다.

1. `ListSection` / `ListEmptyState`
2. `PageHeader`
3. `AppToolbar`
4. `IconButton`

이 그룹의 공통 특징:
- 현재 로컬 컴포넌트가 단일 primitive라기보다 화면 조합에 더 가깝다
- SEED 쪽은 더 세분화된 primitive 또는 다른 레벨의 컴포넌트다
- 직접 치환하면 오히려 호출부 수정 범위가 커질 수 있다

### Local-Only For Now

아래 영역은 이번 매핑 범위 밖이며, 당분간 로컬 유지가 맞다.

- `HomeFab`
- 상세 카드 계열
- 피드 카드 계열
- 지도/비즈니스 상세 복합 블록
- 커뮤니티 상세 복합 섹션

이들은 SEED 개념 일부를 참고할 수는 있지만, 현재 프로젝트의 도메인 조합이 훨씬 강하다.

### Mapping Notes

#### `ActionButton`

- 현재 variant 이름이 SEED와 거의 동일하다.
- size는 `small`, `medium`, `large`만 있지만, 구조상 SEED `xsmall` 확장도 가능하다.
- `href`, `pendingFeatureLabel`은 앱 전용 adapter 책임으로 볼 수 있다.

판단:
- **가장 먼저 direct adoption 검토 가능**

#### `FieldButton`

- 현재도 “선택창이나 피커를 여는 field-like button” 개념을 정확히 따르고 있다.
- 향후에는 `FieldButtonValue`, `FieldButtonPlaceholder`처럼 내부 슬롯 구조를 SEED 쪽에 더 가깝게 맞출 수 있다.

판단:
- **direct adoption 후보**

#### `UserAvatar`

- 현재는 최소 구현이지만, 오히려 그래서 SEED `Avatar`로 옮기기 쉽다.
- badge, stack, identity placeholder 같은 기능을 나중에 SEED에서 그대로 흡수할 수 있다.

판단:
- **direct adoption 후보**

#### `SelectionChip`

- 지금은 button/link 래퍼 위주다.
- 필터, 선택, 카테고리 패턴을 더 정리하면 `Chip.Button`, `Chip.Toggle`, `Chip.RadioItem`으로 나눌 수 있다.

판단:
- **직접 대응되지만, 상태 모델 정리가 먼저 필요**

#### `Tabs`

- 현재는 링크 기반 탭이어서 URL과 결합돼 있다.
- SEED `Tabs`는 primitive/state 중심이라, URL query 또는 pathname과 연결하는 adapter 층이 필요하다.

판단:
- **직접 대응되지만 adapter 경유가 적절**

#### `ListSection`

- 현재 컴포넌트는 `ListHeader + Section wrapper + Empty state`를 합친 상위 조합이다.
- SEED `List`는 row/list primitive에 더 가깝기 때문에, 지금 구조를 통째로 치환하면 오히려 과하게 세분화될 수 있다.

판단:
- **SEED 참고형**

#### `PageHeader` / `AppToolbar`

- 두 컴포넌트 모두 SEED `Top Navigation` 디자인 개념과 닿아 있다.
- 다만 현 단계에서는 header shell, action slot, title alignment 정도만 공통이고 실제 API 레벨 대응은 약하다.

판단:
- **Top Navigation 참고형**

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

## Design System Usage Strategy

SEED를 도입한다는 것은 단순히 패키지를 설치하는 것이 아니라, **현재 프로젝트에서 어떤 레이어를 SEED 기준으로 운영할지 정하는 것**이다.

지금 단계에서의 활용 기준은 아래와 같다.

### 1. Foundation은 SEED를 기준층으로 사용한다

색상, 타이포그래피, 스페이싱, radius 같은 foundation은 앞으로 SEED를 기준으로 삼는다.

적용 원칙:
- 역할 기반 색상(`fg`, `bg`, `stroke`)을 우선 사용한다
- palette 값은 예외 상황에서만 사용한다
- spacing과 radius는 새 값을 임의로 늘리기보다 SEED 스케일에 맞춘다
- typography도 기존 임의 수치보다 SEED scale과 naming을 우선 참고한다

즉, foundation은 “우리 정의를 유지하면서 Seed를 참고”하는 것이 아니라, **SEED를 source of truth로 삼고 현재 코드를 거기에 수렴시키는 방향**으로 운영한다.

### 2. Primitive는 adapter 방식으로 활용한다

현재 공용 컴포넌트는 당분간 유지하지만, 역할은 바뀐다.

이제부터 로컬 프리미티브는:
- 독자 UI 라이브러리
가 아니라
- **SEED component를 현재 앱 구조에 맞게 연결하는 adapter**

로 본다.

예:
- `ActionButton` -> SEED `Action Button` adapter
- `UserAvatar` -> SEED `Avatar` adapter 후보
- `FieldButton` -> SEED `Field Button` adapter 후보

실험 단계에서는 공용 primitive를 바로 덮어쓰지 않고, **별도 실험용 adapter 파일**을 두는 방식을 우선한다.

예:
- `components/ui/experiments/seed-action-button.tsx`
- `components/ui/experiments/seed-user-avatar.tsx`

이 방식의 목적:
- 영향 범위를 특정 화면/특정 호출부로 제한
- 실패 시 기존 구현으로 빠르게 복귀
- 공용 wrapper를 성급하게 불안정하게 만들지 않음

### 3. Pattern level은 SEED 참고 + 로컬 조합으로 운영한다

모든 화면 조합이 SEED에 그대로 있는 것은 아니다.

따라서 아래 같은 영역은 당분간 이렇게 다룬다.

- 리스트 섹션
- 페이지 헤더
- 툴바
- 상세 카드
- 피드 카드

운영 방식:
- foundation은 SEED 기준 사용
- 하위 primitive는 가능한 SEED 기반 사용
- 최종 조합과 레이아웃은 로컬에서 유지

즉, **pattern은 로컬에 남더라도 그 재료는 점점 SEED로 바꾸는 방식**이다.

### 4. New UI rule을 명확히 한다

앞으로 새 UI를 추가할 때는 아래 순서를 따른다.

1. SEED에 동일 개념의 foundation이 있는지 확인
2. SEED에 동일 개념의 component/snippet이 있는지 확인
3. 있으면 먼저 SEED를 사용하거나 adapter로 감싼다
4. 없을 때만 로컬 구현을 추가한다

즉, 새 UI는 이제부터 **SEED 우선 탐색 -> 로컬 보완** 순서로 만든다.

### 5. 현재 프로젝트에서의 실제 활용 순서

실제로는 아래 순서로 활용을 넓혀간다.

1. foundation 연결
2. direct adoption 가능한 primitive부터 adapter화
3. reference-first component를 SEED anatomy 기준으로 점진 정리
4. 마지막에 남는 도메인 조합 패턴만 로컬 유지

현재 기준의 구체적인 순서는 이렇다.

1. `ActionButton`
2. `UserAvatar`
3. `FieldButton`
4. `SelectionChip`
5. `Tabs`
6. `ListSection`
7. `PageHeader` / `AppToolbar`

### 6. 무엇을 아직 하지 않을지

SEED를 활용한다고 해서 바로 아래를 하지는 않는다.

- 프로젝트 전역 hex 일괄 제거
- 모든 공용 컴포넌트의 즉시 direct import 전환
- 모든 화면을 SEED snippet으로 재작성
- 도메인 특화 화면 패턴의 강제 표준화

이 작업들은 foundation과 primitive 활용이 안정된 뒤에만 진행한다.

## Experiment File Policy

공용 primitive를 대상으로 SEED 도입 실험을 할 때는 아래 정책을 따른다.

### 1. 실험은 별도 파일로 시작한다

처음 실험은 기존 공용 파일을 직접 바꾸는 대신, 별도 실험 파일에서 시작한다.

원칙:
- 기존 파일은 안정판 유지
- 실험 파일은 제한된 화면 또는 제한된 호출부에서만 사용
- 실험 목적이 끝날 때까지 두 구현이 병행될 수 있음

### 2. 실험 종료 후에는 정리 단계가 반드시 필요하다

실험 파일은 영구적으로 남기는 것을 기본값으로 두지 않는다.

실험이 끝나면 반드시 아래 중 하나를 결정한다.

1. 기존 파일에 실험 결과를 흡수하고, 실험 파일 삭제
2. 실험 파일을 정식 구현으로 승격하고, 기존 파일 삭제 또는 wrapper화
3. 아직 판단이 어려우면 병행 유지하되, 유지 이유와 종료 조건을 문서화

즉, 실험 파일은 만드는 것보다 **어떻게 정리할지까지 포함해서 관리**해야 한다.

### 3. 병행 상태는 문서에 남긴다

기존 구현과 실험 구현이 동시에 존재하면 아래를 문서에 기록한다.

- 어떤 파일이 안정판인지
- 어떤 파일이 실험판인지
- 어느 화면에서 실험판을 쓰는지
- 병행 유지 이유가 무엇인지
- 통합 또는 삭제 조건이 무엇인지

### 4. 최종 목표는 중복 제거다

실험 파일은 안전한 도입을 위한 장치이지, 장기적인 중복 구조를 허용하기 위한 것이 아니다.

따라서 실험이 성공하면:
- 기존 파일과 통합하거나
- 기존 파일을 대체하고
- 불필요한 중복 구현은 삭제한다

실험이 실패하면:
- 실험 파일을 제거하고
- 기존 안정판을 유지한다

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

## Recommended Starting Point

현재 문서와 `seed-design` 스킬 기준으로, 실제 출발점은 아래 순서가 가장 안전하다.

### Step 0. 지금 단계의 목표를 좁힌다

처음부터 “프로젝트 전체를 SEED로 전환”하지 않는다.

첫 목표는 아래 한 가지다.

- **이 프로젝트에 SEED를 최소 비용으로 연결하고, 가장 쉬운 1개 컴포넌트를 실제로 붙여보는 것**

즉, 이번 출발점은 전면 도입이 아니라 **셋업 검증 + 1개 컴포넌트 도입 실험**이다.

### Step 1. Foundation 연결 가능 여부부터 검증한다

가장 먼저 확인할 것은 컴포넌트가 아니라 셋업이다.

우선순위:
1. `@seed-design/react`, `@seed-design/css`, `@seed-design/tailwind3-plugin` 설치 가능 여부 확인
2. `seed-design.json` 초기화 방식 확정
3. `app/layout.tsx`의 light-only 테마 속성 반영 방식 결정
4. `app/globals.css`에서 `@seed-design/css/base.css`를 어떤 식으로 연결할지 결정
5. `tailwind.config.ts`에서 plugin 공존 방식 결정
6. `tsconfig.json`에 `seed-design/*` alias 추가 여부 결정

이 단계의 완료 기준:
- “설치 가능한지”
- “어디를 수정해야 하는지”
- “전역 충돌 없이 시작 가능한지”
를 확인하는 것

### Step 2. 첫 실험 대상은 가장 쉬운 direct adoption 후보로 고른다

매핑표 기준으로 첫 대상은 아래 순서가 좋다.

1. `ActionButton`
2. `UserAvatar`
3. `FieldButton`

이 순서를 추천하는 이유:

- `ActionButton`은 variant naming이 이미 SEED와 거의 일치한다.
- `UserAvatar`는 구조가 단순해서 성공/실패 판단이 빠르다.
- `FieldButton`은 구조는 잘 맞지만 호출 맥락이 조금 더 넓다.

즉, **첫 도입 실험 1순위는 `ActionButton`**이다.

### Step 3. 첫 도입은 package 전면 교체보다 snippet 검토가 유리하다

현재 프로젝트는 이미 로컬 프리미티브를 갖고 있고, SEED-first rule도 “없는 부분만 보완”을 전제로 한다.

그래서 첫 실험은 아래 방향이 맞다.

1. SEED 패키지와 foundation을 연결한다.
2. `npx @seed-design/cli@latest docs action-button` 수준으로 문서/스니펫 정보를 확인한다.
3. 필요하면 `ui:action-button` snippet을 추가한다.
4. 기존 로컬 `ActionButton`을 없애지 않고, 내부 비교 또는 adapter 전환 실험을 한다.

즉, 첫 단계에서는 호출부를 대규모로 바꾸지 않는다.

### Step 4. 성공 기준을 작게 잡는다

첫 실험의 성공 기준은 아래 정도면 충분하다.

1. SEED foundation이 프로젝트에 정상 연결된다.
2. `ActionButton` 하나를 기준으로 스타일/구조/props 대응이 가능한지 확인한다.
3. 기존 화면 1곳에서 시각적/구조적 충돌 없이 작동한다.

이 3개가 확인되면, 그다음부터 `Avatar`, `FieldButton`, `Chip`, `Tabs`로 확장하면 된다.

### Step 5. 아직 하지 않을 것

출발점 단계에서는 아래를 하지 않는다.

- 전체 토큰 재정의
- 전체 공용 컴포넌트 일괄 교체
- 도메인 카드/복합 화면 리팩터링 재시작
- `ListSection`, `PageHeader`, `AppToolbar` 같은 참고형 컴포넌트의 전면 치환

이들은 첫 도입 실험이 성공한 뒤에 판단한다.

## Practical Next Move

지금 당장 가장 적절한 다음 액션은 아래다.

1. SEED 최소 셋업에 필요한 실제 파일 변경 포인트를 확정한다.
2. `ActionButton`을 첫 도입 실험 대상으로 고정한다.
3. foundation 연결 후, local `ActionButton`과 SEED `Action Button`의 adapter 전략을 설계한다.

한 줄로 정리하면:

> **출발점은 “토큰 설계”가 아니라 “SEED foundation 연결 + ActionButton 1개 실험”이다.**

## Execution Status

2026-04-18 기준으로 Step 1의 최소 셋업 작업은 아래까지 진행했다.

### Applied

1. SEED 패키지 설치
   - `@seed-design/react`
   - `@seed-design/css`
   - `@seed-design/tailwind3-plugin`

2. `seed-design.json` 추가
   - `rsc: true`
   - `tsx: true`
   - `path: ./seed-design`

3. `app/layout.tsx`에 light-only 테마 속성 추가
   - `data-seed`
   - `data-seed-color-mode="light-only"`
   - `data-seed-user-color-scheme="light"`

4. `app/globals.css`에 `@seed-design/css/base.css` 연결

5. `tailwind.config.ts`에 `@seed-design/tailwind3-plugin` 연결

6. `tsconfig.json`에 `seed-design/*` alias 추가

### Decision Taken

이번 단계에서는 CLI `init`을 별도 실행하지 않고, 스킬 문서에 나온 최소 설정 형식에 맞춰 `seed-design.json`을 직접 추가했다.

이유:
- 현재 필요한 것은 full snippet bootstrap보다 최소 연결 검증
- 첫 단계에서는 foundation 연결과 설정 충돌 여부 확인이 우선

### Verification Notes

- 패키지 설치는 정상 완료됐다.
- `@seed-design/react`의 peer dependency 기준은 현재 프로젝트(`react@19`)와 직접 충돌하지 않았다.
- 전체 `tsc --noEmit`는 실패했지만, 실패 원인에는 기존 `.next/types` 중복 타입 문제와 이전부터 남아 있던 `components/ui/action-button.tsx` 타입 이슈가 포함돼 있다.
- 즉, 이번 Step 1에서 추가한 SEED 최소 셋업 자체가 유일한 실패 원인이라고 보기는 어렵다.

### Next Step

이제 다음 단계는 문서에서 정한 대로, **`ActionButton`을 첫 direct adoption 실험 대상으로 잡고 SEED `Action Button`과 adapter 전략을 설계하는 것**이다.

### ActionButton Experiment Status

`ActionButton`은 첫 direct adoption 실험 대상으로 실제 연결을 시작했다.

현재는 공용 파일을 직접 덮어쓰는 방식이 아니라, **실험 파일 분리 방식**으로 전환했다.

현재 파일 역할:
- 안정판: `components/ui/action-button.tsx`
- 실험판: `components/ui/experiments/seed-action-button.tsx`

현재 실험 적용 화면:
- `features/home/components/item-detail-chat-button.tsx`

적용 내용:
- 공용 `ActionButton`은 기존 로컬 구현으로 유지
- 실험판 `SeedActionButtonExperiment`가 SEED `ActionButton` 기반 adapter 역할 수행
- `item-detail` 하단 CTA 한 곳에서만 실험판 사용
- `href`와 `pendingFeatureLabel`은 `asChild` 기반 adapter 분기로 유지
- 기존 variant naming (`brandSolid`, `neutralOutline`, `ghost` 등)은 그대로 사용

현재 의미:
- 전역 공용 버튼에는 영향 없이, 특정 화면에서만 SEED 버튼 실험 가능
- 실험 성공 시 공용 버튼 흡수 여부를 판단할 수 있는 구조가 생김

검증 메모:
- `components/ui/action-button.tsx`, `components/ui/experiments/seed-action-button.tsx`, `features/home/components/item-detail-chat-button.tsx` 묶음 타입 검증은 통과
- 브라우저 수준 검증은 현재 로컬 `localhost:3000` 서버 응답 부재로 아직 미완료

### UserAvatar Experiment Status

`UserAvatar`도 동일한 방식으로 실험 파일 분리 전략을 적용했다.

현재 파일 역할:
- 안정판: `components/ui/user-avatar.tsx`
- 실험판: `components/ui/experiments/seed-user-avatar.tsx`

현재 실험 적용 화면:
- `features/home/components/item-detail-main-column.tsx`

적용 내용:
- 공용 `UserAvatar`는 기존 로컬 구현으로 유지
- 실험판 `SeedUserAvatarExperiment`가 SEED `Avatar` 기반 adapter 역할 수행
- `item-detail` 판매자 프로필 아바타 한 곳에서만 실험판 사용

현재 의미:
- 아바타도 전역 교체 없이 특정 화면에서만 SEED 시각/구조 실험 가능
- 버튼과 동일한 방식으로 안정판과 실험판을 분리 운영하는 패턴이 생김

검증 메모:
- `components/ui/user-avatar.tsx`, `components/ui/experiments/seed-user-avatar.tsx`, `features/home/components/item-detail-main-column.tsx` 묶음 타입 검증은 통과
