# Karrot Prototype Roadmap

## Document Purpose
This document defines the intended implementation order for the project.

It exists to show:

- what should be built first
- what can wait until later
- what the team currently considers in scope
- what the immediate todo items are

This document is primarily for sequencing and prioritization.

This document is **not**:

- a product background document
- a permanent architecture rulebook
- a final UX spec for every screen

For product background, use `docs/product-context.md`.
For stable implementation rules, use `docs/implementation-principles.md`.

## Usage Note
If this document is referenced in another thread, it should be treated as the current build order and working checklist.

It may guide implementation priority, but it can still evolve as the project changes.

## Overview
This document tracks the implementation order and current todo list for the Karrot prototype.

The immediate priority is to build the home screen for each bottom-tab destination first, before going deeper into any individual feature flow.

## Current Bottom Tabs
- 홈
- 커뮤니티
- 동네지도
- 채팅
- 나의 당근

## Implementation Principle
- Start with the full bottom-tab structure first.
- Make each tab reachable and visually stable before deepening any one flow.
- Treat each tab's first screen as that tab's "home screen".
- Go deeper only after the base navigation skeleton is complete.

## Phase Plan
### Phase 1. Bottom-tab entry screens
Goal:
Implement the primary landing screen for every bottom tab so the prototype has a complete top-level navigation structure.

Scope:
- 홈 탭 홈 화면
- 커뮤니티 탭 홈 화면
- 동네지도 탭 홈 화면
- 채팅 탭 홈 화면
- 나의 당근 탭 홈 화면
- active state handling in the bottom navigation
- route connection between each tab and its landing screen

Expected outcome:
- Users can tap every bottom tab and land on a corresponding first screen.
- The app feels structurally complete at the navigation level.
- We can then decide where to deepen flows based on experiment priority.

### Phase 2. Depth 2 pages
Goal:
Implement the second-level pages that users reach after entering each tab's home screen.

Scope:
- 상품 상세 페이지
- 업체 상세 페이지
- 커뮤니티 글 상세 페이지
- 채팅방 상세 페이지
- 나의 당근 내 주요 상세/서브 페이지
- depth 1 screen -> depth 2 screen route connection

Expected outcome:
- The prototype supports deeper user flows beyond the first landing screens.
- Each bottom tab starts to feel like a usable product area, not just a shell.
- We can identify which second-level pages matter most for the main experiment.

### Phase 3. Home to Neighborhood Map experiment setup
Goal:
Design and test entry points that move users from 홈 into 동네지도.

Scope:
- define candidate entry points in 홈
- connect those entry points to 동네지도
- compare discoverability and transition behavior

### Phase 4. Supporting flows
Goal:
Add only the supporting depth needed for product understanding and experiment context.

Scope:
- selective 상품 상세 확장
- selective 채팅 흐름 보강
- lightweight states for other tabs if needed

## Current Priority
Right now, the team is prioritizing Phase 1.

That means:
- do not go too deep into item detail or chat yet
- first complete the base home screen for each bottom tab
- make sure the prototype can communicate the full app structure at a glance
- evaluate each landing screen from a mobile-first perspective because current testing will happen only on mobile devices

## Todo List
### Immediate Todo
- [ ] Create a dedicated landing screen for `홈`
- [ ] Create a dedicated landing screen for `커뮤니티`
- [ ] Create a dedicated landing screen for `동네지도`
- [ ] Create a dedicated landing screen for `채팅`
- [ ] Create a dedicated landing screen for `나의 당근`
- [ ] Connect each bottom tab to its own route
- [ ] Make active tab state reflect the current route
- [ ] Ensure the bottom navigation remains consistent across all tab landing screens
- [ ] Verify each bottom-tab landing screen works cleanly in the primary mobile test viewport first

### Next Todo
- [ ] Define the depth 2 pages needed under each bottom tab
- [ ] Prioritize depth 2 pages by product importance
- [ ] Implement 상품 상세 페이지
- [ ] Implement 업체 상세 페이지
- [ ] Implement 커뮤니티 글 상세 페이지
- [ ] Implement 채팅방 상세 페이지
- [ ] Implement 주요 나의 당근 서브 페이지
- [ ] Decide which tab screens should remain lightweight placeholders
- [ ] Decide which tab screens need realistic content first
- [ ] Define the first `홈 -> 동네지도` entry-point experiment

## One-Line Focus
Current implementation focus:

`Build the first landing screen for every bottom-tab destination before deepening feature flows.`
